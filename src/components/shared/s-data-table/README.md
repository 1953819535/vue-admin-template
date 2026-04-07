# SDataTable 数据表格

高性能数据表格组件，支持多种配置方式、行选择、分页、排序等功能。

## 安装依赖

```bash
pnpm dlx shadcn-vue@latest add table checkbox radio-group empty
```

## 何时使用

- 当有大量结构化的数据需要展现时
- 当需要对数据进行排序、筛选、分页等操作时
- 当需要行选择功能时

## 代码演示

### 基础表格

最简单的表格用法，通过 `columns` 和 `data` 定义列和数据。

```vue
<script setup lang="ts">
import { SDataTable } from "@/components/shared";

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
  <SDataTable :data="data" :columns="columns" />
</template>
```

### 可排序表格

点击表头排序，支持本地排序和远程排序。

#### 本地排序

设置 `sortable: true` 启用列排序，组件自动处理排序逻辑。

```vue
<script setup lang="ts">
import { SDataTable } from "@/components/shared";

const columns = [
  { key: "id", title: "ID", width: 80, sortable: true },
  { key: "name", title: "用户名", sortable: true },
  { key: "age", title: "年龄", sortable: true, sortFn: (a, b) => a.age - b.age },
  { key: "email", title: "邮箱" },
];

const data = [
  { id: 1, name: "张三", age: 28, email: "zhangsan@example.com" },
  { id: 2, name: "李四", age: 32, email: "lisi@example.com" },
  { id: 3, name: "王五", age: 25, email: "wangwu@example.com" },
];
</script>

<template>
  <SDataTable :data="data" :columns="columns" />
</template>
```

#### 远程模式

配合后端 API 使用，设置 `remote: true`，分页和排序由外部处理。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SDataTable } from "@/components/shared";
import type { SortInfo } from "@/components/shared";

const columns = [
  { key: "id", title: "ID", sortable: true },
  { key: "name", title: "用户名", sortable: true },
];

const data = ref([]);
const sort = ref<SortInfo>();
const page = ref(1);

const pagination = {
  total: 100,
};

async function handleSortChange(newSort: SortInfo | undefined) {
  sort.value = newSort;
  fetchData();
}

async function handlePageChange(newPage: number) {
  page.value = newPage;
  fetchData();
}

async function fetchData() {
  const response = await fetch(`/api/users?page=${page.value}&sort=${sort.value?.field}&order=${sort.value?.order}`);
  data.value = await response.json();
}
</script>

<template>
  <SDataTable
    :data="data"
    :columns="columns"
    :pagination="pagination"
    :sort="sort"
    remote
    @update:sort="handleSortChange"
    @update:page="handlePageChange"
  />
</template>
```

#### 受控排序

外部完全控制排序状态。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SDataTable } from "@/components/shared";

const columns = [
  { key: "name", title: "用户名", sortable: true },
];

const data = [...];
const currentSort = ref({ field: "name", order: "ascend" });
</script>

<template>
  <SDataTable
    :data="data"
    :columns="columns"
    :sort="currentSort"
    @update:sort="currentSort = $event"
  />
</template>
```

#### 自定义排序方向

通过 `sortDirections` 控制支持的排序方向。

```vue
<script setup lang="ts">
const columns = [
  // 只支持升序和降序，不支持取消排序
  { key: "name", title: "用户名", sortable: true, sortDirections: ["ascend", "descend"] },
  
  // 只支持降序
  { key: "score", title: "分数", sortable: true, sortDirections: ["descend"] },
];
</script>
```

### 带分页的表格

#### 前端分页

设置 `pagination: true` 或配置对象，组件自动切片数据。

```vue
<script setup lang="ts">
import { SDataTable } from "@/components/shared";

const data = [...]; // 大量数据

const pagination = {
  pageSize: 10,
  pageSizes: [10, 20, 50],
  showTotal: true,
  position: "right",
};
</script>

<template>
  <SDataTable :data="data" :columns="columns" :pagination="pagination" />
</template>
```

#### 后端分页

设置 `remote: true`，配合 API 使用。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SDataTable } from "@/components/shared";

const data = ref([]);
const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 100,
  remote: true,
});

