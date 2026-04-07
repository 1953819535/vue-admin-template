<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Check, ChevronsUpDown, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import type { ComboboxOption, ComboboxOptionGroup, RemoteSearchFn } from './types'

defineOptions({ inheritAttrs: false })

interface SComboboxProps {
  modelValue?: AcceptableValue | AcceptableValue[]
  options?: ComboboxOption[]
  groups?: ComboboxOptionGroup[]
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  size?: 'sm' | 'default'
  clearable?: boolean
  multiple?: boolean
  maxTags?: number
  by?: string | ((a: AcceptableValue, b: AcceptableValue) => boolean)
  remoteMethod?: RemoteSearchFn
  loading?: boolean
  triggerClass?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SComboboxProps>(), {
  options: () => [],
  placeholder: '请选择',
  searchPlaceholder: '搜索...',
  size: 'default',
  clearable: false,
  multiple: false,
  maxTags: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: AcceptableValue | AcceptableValue[] | undefined]
  'change': [value: AcceptableValue | AcceptableValue[] | undefined]
  'visible-change': [visible: boolean]
  'clear': []
  'search': [query: string]
}>()

const open = ref(false)
const searchQuery = ref('')
const remoteOptions = ref<ComboboxOption[]>([])
const remoteLoading = ref(false)

// 简化的缓存：仅用于远程搜索时保留已选项的 label 显示
const selectedCache = new Map<AcceptableValue, ComboboxOption>()

// 当前显示的选项（远程优先，否则静态）
const displayOptions = computed(() => {
  if (props.remoteMethod && searchQuery.value) {
    return remoteOptions.value
  }
  return props.groups ? props.groups.flatMap(g => g.options) : props.options
})

// 缓存当前显示的选项
watch(displayOptions, (opts) => {
  opts.forEach(opt => selectedCache.set(opt.value, opt))
}, { immediate: true })

// 比较两个值是否相等
function isEqual(a: AcceptableValue, b: AcceptableValue): boolean {
  if (!props.by) return a === b
  if (typeof props.by === 'function') return props.by(a, b)
  // by 为字符串时，比较对象属性
  const byKey = props.by as string
  const getVal = (v: AcceptableValue) =>
    typeof v === 'object' && v !== null ? (v as Record<string, any>)[byKey] : undefined
  return getVal(a) === getVal(b)
}

// 查找选项
function findOption(value: AcceptableValue): ComboboxOption | undefined {
  const match = (opt: ComboboxOption) => isEqual(opt.value, value)
  // 先从缓存找，再从当前显示的找
  return selectedCache.get(value) ?? displayOptions.value.find(match)
}

// 单选当前选项
const selectedOption = computed(() => {
  if (props.multiple || props.modelValue == null) return null
  return findOption(props.modelValue)
})

// 多选标签列表
const selectedTags = computed(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return []
  return props.modelValue.map(v => findOption(v)).filter(Boolean) as ComboboxOption[]
})

const displayTags = computed(() => selectedTags.value.slice(0, props.maxTags))
const remainingCount = computed(() => Math.max(0, selectedTags.value.length - props.maxTags))

const showClear = computed(() => {
  if (!props.clearable || props.disabled) return false
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue != null && props.modelValue !== ''
})

// 选项 key（防止对象值变成 "[object Object]"）
function getOptionKey(opt: ComboboxOption): string {
  const v = opt.value
  if (typeof v === 'object' && v !== null) {
    return JSON.stringify(v)
  }
  return String(v ?? '__empty__')
}

// 多选时已选值的 Set（O(1) 查找），仅当无 by prop 时使用
const selectedValuesSet = computed(() => {
  if (!props.multiple || props.by) return null
  return new Set(Array.isArray(props.modelValue) ? props.modelValue : [])
})

// 判断是否选中
function isSelected(value: AcceptableValue): boolean {
  if (!props.multiple) {
    return props.modelValue != null && isEqual(props.modelValue, value)
  }
  // 有 by prop 时用遍历比较，否则用 Set O(1) 查找
  if (selectedValuesSet.value) {
    return selectedValuesSet.value.has(value)
  }
  const arr = Array.isArray(props.modelValue) ? props.modelValue : []
  return arr.some(v => isEqual(v, value))
}

// 远程搜索版本号（防止竞态）
let searchVersion = 0

async function handleRemoteSearch(query: string) {
  if (!props.remoteMethod) return
  const version = ++searchVersion
  remoteLoading.value = true
  emit('search', query)
  try {
    const results = await props.remoteMethod(query)
    if (version === searchVersion) remoteOptions.value = results
  } catch {
    if (version === searchVersion) remoteOptions.value = []
  } finally {
    if (version === searchVersion) remoteLoading.value = false
  }
}

// 远程搜索防抖
const debouncedRemoteSearch = useDebounceFn(handleRemoteSearch, 300)

watch(searchQuery, (query) => {
  if (!props.remoteMethod || !open.value) return
  debouncedRemoteSearch(query)
})

