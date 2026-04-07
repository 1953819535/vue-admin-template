<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, ref, useAttrs } from 'vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup as USelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { SelectOption, SelectOptionGroup } from './types'

// 禁用属性自动透传，避免 class 绑定两次
defineOptions({
  inheritAttrs: false,
})

interface SSelectProps {
  /** 当前选中值（单选时为单个值，多选时为数组） */
  modelValue?: AcceptableValue | AcceptableValue[]
  /** 选项列表 */
  options?: SelectOption[]
  /** 分组选项列表（与 options 二选一） */
  groups?: SelectOptionGroup[]
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 触发器尺寸 */
  size?: 'sm' | 'default'
  /** 是否可清空 */
  clearable?: boolean
  /** 是否多选 */
  multiple?: boolean
  /** 多选时最多显示的 tag 数量，超出显示 +N */
  maxTags?: number
  /** 对象比较字段或函数，用于比较对象选项 */
  by?: string | ((a: AcceptableValue, b: AcceptableValue) => boolean)
  /** 自定义触发器样式 */
  triggerClass?: HTMLAttributes['class']
  /** 自定义内容样式 */
  contentClass?: HTMLAttributes['class']
  /** 自定义样式 */
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

// 多选时 value 为数组，单选时为单个值或 undefined
const emit = defineEmits<{
  'update:modelValue': [value: AcceptableValue | AcceptableValue[] | undefined]
  /** 值变化时触发 */
  'change': [value: AcceptableValue | AcceptableValue[] | undefined]
  /** 下拉框显示/隐藏状态变化时触发 */
  'visible-change': [visible: boolean]
  /** 清空时触发 */
  'clear': []
}>()

// 获取透传属性
const attrs = useAttrs()

// 控制下拉框显示状态
const open = ref(false)

// 所有选项（扁平化）- 共享 computed，避免重复计算
const allOptions = computed(() =>
  props.groups ? props.groups.flatMap(g => g.options) : props.options
)

// 选项值查找 Map - 用于 O(1) 查找
const optionsByValue = computed(() => {
  const map = new Map<AcceptableValue, SelectOption>()
  allOptions.value?.forEach(opt => map.set(opt.value, opt))
  return map
})

// 当前选中的选项（单选模式）
const selectedOption = computed(() => {
  if (props.multiple) return null
  if (props.modelValue === undefined || props.modelValue === null) return null
  return optionsByValue.value.get(props.modelValue) ?? null
})

// 当前选中的选项列表（多选模式）- O(n) 而非 O(n*m)
const selectedTags = computed<SelectOption[]>(() => {
  if (!props.multiple) return []
  const values = Array.isArray(props.modelValue) ? props.modelValue : []
  return values.map(v => optionsByValue.value.get(v)).filter(Boolean) as SelectOption[]
})

// 多选时实际显示的 tags（限制数量）
const displayTags = computed(() => selectedTags.value.slice(0, props.maxTags))

// 多选时超出限制的数量
const remainingCount = computed(() => Math.max(0, selectedTags.value.length - props.maxTags))

// 处理分组：支持 options 中的 group 字段或独立的 groups 配置
const processedGroups = computed(() => {
  // 如果提供了 groups，直接使用
  if (props.groups?.length) {
    return props.groups
  }

  // 否则从 options 中提取分组
  if (!props.options?.length) {
    return []
  }

  // 检查是否有分组
  const hasGroups = props.options.some(opt => opt.group)

  if (!hasGroups) {
    // 无分组，返回单个默认组
    return [{ label: '', options: props.options }]
  }

  // 有分组，按 group 字段分组
  const groupMap = new Map<string, SelectOption[]>()

  props.options.forEach(opt => {
    const groupKey = opt.group || ''
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, [])
    }
    groupMap.get(groupKey)!.push(opt)
  })

  return Array.from(groupMap.entries()).map(([label, options]) => ({
    label,
    options,
  }))
})