async function handlePageChange(page: number) {
  const response = await fetch(`/api/users?page=${page}&size=${pagination.value.pageSize}`);
  data.value = await response.json();
  pagination.value.page = page;
}
</script>

<template>
  <SDataTable
    :data="data"
    :columns="columns"
    :pagination="pagination"
    @update:page="handlePageChange"
  />
</template>
```

### 行选择

#### 多选模式

```vue
<script setup lang="ts">
import { ref } from "vue";
import { SDataTable } from "@/components/shared";

const selectedRowKeys = ref<(string | number)[]>([]);

const rowSelection = {
  enabled: true,
  type: "multiple" as const,
  getCheckboxProps: (row) => ({
    disabled: row.role === "admin", // 禁用某些行
  }),
};
</script>

<template>
  <SDataTable
    :data="data"
    :columns="columns"
    :row-selection="rowSelection"
    @update:selected-row-keys="selectedRowKeys = $event"
  />
</template>
```

#### 单选模式

```vue
<script setup lang="ts">
const rowSelection = {
  enabled: true,
  type: "single" as const,
};
</script>
```

### 自定义单元格

#### 方式一：插槽

使用 `#cell-{key}` 插槽自定义单元格。

```vue
<template>
  <SDataTable :data="data" :columns="columns">
    <!-- 状态列 -->
    <template #cell-status="{ value }">
      <Badge :variant="value === 'active' ? 'default' : 'secondary'">
        {{ value === "active" ? "启用" : "禁用" }}
      </Badge>
    </template>

    <!-- 操作列 -->
    <template #cell-action="{ row }">
      <Button variant="link" size="sm" @click="handleEdit(row)">编辑</Button>
    </template>
  </SDataTable>
</template>
```

#### 方式二：customRender

使用 JSX 渲染函数，适合复杂逻辑。

```vue
<script setup lang="tsx">
const columns = [
  { key: "name", title: "用户名" },
  {
    key: "status",
    title: "状态",
    customRender: ({ value }) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "启用" : "禁用"}
      </Badge>
    ),
  },
];
</script>
```

### 自定义表头

#### 方式一：插槽

```vue
<template>
  <SDataTable :data="data" :columns="columns">
    <template #header-name>
      <div class="flex items-center gap-1">
        <Icon icon="lucide:user" class="size-4" />
        用户名
      </div>
    </template>
  </SDataTable>
</template>
```

#### 方式二：headerRender

```vue
<script setup lang="tsx">
import { Icon } from "@iconify/vue";

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
```

### 行事件

通过 `customRow` 配置行事件，支持点击、双击、鼠标进入/离开。

```vue
<script setup lang="ts">
function getRowEvents(row: any, index: number) {
  return {
    onClick: () => console.log("点击", row),
    onDblclick: () => console.log("双击", row),
    onMouseenter: () => console.log("进入", row),
    onMouseleave: () => console.log("离开", row),
  };
}
</script>

<template>
  <SDataTable :data="data" :columns="columns" :custom-row="getRowEvents" />
</template>
```

### 加载状态

```vue
<template>
  <SDataTable :data="data" :columns="columns" :loading="true" />
</template>
```

### 表格尺寸

支持四种尺寸：`xs`、`sm`、`md`、`lg`。

```vue
<template>
  <SDataTable :data="data" :columns="columns" size="sm" />
</template>
```

### 带边框表格

```vue
<template>
  <SDataTable :data="data" :columns="columns" bordered />
</template>
```

### 自定义空数据

```vue
<template>
  <SDataTable :data="[]" :columns="columns">
    <template #empty>
      <div class="flex flex-col items-center gap-3 py-8">
        <Icon icon="lucide:users" class="size-12 text-muted-foreground/50" />
        <div class="text-muted-foreground">暂无数据</div>
        <Button size="sm">添加用户</Button>
      </div>
    </template>
  </SDataTable>
</template>
```

### 行展开

通过 `expandable` 配置行展开功能，展示更多详情信息。

#### 基础展开

```vue
<script setup lang="ts">
import { SDataTable } from "@/components/shared";

const expandable = {
  expandedRowRender: (row) => `详情：${row.description}`,
};
</script>

<template>
  <SDataTable :data="data" :columns="columns" :expandable="expandable" />
</template>
```

#### 使用插槽

