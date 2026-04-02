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
import { DataTable } from "@/components/data-table";

const columns = [
  { key: "id", title: "ID", width: 80 },
  { key: "name", title: "用户名" },
  { key: "email", title: "邮箱" },
];

const data = [
  { id: 1, name: "张三", email: "zhangsan@example.com" },
  { id: 2, name: "李四", email: "lisi@example.com" },
];
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

### 方式二：插槽自定义单元格

使用 `#cell-{key}` 插槽自定义单元格内容。

```vue
<script setup lang="ts">
import { DataTable } from "@/components/data-table";

const columns = [
  { key: "name", title: "用户名" },
  { key: "status", title: "状态" },
  { key: "action", title: "操作" },
];

const data = [
  { id: 1, name: "张三", status: "active" },
  { id: 2, name: "李四", status: "inactive" },
];
</script>

<template>
  <DataTable :data="data" :columns="columns">
    <!-- 状态列自定义 -->
    <template #cell-status="{ value }">
      <span :class="value === 'active' ? 'text-green-600' : 'text-gray-400'">
        {{ value === "active" ? "启用" : "禁用" }}
      </span>
    </template>

    <!-- 操作列自定义 -->
    <template #cell-action="{ row }">
      <button class="text-primary" @click="handleEdit(row)">编辑</button>
    </template>
  </DataTable>
</template>
```

### 方式三：customRender 渲染函数

使用 JSX 自定义单元格，适合复杂逻辑。

```vue
<script setup lang="tsx">
import { DataTable } from "@/components/data-table";

const columns = [
  { key: "name", title: "用户名" },
  {
    key: "status",
    title: "状态",
    customRender: ({ value }) => (
      <span class={value === "active" ? "text-green-600" : "text-gray-400"}>
        {value === "active" ? "启用" : "禁用"}
      </span>
    ),
  },
];
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## 表头自定义

### 方式一：插槽

```vue
<script setup lang="ts">
import { Icon } from "@iconify/vue";

const columns = [{ key: "name", title: "用户名" }];
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
<script setup lang="tsx">
import { Icon } from "@iconify/vue";
import { DataTable } from "@/components/data-table";

const columns = [
  {
    key: "email",
    title: "邮箱",
    headerRender: () => (
      <div class="flex items-center gap-1">
        <Icon icon="lucide:mail" class="size-4" />
        邮箱
      </div>
    ),
  },
];
</script>

<template>
  <DataTable :data="data" :columns="columns" />
</template>
```

## 行选择

启用行选择功能，支持单选和多选。

### 多选模式

```vue
<script setup lang="ts">
import { ref } from "vue";
import { DataTable } from "@/components/data-table";

const selectedRowKeys = ref<(string | number)[]>([]);

const rowSelection = {
  enabled: true,
  type: "multiple" as const, // 多选模式（默认）
  getCheckboxProps: (row) => ({
    disabled: row.role === "admin", // 禁用某些行的选择
  }),
};

function handleChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys;
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

### 单选模式

```vue
<script setup lang="ts">
import { ref } from "vue";
import { DataTable } from "@/components/data-table";

const selectedRowKeys = ref<(string | number)[]>([]);

const rowSelection = {
  enabled: true,
  type: "single" as const, // 单选模式
};

function handleChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys;
  console.log("选中:", keys[0]);
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
import { DataTable } from "@/components/data-table";

function handleClick(row: any, index: number) {
  console.log("点击行:", row);
}
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :custom-row="
      (row, index) => ({
        onClick: () => handleClick(row, index),
        onDblclick: () => console.log('双击', row),
        onMouseenter: () => console.log('鼠标进入', row),
        onMouseleave: () => console.log('鼠标离开', row),
      })
    "
  />
</template>
```

## API

### DataTable Props

| 属性         | 类型                                                        | 默认值       | 说明         |
| ------------ | ----------------------------------------------------------- | ------------ | ------------ |
| data         | `T[]`                                                       | `[]`         | 数据源       |
| columns      | `ColumnConfig[]`                                            | `[]`         | 列配置       |
| loading      | `boolean`                                                   | `false`      | 加载状态     |
| rowKey       | `string \| ((row: T) => string \| number)`                  | `'id'`       | 行唯一标识   |
| emptyText    | `string`                                                    | `'暂无数据'` | 空数据提示   |
| size         | `'xs' \| 'sm' \| 'md' \| 'lg'`                              | `'md'`       | 表格大小     |
| showHeader   | `boolean`                                                   | `true`       | 是否显示表头 |
| bordered     | `boolean`                                                   | `false`      | 是否显示边框 |
| rowSelection | `RowSelection<T>`                                           | -            | 行选择配置   |
| customRow    | `RowEvents<T> \| ((row: T, index: number) => RowEvents<T>)` | -            | 行事件配置   |

### ColumnConfig

```typescript
interface ColumnConfig<T = any> {
  key: string; // 字段名
  title: string; // 列标题
  width?: number | string; // 列宽
  align?: "left" | "center" | "right";
  // 单元格渲染
  customRender?: (ctx: CellContext) => VNode | string;
  // 表头渲染
  headerRender?: (ctx: HeaderContext) => VNode | string;
}
```

### RowSelection

```typescript
interface RowSelection<T = any> {
  enabled?: boolean; // 是否启用行选择
  type?: "single" | "multiple"; // 选择模式：单选或多选
  selectedRowKeys?: (string | number)[]; // 受控选中的行
  onChange?: (keys: (string | number)[], rows: T[]) => void; // 选择变化回调
  getCheckboxProps?: (row: T) => { disabled?: boolean }; // 复选框属性
}
```

### RowEvents

```typescript
interface RowEvents<T = any> {
  onClick?: (row: T, index: number, event: MouseEvent) => void;
  onDblclick?: (row: T, index: number, event: MouseEvent) => void;
  onMouseenter?: (row: T, index: number, event: MouseEvent) => void;
  onMouseleave?: (row: T, index: number, event: MouseEvent) => void;
}
```

### CellContext & HeaderContext

```typescript
interface CellContext<T = any> {
  value: any; // 单元格值
  row: T; // 行数据
  index: number; // 行索引
}

interface HeaderContext<T = any> {
  column: ColumnConfig<T>; // 列配置
  index: number; // 列索引
}
```

### 插槽

| 插槽名         | 参数            | 说明                         |
| -------------- | --------------- | ---------------------------- |
| `cell-{key}`   | `CellContext`   | 自定义单元格，key 为列的 key |
| `header-{key}` | `HeaderContext` | 自定义表头，key 为列的 key   |
| `empty`        | -               | 自定义空数据状态             |

### 事件

| 事件名                   | 参数                           | 说明             |
| ------------------------ | ------------------------------ | ---------------- |
| `update:selectedRowKeys` | `(keys: (string \| number)[])` | 行选择变化时触发 |

## 文件结构

```
src/components/data-table/
├── index.ts              # 导出
├── types.ts              # 类型定义
├── DataTable.vue         # 主组件
├── README.md             # 本文档
```
