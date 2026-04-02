import type { VNode } from 'vue'

// 单元格上下文
export interface CellContext<T = any> {
  value: any
  row: T
  index: number
}

// 表头上下文
export interface HeaderContext<T = any> {
  column: ColumnConfig<T>
  index: number
}

// 行选择配置
export interface RowSelection<T = any> {
  enabled?: boolean
  type?: 'single' | 'multiple'  // 单选或多选
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void
  getCheckboxProps?: (row: T) => { disabled?: boolean }
}

// 行事件配置
export interface RowEvents<T = any> {
  onClick?: (row: T, index: number, event: MouseEvent) => void
  onDblclick?: (row: T, index: number, event: MouseEvent) => void
  onMouseenter?: (row: T, index: number, event: MouseEvent) => void
  onMouseleave?: (row: T, index: number, event: MouseEvent) => void
}

// 列配置
export interface ColumnConfig<T = any> {
  key: string
  title: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  // 单元格渲染
  customRender?: (ctx: CellContext<T>) => VNode | string
  // 表头渲染
  headerRender?: (ctx: HeaderContext<T>) => VNode | string
}

// DataTable Props
export interface DataTableProps<T = any> {
  data: T[]
  columns?: ColumnConfig<T>[]
  loading?: boolean
  rowKey?: string | ((row: T) => string | number)
  emptyText?: string
  // 表格大小
  size?: 'xs' | 'sm' | 'md' | 'lg'
  // 显示表头
  showHeader?: boolean
  // 边框
  bordered?: boolean
  // 行选择
  rowSelection?: RowSelection<T>
  // 行事件
  customRow?: RowEvents<T> | ((row: T, index: number) => RowEvents<T>)
}