watch(open, (isOpen) => {
  emit('visible-change', isOpen)
  if (!isOpen) {
    searchQuery.value = ''
    remoteOptions.value = []
    searchVersion = 0
  }
})

function handleSelect(value: AcceptableValue) {
  if (props.multiple) {
    const arr = Array.isArray(props.modelValue) ? props.modelValue : []
    const exists = arr.some(v => isEqual(v, value))
    const newValue = exists ? arr.filter(v => !isEqual(v, value)) : [...arr, value]
    emit('update:modelValue', newValue)
    emit('change', newValue)
    searchQuery.value = ''
  } else {
    const same = props.modelValue != null && isEqual(props.modelValue, value)
    const newValue = same ? undefined : value
    emit('update:modelValue', newValue)
    emit('change', newValue)
    open.value = false
  }
}

function handleClear(e: Event) {
  e.stopPropagation()
  e.preventDefault()
  const newValue = props.multiple ? [] : undefined
  emit('update:modelValue', newValue)
  emit('change', newValue)
  emit('clear')
}

function handleRemoveTag(value: AcceptableValue) {
  if (!props.multiple || !Array.isArray(props.modelValue)) return
  const newValue = props.modelValue.filter(v => !isEqual(v, value))
  emit('update:modelValue', newValue)
  emit('change', newValue)
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
          :disabled="disabled"
          :size="size"
          :class="cn('w-full justify-between font-normal', showClear && 'pr-12', triggerClass)"
        >
          <span v-if="$slots.prefix" class="mr-2 shrink-0">
            <slot name="prefix" />
          </span>

          <template v-if="multiple">
            <div class="flex flex-wrap gap-1 flex-1 min-w-0">
              <template v-if="selectedTags.length">
                <Badge v-for="opt in displayTags" :key="getOptionKey(opt)" variant="secondary" class="gap-1 pr-1">
                  <slot name="tag" :option="opt">{{ opt.label }}</slot>
                  <span
                    class="hover:bg-secondary-foreground/20 rounded-sm cursor-pointer"
                    @pointerdown.stop.prevent="handleRemoveTag(opt.value)"
                    @click.stop.prevent
                  >
                    <X class="size-3" />
                  </span>
                </Badge>
                <Badge v-if="remainingCount > 0" variant="secondary">+{{ remainingCount }}</Badge>
              </template>
              <span v-else class="text-muted-foreground">{{ placeholder }}</span>
            </div>
          </template>

          <template v-else>
            <span v-if="selectedOption" class="flex-1 truncate">
              <slot name="label" :option="selectedOption">{{ selectedOption.label }}</slot>
            </span>
            <span v-else class="text-muted-foreground flex-1 truncate">{{ placeholder }}</span>
          </template>

          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent :class="cn('p-0', contentClass)" align="start" :style="{ width: 'var(--reka-popover-trigger-width)' }">
        <Command :by="by" :should-filter="!remoteMethod">
          <CommandInput v-model="searchQuery" :placeholder="searchPlaceholder" class="h-9" />
          <CommandList>
            <div v-if="remoteLoading || loading" class="py-6 text-center text-sm text-muted-foreground">
              加载中...
            </div>

            <template v-else>
              <!-- 无选项时的空状态 -->
              <div v-if="!displayOptions.length && !groups?.length" class="py-6 text-center text-sm text-muted-foreground">
                <slot name="empty">暂无数据</slot>
              </div>

              <template v-else>
                <template v-if="groups?.length">
                  <CommandGroup v-for="g in groups" :key="g.label" :heading="g.label">
                    <CommandItem
                      v-for="opt in g.options"
                      :key="getOptionKey(opt)"
                      :value="opt.value"
                      :disabled="opt.disabled"
                      @select="handleSelect(opt.value)"
                    >
                      <Check :class="cn('mr-2 size-4', isSelected(opt.value) ? 'opacity-100' : 'opacity-0')" />
                      <slot name="option" :option="opt">{{ opt.label }}</slot>
                    </CommandItem>
                  </CommandGroup>
                </template>

                <CommandGroup v-else>
                  <CommandItem
                    v-for="opt in displayOptions"
                    :key="getOptionKey(opt)"
                    :value="opt.value"
                    :disabled="opt.disabled"
                    @select="handleSelect(opt.value)"
                  >
                    <Check :class="cn('mr-2 size-4', isSelected(opt.value) ? 'opacity-100' : 'opacity-0')" />
                    <slot name="option" :option="opt">{{ opt.label }}</slot>
                  </CommandItem>
                </CommandGroup>

                <CommandEmpty>
                  <slot name="empty">无匹配结果</slot>
                </CommandEmpty>
              </template>
            </template>
          </CommandList>

          <slot name="footer" />
        </Command>
      </PopoverContent>
    </Popover>

    <span
      v-if="showClear"
      class="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-pointer"
      @pointerdown.stop.prevent="handleClear"
      @click.stop.prevent
    >
      <X class="size-4 opacity-50 hover:opacity-100" />
    </span>
  </div>
</template>