```vue
<template>
  <SDataTable :data="data" :columns="columns" :expandable="{}">
    <template #expandedRow="{ row }">
      <div class="p-4 bg-muted/50 rounded">
        <h4 class="font-medium mb-2">{{ row.name }} 详情</h4>
        <p class="text-muted-foreground">{{ row.description }}</p>
      </div>
    </template>
  </SDataTable>
</template>
```

#### 受控展开

```vue
<script setup lang="ts">
import { ref } from "vue";

const expandedRowKeys = ref([1, 3]); // 默认展开 ID 为 1 和 3 的行

const expandable = {
  expandedRowKeys: expandedRowKeys.value,
  expandedRowRender: (row) => `详情：${row.description}`,
};

function handleExpandChange(keys) {
  expandedRowKeys.value = keys;
}
</script>

<template>
  <SDataTable
    :data="data"
    :columns="columns"
    :expandable="expandable"
    @update:expanded-row-keys="handleExpandChange"
  />
</template>
```

#### 条件展开

通过 `rowExpandable` 控制哪些行可以展开。

```vue
<script setup lang="ts">
const expandable = {
  // 只有有 children 的行才能展开
  rowExpandable: (row) => row.hasChildren,
  expandedRowRender: (row) => row.children.map(c => c.name).join(', '),
};
</script>
```

#### 缓存展开内容

设置 `keepExpanded: true` 缓存展开内容，关闭时不销毁只隐藏，适合展开内容有复杂组件或表单的场景。

```vue
<script setup lang="ts">
const expandable = {
  keepExpanded: true, // 开启缓存
  expandedRowRender: (row) => <DetailForm data={row} />,
};
</script>
```

### 固定表头

通过 `scroll.y` 设置表格高度，表头固定，内容滚动。

```vue
<script setup lang="ts">
const scroll = { y: 300 }; // 表格高度 300px，表头固定
</script>

<template>
  <SDataTable :data="data" :columns="columns" :scroll="scroll" />
</template>
```

## API

### SDataTable Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| data | `T[]` | `[]` | 数据源 |
| columns | `ColumnConfig[]` | `[]` | 列配置，见下方 ColumnConfig |
| loading | `boolean` | `false` | 加载状态，显示加载遮罩 |
| rowKey | `string \| ((row: T) => string \| number)` | `'id'` | 行的唯一标识，用于行选择和排序 |
| emptyText | `string` | `'暂无数据'` | 空数据时显示的文本 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 表格大小 |
| showHeader | `boolean` | `true` | 是否显示表头 |
| bordered | `boolean` | `false` | 是否显示列边框 |
| rowSelection | `RowSelection<T>` | - | 行选择配置，见下方 RowSelection |
| customRow | `RowEvents<T> \| ((row: T, index: number) => RowEvents<T>)` | - | 行事件配置 |
| pagination | `boolean \| PaginationConfig` | `false` | 分页配置，`true` 启用前端分页 |
| sort | `SortConfig` | - | 排序配置，见下方 SortConfig |
| remote | `boolean` | `false` | 远程模式，同时控制分页和排序（true 时不分页、不排序，由外部处理） |
| expandable | `ExpandableConfig<T>` | - | 行展开配置，见下方 ExpandableConfig |
| scroll | `ScrollConfig` | - | 滚动配置，设置 y 固定表头，设置 x 支持横向滚动 |

### ColumnConfig

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| key | `string` | - | 数据字段名，必填 |
| title | `string` | - | 列标题，必填 |
| width | `number \| string` | - | 列宽，数字为像素值 |
| align | `'left' \| 'center' \| 'right'` | `'left'` | 内容对齐方式 |
| sortable | `boolean` | `false` | 是否可排序 |
| sortFn | `(a: T, b: T, order: SortOrder) => number` | - | 自定义排序函数 |
| sortDirections | `SortOrder[]` | `['ascend', 'descend']` | 支持的排序方向 |
| customRender | `(ctx: CellContext) => VNode \| string` | - | 自定义单元格渲染 |
| headerRender | `(ctx: HeaderContext) => VNode \| string` | - | 自定义表头渲染 |

### SortConfig

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| field | `string` | - | 排序字段 |
| order | `'ascend' \| 'descend'` | - | 排序方向 |

> **提示**：远程模式由顶级 `remote` prop 控制，同时影响分页和排序。

