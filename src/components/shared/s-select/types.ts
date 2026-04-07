import type { AcceptableValue } from 'reka-ui'

/** Select 选项配置 */
export interface SelectOption {
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

/** Select 分组配置 */
export interface SelectOptionGroup {
  /** 分组名称 */
  label: string
  /** 分组下的选项 */
  options: SelectOption[]
}