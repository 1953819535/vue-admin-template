<script setup lang="ts">
import type { AcceptableValue } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Check, ChevronsUpDown, X } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type {
  ComboboxOption,
  ComboboxOptionGroup,
  RemoteSearchFn,
} from "./types";

defineOptions({ inheritAttrs: false });

interface SComboboxProps {
  modelValue?: AcceptableValue | AcceptableValue[];
  options?: ComboboxOption[];
  groups?: ComboboxOptionGroup[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  clearable?: boolean;
  multiple?: boolean;
  maxTags?: number;
  by?: string | ((a: AcceptableValue, b: AcceptableValue) => boolean);
  remoteMethod?: RemoteSearchFn;
  loading?: boolean;
  triggerClass?: HTMLAttributes["class"];
  contentClass?: HTMLAttributes["class"];
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<SComboboxProps>(), {
  options: () => [],
  placeholder: "请选择",
  searchPlaceholder: "搜索...",
  size: "default",
  clearable: false,
  multiple: false,
  maxTags: 3,
});

const emit = defineEmits<{
  "update:modelValue": [value: AcceptableValue | AcceptableValue[] | undefined];
  change: [value: AcceptableValue | AcceptableValue[] | undefined];
  "visible-change": [visible: boolean];
  clear: [];
  search: [query: string];
}>();

const open = ref(false);
const searchQuery = ref("");
const remoteOptions = ref<ComboboxOption[]>([]);
const remoteLoading = ref(false);
let searchVersion = 0;

// 选项缓存：解决远端搜索关闭后，已选项丢失 label 导致 Tag 消失的问题
const optionCache = new Map<AcceptableValue, ComboboxOption>();

const allOptions = computed(() =>
  props.groups ? props.groups.flatMap((g) => g.options) : props.options,
);

const displayOptions = computed(() => {
  if (props.remoteMethod && searchQuery.value) {
    return remoteOptions.value;
  }
  return allOptions.value ?? [];
});

// 监听展示数据，动态更新缓存
watch(
  displayOptions,
  (opts) => {
    opts.forEach((opt) => optionCache.set(opt.value, opt));
  },
  { immediate: true },
);

const optionsByValue = computed(() => {
  const map = new Map<AcceptableValue, ComboboxOption>();
  allOptions.value?.forEach((opt) => map.set(opt.value, opt));
  if (props.remoteMethod && searchQuery.value) {
    remoteOptions.value.forEach((opt) => map.set(opt.value, opt));
  }
  return map;
});

function findOptionByValue(value: AcceptableValue): ComboboxOption | undefined {
  const byProp = props.by;
  if (byProp) {
    if (typeof byProp === "string") {
      const targetValue = (value as Record<string, any>)?.[byProp];
      const checkProp = (opt: ComboboxOption) =>
        (opt.value as Record<string, any>)?.[byProp] === targetValue;

      return (
        allOptions.value?.find(checkProp) ||
        remoteOptions.value.find(checkProp) ||
        Array.from(optionCache.values()).find(checkProp)
      );
    }
    const checkFn = (opt: ComboboxOption) => byProp(opt.value, value);
    return (
      allOptions.value?.find(checkFn) ||
      remoteOptions.value.find(checkFn) ||
      Array.from(optionCache.values()).find(checkFn)
    );
  }
  return optionsByValue.value.get(value) ?? optionCache.get(value);
}

const selectedOption = computed(() => {
  if (props.multiple) return null;
  if (props.modelValue === undefined || props.modelValue === null) return null;
  return findOptionByValue(props.modelValue) ?? null;
});

const selectedTags = computed<ComboboxOption[]>(() => {
  if (!props.multiple) return [];
  const values = Array.isArray(props.modelValue) ? props.modelValue : [];
  return values
    .map((v) => findOptionByValue(v))
    .filter(Boolean) as ComboboxOption[];
});

const displayTags = computed(() => selectedTags.value.slice(0, props.maxTags));
const remainingCount = computed(() =>
  Math.max(0, selectedTags.value.length - props.maxTags),
);

const selectedValuesSet = computed(() => {
  if (!props.multiple || props.by) return null;
  return new Set(Array.isArray(props.modelValue) ? props.modelValue : []);
});

const processedGroups = computed(() => {
  if (props.groups?.length) return props.groups;
  if (!displayOptions.value.length) return [];

  const groupMap = new Map<string, ComboboxOption[]>();
  for (const opt of displayOptions.value) {
    const groupKey = opt.group || "";
    if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
    groupMap.get(groupKey)!.push(opt);
  }

  if (groupMap.size === 1 && groupMap.has("")) {
    return [{ label: "", options: displayOptions.value }];
  }

  return Array.from(groupMap.entries()).map(([label, options]) => ({
    label,
    options,
  }));
});

// 修复：添加 !props.disabled 限制
const showClear = computed(() => {
  if (!props.clearable || props.disabled) return false;
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0;
  }
  return (
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    props.modelValue !== ""
  );
});

