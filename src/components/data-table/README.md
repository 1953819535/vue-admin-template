# DataTable 数据表格

一个灵活的数据表格组件，支持多种配置方式。

## 安装依赖

```bash
pnpm dlx shadcn-vue@latest add table
pnpm dlx shadcn-vue@latest add checkbox
```

## 基础用法

### 方式一：columns prop 配置

最简单的使用方式，通过 `columns` prop 定义列配置。

```vue
<script setup lang="ts">
import { DataTable } from '@/components/data-table'

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
]

const data = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
]
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

### 方式二：插槽自定义单元格

使用 `#cell-{key}` 插槽自定义单元格内容。

```vue
<script setup lang="ts">
import { DataTable } from '@/components/data-table'

const columns = [
  { key: 'name', title: '用户名' },
  { key: 'status', title: '状态', slot: 'status' },
  { key: 'action', title: '操作', slot: 'action' },
]

const data = [
  { id: 1, name: '张三', status: 'active' },
  { id: 2, name: '李四', status: 'inactive' },
]
</script>

<template>
  <DataTable :data="data" :columns="columns">
    <!-- 状态列自定义 -->
    <template #cell-status="{ value }">
      <span :class="value === 'active' ? 'text-green-600' : 'text-gray-400'">
        {{ value === 'active' ? '启用' : '禁用' }}
      </span>
    </template>

    <!-- 操作列自定义 -->
    <template #cell-action="{ row }">
      <button class="text-primary" @click="handleEdit(row)">编辑</button>
    </template>
  </DataTable>
</template>
```

### 方式三：DataTableColumn 子组件

使用子组件声明式定义列，更直观。

```vue
<script setup lang="ts">
import { DataTable, DataTableColumn } from '@/components/data-table'

const data = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
]
</script>

<template>
  <DataTable :data="data">
    <DataTableColumn key="id" title="ID" :width="80" />
    <DataTableColumn key="name" title="用户名" />
    <DataTableColumn key="email" title="邮箱" />
    
    <!-- 带插槽的列 -->
    <DataTableColumn key="action" title="操作">
      <template #default="{ row }">
        <button @click="handleEdit(row)">编辑</button>
      </template>
    </DataTableColumn>
  </DataTable>
</template>
```

### 方式四：customRender 渲染函数

使用渲染函数自定义单元格，适合复杂逻辑。

```vue
<script setup lang="ts">
import { h } from 'vue'
import { DataTable } from '@/components/data-table'

const columns = [
  { key: 'name', title: '用户名' },
  {
    key: 'status',
    title: '状态',
    customRender: ({ value }) => {
      return h('span', {
        class: value === 'active' ? 'text-green-600' : 'text-gray-400'
      }, value === 'active' ? '启用' : '禁用')
    }
  },
]
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## 表头自定义

### 方式一：headerSlot 插槽

```vue
<script setup lang="ts">
import { Icon } from '@iconify/vue'

const columns = [
  { key: 'name', title: '用户名', headerSlot: 'name' },
]
</script>

<template>
  <DataTable :data="data" :columns="columns">
    <template #header-name>
      <div class="flex items-center gap-1">
        <Icon icon="lucide:user" class="size-4" />
        用户名
      </div>
    </template>
  </DataTable>
</template>
```

### 方式二：headerRender 渲染函数

```vue
<script setup lang="ts">
import { h } from 'vue'
import { Icon } from '@iconify/vue'

const columns = [
  {
    key: 'email',
    title: '邮箱',
    headerRender: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Icon, { icon: 'lucide:mail', class: 'size-4' }),
      '邮箱'
    ])
  },
]
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## 行选择

启用行选择功能，支持单选和多选。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DataTable } from '@/components/data-table'

const selectedRowKeys = ref<(string | number)[]>([])

const rowSelection = {
  enabled: true,
  getCheckboxProps: (row) => ({
    disabled: row.role === 'admin', // 禁用某些行的选择
  }),
}

function handleChange(keys: (string | number)[], rows: any[]) {
  selectedRowKeys.value = keys
  console.log('选中的行:', rows)
}
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :row-selection="rowSelection"
    @update:selected-row-keys="handleChange"
  />
