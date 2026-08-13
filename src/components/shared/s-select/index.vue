<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SelectClearButton, SelectTagList } from '@/components/shared/select-parts'
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
  change: [value: AcceptableValue | AcceptableValue[] | undefined]
  'visible-change': [visible: boolean]
  clear: []
}>()

const open = ref(false)

// 所有选项
const allOptions = computed(() => (props.groups ? props.groups.flatMap((g) => g.options) : props.options))

// 选项查找 Map
const optionsMap = computed(() => {
  const map = new Map<AcceptableValue, SelectOption>()
  allOptions.value?.forEach((opt) => map.set(opt.value, opt))
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
  return props.modelValue.map((v) => optionsMap.value.get(v)).filter(Boolean) as SelectOption[]
})

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
  const getVal = (v: AcceptableValue) => (typeof v === 'object' && v !== null ? (v as Record<string, any>)[byKey] : undefined)
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

function handleClear() {
  const newValue = props.multiple ? [] : undefined
  emit('update:modelValue', newValue)
  emit('change', newValue)
  emit('clear')
}

function handleRemoveTag(value: AcceptableValue) {
  if (!props.multiple || !Array.isArray(props.modelValue)) return
  const newValue = props.modelValue.filter((v) => !isEqual(v, value))
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<template>
  <div :class="cn('group', props.class)">
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
        <SelectTagList
          v-if="multiple"
          :options="selectedTags"
          :max="maxTags"
          :placeholder="placeholder"
          @remove="handleRemoveTag"
        >
          <template #tag="{ option }">
            <slot name="tag" :option="option">{{ option.label }}</slot>
          </template>
        </SelectTagList>

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

        <SelectClearButton v-if="showClear" class="mr-1" @clear="handleClear" />
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
              <SelectItem v-for="opt in g.options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
                <slot name="option" :option="opt">{{ opt.label }}</slot>
              </SelectItem>
            </SelectGroup>
          </template>

          <!-- 无分组模式 -->
          <template v-else>
            <SelectItem v-for="opt in options" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
              <slot name="option" :option="opt">{{ opt.label }}</slot>
            </SelectItem>
          </template>
        </template>

        <slot name="footer" />
      </SelectContent>
    </Select>
  </div>
</template>