function isEqual(val1: AcceptableValue, val2: AcceptableValue): boolean {
  if (props.by) {
    if (typeof props.by === "string") {
      return (
        (val1 as Record<string, any>)?.[props.by] ===
        (val2 as Record<string, any>)?.[props.by]
      );
    }
    return props.by(val1, val2);
  }
  return val1 === val2;
}

// 修复：安全的 key 生成函数，防止对象直接 toString 变成 "[object Object]"
function getOptionKey(opt: ComboboxOption): string | number {
  if (typeof opt.value === "object" && opt.value !== null) {
    if (props.by && typeof props.by === "string") {
      return String((opt.value as any)[props.by]);
    }
    return JSON.stringify(opt.value);
  }
  return String(opt.value);
}

async function handleRemoteSearch(query: string) {
  if (!props.remoteMethod) return;

  const currentVersion = ++searchVersion;
  remoteLoading.value = true;
  emit("search", query);

  try {
    const results = await props.remoteMethod(query);
    if (currentVersion === searchVersion) {
      remoteOptions.value = results;
    }
  } catch (error) {
    if (currentVersion === searchVersion) {
      console.error("Remote search failed:", error);
      remoteOptions.value = [];
    }
  } finally {
    if (currentVersion === searchVersion) {
      remoteLoading.value = false;
    }
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(searchQuery, (query) => {
  if (!props.remoteMethod || !open.value) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => handleRemoteSearch(query), 300);
});

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
});

function customFilter(val: string | AcceptableValue, search: string): number {
  if (!search) return 1;
  const option = findOptionByValue(val as AcceptableValue);
  if (option?.label?.toLowerCase().includes(search.toLowerCase())) return 1;
  return 0;
}

watch(open, (isOpen) => {
  if (!isOpen) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    searchQuery.value = "";
    if (props.remoteMethod) {
      remoteOptions.value = [];
      searchVersion = 0;
    }
  }
  emit("visible-change", isOpen);
});

function handleSelect(value: AcceptableValue) {
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue)
      ? props.modelValue
      : [];
    const isExist = currentValues.some((v) => isEqual(v, value));
    const newValues = isExist
      ? currentValues.filter((v) => !isEqual(v, value))
      : [...currentValues, value];
    emit("update:modelValue", newValues);
    emit("change", newValues);
    searchQuery.value = ""; // 多选模式下清空搜索，方便连续选择
  } else {
    const isSame =
      props.modelValue !== undefined &&
      props.modelValue !== null &&
      isEqual(props.modelValue as AcceptableValue, value);
    const newValue = isSame ? undefined : value;
    emit("update:modelValue", newValue);
    emit("change", newValue);
    open.value = false; // 单选关闭即可，依赖 watch(open) 自动清空搜索
  }
}

function handleClear(event: MouseEvent | PointerEvent) {
  event.stopPropagation();
  event.preventDefault();
  emit("update:modelValue", props.multiple ? [] : undefined);
  emit("change", props.multiple ? [] : undefined);
  emit("clear");
}