### RowSelection

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enabled | `boolean` | `false` | 是否启用行选择 |
| type | `'single' \| 'multiple'` | `'multiple'` | 选择模式 |
| selectedRowKeys | `(string \| number)[]` | - | 受控模式下选中的行 key |
| onChange | `(keys: (string \| number)[], rows: T[]) => void` | - | 选择变化回调 |
| getCheckboxProps | `(row: T) => { disabled?: boolean }` | - | 自定义复选框属性 |

### PaginationConfig

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| page | `number` | `1` | 当前页码 |
| pageSize | `number` | `10` | 每页条数 |
| total | `number` | - | 数据总条数（远程模式必填） |
| pageSizes | `number[]` | `[10, 20, 50, 100]` | 每页条数选项 |
| showTotal | `boolean` | `true` | 是否显示总条数 |
| showSizeChanger | `boolean` | `true` | 是否显示每页条数切换器 |
| position | `'left' \| 'center' \| 'right'` | `'right'` | 分页器位置 |

> **提示**：远程模式由顶级 `remote` prop 控制，不在 pagination 中配置。

### ExpandableConfig

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| enabled | `boolean` | `true` | 是否启用行展开 |
| defaultExpandedRowKeys | `(string \| number)[]` | `[]` | 默认展开的行 key |
| expandedRowKeys | `(string \| number)[]` | - | 受控展开的行 key |
| onExpand | `(expanded: boolean, row: T) => void` | - | 展开变化回调 |
| expandedRowRender | `(row: T, index: number) => VNode \| string` | - | 展开行渲染函数 |
| expandAll | `boolean` | `false` | 默认全部展开 |
| rowExpandable | `(row: T) => boolean` | - | 指定哪些行可展开，返回 false 则不显示展开图标 |
| keepExpanded | `boolean` | `false` | 是否缓存展开内容，关闭时不销毁只隐藏 |

### ScrollConfig

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| y | `number \| string` | - | 纵向滚动高度，设置后表头固定 |

### RowEvents

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| onClick | `(row: T, index: number, event: MouseEvent) => void` | 行点击事件 |
| onDblclick | `(row: T, index: number, event: MouseEvent) => void` | 行双击事件 |
| onMouseenter | `(row: T, index: number, event: MouseEvent) => void` | 鼠标进入行 |
| onMouseleave | `(row: T, index: number, event: MouseEvent) => void` | 鼠标离开行 |

### CellContext

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| value | `any` | 当前单元格的值 |
| row | `T` | 当前行的完整数据 |
| index | `number` | 当前行的索引 |

### HeaderContext

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| column | `ColumnConfig<T>` | 当前列的配置 |
| index | `number` | 当前列的索引 |

### 插槽

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `cell-{key}` | `CellContext<T>` | 自定义单元格，`key` 为列的 key |
| `header-{key}` | `HeaderContext<T>` | 自定义表头，`key` 为列的 key |
| `empty` | - | 自定义空数据状态 |
| `expandedRow` | `{ row: T, index: number }` | 自定义展开行内容 |

### 事件

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:selectedRowKeys` | `(keys: (string \| number)[])` | 行选择变化时触发 |
| `update:page` | `(page: number)` | 页码变化时触发 |
| `update:pageSize` | `(pageSize: number)` | 每页条数变化时触发 |
| `update:sort` | `(sort: SortInfo \| undefined)` | 排序变化时触发 |
| `update:expandedRowKeys` | `(keys: (string \| number)[])` | 展开行变化时触发 |

## 注意事项

1. **远程模式**：设置 `remote: true` 时，组件不执行本地分页和排序，由外部 API 处理数据和状态。

2. **排序与分页顺序**：本地模式下，排序在分页之前执行，确保排序结果正确。

3. **rowKey 重要**：行选择、排序和行展开依赖 `rowKey`，请确保每行有唯一标识。

4. **固定表头实现**：固定表头模式下，表头和表体分离为两个独立的表格，确保列宽一致。

5. **横向滚动固定列**：展开列和选择列在横向滚动时自动固定在左侧，使用 `sticky left-0` 实现。

6. **组件定制**：禁止修改 `src/components/ui/` 目录下的 shadcn-vue 组件，如需定制请在 `src/components/shared/` 中封装。