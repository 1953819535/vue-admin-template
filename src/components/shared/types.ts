import type { AcceptableValue } from 'reka-ui'

/** 选项配置（用于 Select/Combobox） */
export interface OptionItem {
  /** 选项标签（显示文本） */
  label: string
  /** 选项值 */
  value: AcceptableValue
  /** 是否禁用 */
  disabled?: boolean
  /** 分组名称（用于分组显示） */
  group?: string
  /** 支持扩展属性 */
  [key: string]: any
}

/** 选项分组配置 */
export interface OptionGroup {
  /** 分组名称 */
  label: string
  /** 分组下的选项 */
  options: OptionItem[]
}

// 类型别名保持向后兼容
export type SelectOption = OptionItem
export type SelectOptionGroup = OptionGroup
export type ComboboxOption = OptionItem
export type ComboboxOptionGroup = OptionGroup

/** 远程搜索函数类型 */
export type RemoteSearchFn = (query: string) => Promise<OptionItem[]>