// 是否有选项 - 使用共享的 allOptions
const hasOptions = computed(() => (allOptions.value?.length ?? 0) > 0)

// 是否显示清空按钮
const showClear = computed(() => {
  if (!props.clearable) return false
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0
  }
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
})

function handleChange(value: AcceptableValue) {
  emit('update:modelValue', value)
  emit('change', value)
}

function handleOpenChange(value: boolean) {
  open.value = value
  emit('visible-change', value)
}

// 清空按钮：拦截 pointerdown 事件，防止下拉框展开
function handleClear(event: MouseEvent | PointerEvent) {
  event.stopPropagation()
  event.preventDefault()
  emit('update:modelValue', props.multiple ? [] : undefined)
  emit('change', props.multiple ? [] : undefined)
  emit('clear')
}

// 多选模式下移除单个 tag
function handleRemoveTag(value: AcceptableValue) {
  if (!props.multiple || !Array.isArray(props.modelValue)) return
  const newValue = props.modelValue.filter(v => v !== value)
  emit('update:modelValue', newValue)
  emit('change', newValue)
}
</script>

<template>
  <!-- 外层包裹 div：实现 group + relative，用于清空按钮定位 -->
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
      <SelectTrigger
        :size="size"
        :class="cn('w-full', triggerClass)"
      >
        <!-- 前缀插槽 -->
        <span v-if="$slots.prefix" class="mr-2 shrink-0">
          <slot name="prefix" />
        </span>

        <!-- 多选模式：显示 tags -->
        <template v-if="multiple">
          <div class="flex flex-wrap gap-1 flex-1 min-w-0">
            <template v-if="selectedTags.length > 0">
              <Badge
                v-for="opt in displayTags"
                :key="String(opt.value)"
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
              <!-- 超出数量显示 +N -->
              <Badge v-if="remainingCount > 0" variant="secondary">
                +{{ remainingCount }}
              </Badge>
            </template>
            <span v-else class="text-muted-foreground">{{ placeholder }}</span>
          </div>
        </template>

        <!-- 单选模式 -->
        <template v-else>
          <span class="flex-1 truncate">
            <SelectValue :placeholder="placeholder">
              <!-- 自定义选中项显示 -->
              <slot v-if="selectedOption" name="label" :option="selectedOption">
                {{ selectedOption.label }}
              </slot>
            </SelectValue>
          </span>
        </template>
      </SelectTrigger>

      <SelectContent :class="contentClass">
        <!-- 头部插槽 -->
        <slot name="header" />

        <!-- 无数据状态 -->
        <div
          v-if="!hasOptions"
          class="py-6 text-center text-sm text-muted-foreground"
        >
          <slot name="empty">
            暂无数据
          </slot>
        </div>

        <!-- 有数据时渲染选项 -->
        <template v-else>
          <template v-for="group in processedGroups" :key="group.label">
            <!-- 有分组标签时显示 SelectGroup -->
            <USelectGroup v-if="group.label">
              <SelectLabel>{{ group.label }}</SelectLabel>
              <SelectItem
                v-for="opt in group.options"
                :key="String(opt.value)"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                <!-- option 插槽支持自定义选项渲染 -->
                <slot name="option" :option="opt">
                  {{ opt.label }}
                </slot>
              </SelectItem>
            </USelectGroup>

            <!-- 无分组标签时直接渲染选项 -->
            <template v-else>
              <SelectItem
                v-for="opt in group.options"
                :key="String(opt.value)"
                :value="opt.value"
                :disabled="opt.disabled"
              >
                <!-- option 插槽支持自定义选项渲染 -->
                <slot name="option" :option="opt">
                  {{ opt.label }}
                </slot>
              </SelectItem>
            </template>
          </template>
        </template>

        <!-- 底部插槽 -->
        <slot name="footer" />
      </SelectContent>
    </Select>

    <!-- 清空按钮：绝对定位在触发器右侧，样式与 ChevronDown 一致 -->
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