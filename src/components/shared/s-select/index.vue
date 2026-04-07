<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, ref, useAttrs } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { SelectOption, SelectOptionGroup } from './types'

defineOptions({ inheritAttrs: false })

interface SSelectProps {
  modelValue?: AcceptableValue | AcceptableValue[]
  options?: SelectOption[]
  groups?: SelectOptionGroup[]
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'default'
  clearable?: boolean
  multiple?: boolean
  maxTags?: number
  by?: string | ((a: AcceptableValue, b: AcceptableValue) => boolean)
  triggerClass?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SSelectProps>(), {
  options: () => [],
  placeholder: '请选择',
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
}>()

const attrs = useAttrs()
const open = ref(false)

// 所有选项
const allOptions = computed(() =>
  props.groups ? props.groups.flatMap(g => g.options) : props.options
)

// 选项查找 Map
const optionsMap = computed(() => {
  const map = new Map<AcceptableValue, SelectOption>()
  allOptions.value?.forEach(opt => map.set(opt.value, opt))
  return map
})

// 单选当前选项
const selectedOption = computed(() => {
  if (props.multiple || props.modelValue == null) return null
  return optionsMap.value.get(props.modelValue)
})

// 多选标签
const selectedTags = computed(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return []
  return props.modelValue.map(v => optionsMap.value.get(v)).filter(Boolean) as SelectOption[]
})

const displayTags = computed(() => selectedTags.value.slice(0, props.maxTags))
const remainingCount = computed(() => Math.max(0, selectedTags.value.length - props.maxTags))

const hasOptions = computed(() => allOptions.value?.length > 0)

const showClear = computed(() => {
  if (!props.clearable || props.disabled) return false
  if (props.multiple) return Array.isArray(props.modelValue) && props.modelValue.length > 0
  return props.modelValue != null && props.modelValue !== ''
})

// 比较两个值是否相等（支持 by prop）
function isEqual(a: AcceptableValue, b: AcceptableValue): boolean {
  if (!props.by) return a === b
  if (typeof props.by === 'function') return props.by(a, b)
  const byKey = props.by as string
  const getVal = (v: AcceptableValue) =>
    typeof v === 'object' && v !== null ? (v as Record<string, any>)[byKey] : undefined
  return getVal(a) === getVal(b)
}

function handleChange(value: AcceptableValue) {
  emit('update:modelValue', value)
  emit('change', value)
}

function handleOpenChange(value: boolean) {
  open.value = value
  emit('visible-change', value)
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
  <div :class="cn('relative group', props.class, attrs.class as string)">
    <Select
      :model-value="modelValue"
      :disabled="disabled"
      :open="open"
      :multiple="multiple"
      :by="by"
      @update:model-value="handleChange"
      @update:open="handleOpenChange"
    >
      <SelectTrigger :size="size" :class="cn('w-full', triggerClass)">
        <span v-if="$slots.prefix" class="mr-2 shrink-0">
          <slot name="prefix" />
        </span>

        <!-- 多选 -->
        <template v-if="multiple">
          <div class="flex flex-wrap gap-1 flex-1 min-w-0">
            <template v-if="selectedTags.length">
              <Badge v-for="opt in displayTags" :key="String(opt.value)" variant="secondary" class="gap-1 pr-1">
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

        <!-- 单选 -->
        <template v-else>
          <span class="flex-1 truncate">
            <SelectValue :placeholder="placeholder">
              <slot v-if="selectedOption" name="label" :option="selectedOption">
                {{ selectedOption.label }}
              </slot>
            </SelectValue>
          </span>
        </template>
      </SelectTrigger>

      <SelectContent :class="contentClass">
        <slot name="header" />

        <div v-if="!hasOptions" class="py-6 text-center text-sm text-muted-foreground">
          <slot name="empty">暂无数据</slot>
        </div>

        <template v-else>
          <!-- 分组模式 -->
          <template v-if="groups?.length">
            <SelectGroup v-for="g in groups" :key="g.label">
              <SelectLabel>{{ g.label }}</SelectLabel>
              <SelectItem
                v-for="opt in g.options"
                :key="String(opt.value)"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                <slot name="option" :option="opt">{{ opt.label }}</slot>
              </SelectItem>
            </SelectGroup>
          </template>

          <!-- 无分组模式 -->
          <template v-else>
            <SelectItem
              v-for="opt in options"
              :key="String(opt.value)"
              :value="opt.value"
              :disabled="opt.disabled"
            >
              <slot name="option" :option="opt">{{ opt.label }}</slot>
            </SelectItem>
          </template>
        </template>

        <slot name="footer" />
      </SelectContent>
    </Select>

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