function handleRemoveTag(value: AcceptableValue) {
  if (!props.multiple || !Array.isArray(props.modelValue)) return;
  const newValue = props.modelValue.filter((v) => !isEqual(v, value));
  emit("update:modelValue", newValue);
  emit("change", newValue);
}

function isSelected(value: AcceptableValue): boolean {
  if (props.multiple) {
    if (selectedValuesSet.value) {
      return selectedValuesSet.value.has(value);
    }
    const currentValues = Array.isArray(props.modelValue)
      ? props.modelValue
      : [];
    return currentValues.some((v) => isEqual(v, value));
  }
  return (
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    isEqual(props.modelValue as AcceptableValue, value)
  );
}
</script>

<template>
  <div class="relative group">
    <Popover v-model:open="open" :disabled="disabled">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          role="combobox"
          :aria-expanded="open"
          :aria-disabled="disabled"
          :disabled="disabled"
          :size="size"
          :class="
            cn(
              'w-full justify-between font-normal',
              showClear && 'pr-12',
              triggerClass,
            )
          "
        >
          <span v-if="$slots.prefix" class="mr-2 shrink-0">
            <slot name="prefix" />
          </span>

          <template v-if="multiple">
            <div class="flex flex-wrap gap-1 flex-1 min-w-0">
              <template v-if="selectedTags.length > 0">
                <Badge
                  v-for="opt in displayTags"
                  :key="getOptionKey(opt)"
                  variant="secondary"
                  class="gap-1 pr-1"
                >
                  <slot name="tag" :option="opt">
                    {{ opt.label }}
                  </slot>
                  <span
                    class="hover:bg-secondary-foreground/20 rounded-sm cursor-pointer"
                    @pointerdown.stop.prevent="handleRemoveTag(opt.value)"
                    @click.stop.prevent
                  >
                    <X class="size-3" />
                  </span>
                </Badge>
                <Badge v-if="remainingCount > 0" variant="secondary">
                  +{{ remainingCount }}
                </Badge>
              </template>
              <span v-else class="text-muted-foreground">{{
                placeholder
              }}</span>
            </div>
          </template>

          <template v-else>
            <span v-if="selectedOption" class="flex-1 truncate">
              <slot name="label" :option="selectedOption">
                {{ selectedOption.label }}
              </slot>
            </span>
            <span v-else class="text-muted-foreground flex-1 truncate">{{
              placeholder
            }}</span>
          </template>

          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        :class="cn('p-0', contentClass)"
        align="start"
        :style="{ width: 'var(--reka-popover-trigger-width)' }"
      >
        <Command
          :by="by"
          :filter-function="customFilter"
          :should-filter="!remoteMethod"
        >
          <CommandInput
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            class="h-9"
          />

          <CommandList>
            <div
              v-if="remoteLoading || loading"
              class="py-6 text-center text-sm text-muted-foreground"
            >
              加载中...
            </div>

            <template v-else>
              <CommandGroup
                v-for="group in processedGroups"
                :key="group.label"
                :heading="group.label || undefined"
              >
                <!-- 替换原先的 String(opt.value) 防止对象报 Duplicate keys 警告 -->
                <CommandItem
                  v-for="opt in group.options"
                  :key="getOptionKey(opt)"
                  :value="opt.value"
                  :disabled="opt.disabled"
                  @select="handleSelect(opt.value)"
                >
                  <Check
                    :class="
                      cn(
                        'mr-2 size-4',
                        isSelected(opt.value) ? 'opacity-100' : 'opacity-0',
                      )
                    "
                  />
                  <slot name="option" :option="opt">
                    {{ opt.label }}
                  </slot>
                </CommandItem>
              </CommandGroup>

              <CommandEmpty>
                <slot name="empty">无匹配结果</slot>
              </CommandEmpty>
            </template>
          </CommandList>

          <slot name="footer" />
        </Command>
      </PopoverContent>
    </Popover>

    <span
      v-if="showClear"
      class="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-80 cursor-pointer"
      @pointerdown.stop.prevent="handleClear"
      @click.stop.prevent
    >
      <X class="size-4 opacity-50 hover:opacity-100" />
    </span>
  </div>
</template>
