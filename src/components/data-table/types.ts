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
}