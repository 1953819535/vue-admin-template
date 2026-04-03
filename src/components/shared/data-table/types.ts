import type { VNode } from 'vue'

export interface CellContext<T = any> {
  value: any
  row: T
  index: number
}

export interface HeaderContext<T = any> {
  column: ColumnConfig<T>
  index: number
}

export interface RowSelection<T = any> {
  enabled?: boolean
  type?: 'single' | 'multiple'
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void
  getCheckboxProps?: (row: T) => { disabled?: boolean }
}

export interface RowEvents<T = any> {
  onClick?: (row: T, index: number, event: MouseEvent) => void
  onDblclick?: (row: T, index: number, event: MouseEvent) => void
  onMouseenter?: (row: T, index: number, event: MouseEvent) => void
  onMouseleave?: (row: T, index: number, event: MouseEvent) => void
}

export interface ColumnConfig<T = any> {
  key: string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  customRender?: (ctx: CellContext<T>) => VNode | string
  headerRender?: (ctx: HeaderContext<T>) => VNode | string
}

export type TableSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * DataTable 分页配置
 * 属性与 PaginationBar 保持一致，额外支持后端分页和位置配置
 */
export interface PaginationConfig {
  /** 当前页码 */
  page?: number
  /** 每页条数 */
  pageSize?: number
  /** 总条数（后端分页必填） */
  total?: number
  /** 每页条数选项 */
  pageSizes?: number[]
  /** 是否显示总条数 */
  showTotal?: boolean
  /** 是否显示每页条数切换器 */
  showSizeChanger?: boolean
  /** 是否后端分页（true 时不切片数据） */
  remote?: boolean
  /** 分页位置 */
  position?: 'left' | 'center' | 'right'
}

export interface DataTableProps<T = any> {
  data: T[]
  columns?: ColumnConfig<T>[]
  loading?: boolean
  rowKey?: string | ((row: T) => string | number)
  emptyText?: string
  size?: TableSize
  showHeader?: boolean
  bordered?: boolean
  rowSelection?: RowSelection<T>
  customRow?: RowEvents<T> | ((row: T, index: number) => RowEvents<T>)
  /** 分页配置，true 启用前端分页，对象可自定义配置 */
  pagination?: boolean | PaginationConfig
}