</template>
```

## 行事件

通过 `customRow` 配置行事件。

```vue
<script setup lang="ts">
import { DataTable } from '@/components/data-table'

function handleClick(row: any, index: number) {
  console.log('点击行:', row)
}
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :custom-row="(row, index) => ({
      onClick: () => handleClick(row, index),
      onDblclick: () => console.log('双击', row),
      onMouseenter: () => console.log('鼠标进入', row),
      onMouseleave: () => console.log('鼠标离开', row),
    })"
  />
</template>
```

## API

### DataTable Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| data | `T[]` | `[]` | 数据源 |
| columns | `ColumnConfig[]` | `[]` | 列配置 |
| loading | `boolean` | `false` | 加载状态 |
| rowKey | `string \| ((row: T) => string \| number)` | `'id'` | 行唯一标识 |
| emptyText | `string` | `'暂无数据'` | 空数据提示 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 表格大小 |
| showHeader | `boolean` | `true` | 是否显示表头 |
| bordered | `boolean` | `false` | 是否显示边框 |
| rowSelection | `RowSelection<T>` | - | 行选择配置 |
| customRow | `RowEvents<T> \| ((row: T, index: number) => RowEvents<T>)` | - | 行事件配置 |

### DataTableColumn Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | `string` | - | 字段名（必填） |
| title | `string` | - | 列标题（必填） |
| width | `number \| string` | - | 列宽 |
| align | `'left' \| 'center' \| 'right'` | `'left'` | 对齐方式 |

### ColumnConfig

```typescript
interface ColumnConfig<T = any> {
  key: string                    // 字段名
  title: string                  // 列标题
  width?: number | string        // 列宽
  align?: 'left' | 'center' | 'right'
  // 单元格
  slot?: string                  // 单元格插槽名
  customRender?: (ctx: CellContext) => VNode | string
  // 表头
  headerSlot?: string            // 表头插槽名
  headerRender?: (ctx: HeaderContext) => VNode | string
}
```

### RowSelection

```typescript
interface RowSelection<T = any> {
  enabled?: boolean                                          // 是否启用行选择
  selectedRowKeys?: (string | number)[]                      // 受控选中的行
  onChange?: (keys: (string | number)[], rows: T[]) => void  // 选择变化回调
  getCheckboxProps?: (row: T) => { disabled?: boolean }      // 复选框属性
}
```

### RowEvents

```typescript
interface RowEvents<T = any> {
  onClick?: (row: T, index: number, event: MouseEvent) => void
  onDblclick?: (row: T, index: number, event: MouseEvent) => void
  onMouseenter?: (row: T, index: number, event: MouseEvent) => void
  onMouseleave?: (row: T, index: number, event: MouseEvent) => void
}
```

### CellContext & HeaderContext

```typescript
interface CellContext<T = any> {
  value: any        // 单元格值
  row: T            // 行数据
  index: number     // 行索引
}

interface HeaderContext<T = any> {
  column: ColumnConfig<T>  // 列配置
  index: number            // 列索引
}
```

### 插槽

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| `cell-{key}` | `CellContext` | 自定义单元格，key 为列的 key |
| `header-{key}` | `HeaderContext` | 自定义表头，key 为列的 key |
| `default` | - | DataTableColumn 子组件 |

### 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:selectedRowKeys` | `(keys: (string \| number)[])` | 行选择变化时触发 |

## 示例

完整示例见 [examples/](./examples/) 目录：

- [基础表格](./examples/basic.vue)
- [自定义单元格](./examples/custom-cell.vue)
- [子组件模式](./examples/column-component.vue)
- [表头自定义](./examples/custom-header.vue)
- [混合模式](./examples/mixed.vue)
- [完整功能](./examples/full-features.vue)

**在线演示**：访问 `/components/data-table` 查看所有示例

## 文件结构

```
src/components/data-table/
├── index.ts              # 导出
├── types.ts              # 类型定义
├── DataTable.vue         # 主组件
├── DataTableColumn.vue   # 列配置组件
├── README.md             # 本文档
└── examples/             # 示例文件
    ├── basic.vue
    ├── custom-cell.vue
    ├── column-component.vue
    ├── custom-header.vue
    ├── mixed.vue
    └── full-features.vue
```