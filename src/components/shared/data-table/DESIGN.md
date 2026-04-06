# DataTable 组件设计文档

## 一、概述

DataTable 是一个功能完整的数据表格组件，支持分页、排序、行选择、行展开、固定表头、固定列等特性。基于 shadcn-vue 的 Table 组件构建，使用 Tailwind CSS 进行样式管理。

## 二、核心功能

| 功能 | 说明 |
|------|------|
| **分页** | 前端分页 / 远程分页，支持位置配置 |
| **排序** | 前端排序 / 远程排序，支持自定义排序函数 |
| **行选择** | 单选 / 多选，支持禁用特定行 |
| **行展开** | 支持展开行渲染，可缓存展开内容 |
| **固定表头** |纵向滚动时表头固定 |
| **固定列** | 左固定 / 右固定列 |
| **尺寸** | xs / sm / md / lg 四种尺寸 |
| **边框模式** | bordered 开启单元格边框 |
| **加载状态** | loading 显示加载遮罩 |

## 三、设计思路

### 3.1 受控与非受控模式

组件采用**混合受控模式**，既支持完全受控，也支持内部状态管理：

```ts
// 受控模式：通过 props 传入
pagination: { page: 1, pageSize: 10, total: 100 }
sort: { field: 'name', order: 'ascend' }
rowSelection: { selectedRowKeys: [1, 2, 3] }

// 非受控模式：组件内部管理
pagination: true // 启用前端分页
sort: undefined // 内部排序状态
rowSelection: { enabled: true } // 内部选择状态
```

实现方式：
- 定义 `internal*` 内部状态（如 `internalPage`、`internalSort`）
- 通过 computed 合成最终状态，优先使用 props

```ts
const currentPage = computed({
  get: () => paginationConfig.value.page ?? internalPage.value,
  set: (val) => {
    internalPage.value = val;
    emit("update:page", val);
  },
});
```

### 3.2 前端与远程模式

`remote` 属性控制数据处理方式：

|模式 | 分页 | 排序 | 适用场景 |
|------|------|------|---------|
| `remote: false` | 前端切片 | 前端排序 | 小数据量 |
| `remote: true` | 不处理 | 不处理 | 大数据量，由后端处理 |

前端排序逻辑：
- 支持 `sortFn` 自定义排序函数
- 默认排序：字符串用 `localeCompare`，数值直接比较
- 处理 null 值：null 值始终排在末尾（升序时在前，降序时在后）

### 3.3 行展开缓存机制

`keepExpanded` 属性控制展开内容的生命周期：

| 值 | 行为 |
|------|------|
| `false`（默认） | 收起时销毁 DOM |
| `true` | 收起时隐藏 DOM，保留状态 |

实现方式：
- `expandedKeysSet`：当前展开的行
- `everExpandedKeysSet`：曾经展开过的行（用于缓存）
- 数据变化时清理不存在的 key，防止内存泄漏

```ts
// 数据变化时清理缓存
watch(() => props.data, () => {
  if (shouldKeepExpanded.value && everExpandedKeys.value.length > 0) {
    const currentKeySet = new Set(props.data.map(...));
    everExpandedKeys.value = everExpandedKeys.value.filter(key => currentKeySet.has(key));
  }
});
```

渲染时使用 `v-if` + `v-show` 组合：
- `v-if`：决定是否渲染（基于缓存）
- `v-show`：决定是否显示（基于当前展开状态）

### 3.4 固定列位置计算

固定列使用 `position: sticky` 实现，需要精确计算每个固定列的偏移量。

**左固定列偏移计算**：
```ts
const leftOffsets = computed(() => {
  let offset = 0;
  // 展开列 + 选择列先占用空间
  if (hasSelection.value) offset += SELECTION_COLUMN_WIDTH;
  if (hasExpandable.value) offset += SELECTION_COLUMN_WIDTH;

  // 依次累加左固定列宽度
  for (const col of props.columns) {
    if (col.fixed === 'left') {
      offsets.set(col.key, offset);
      offset += Number(col.width) || 0;
    }
  }
  return offsets;
});
```

**右固定列偏移计算**：从右往左累加

```ts
const rightOffsets = computed(() => {
  let offset = 0;
  for (let i = props.columns.length - 1; i >= 0; i--) {
    const col = props.columns[i];
    if (col.fixed === 'right') {
      offsets.set(col.key, offset);
      offset += Number(col.width) || 0;
    }
  }
  return offsets;
});
```

## 四、关键技术解决方案

### 4.1 固定元素边框问题

**问题描述**：
当表格使用 `border-collapse: collapse`（边框合并）且单元格使用 `position: sticky` 时，滚动时固定列的边框会消失。这是因为浏览器将共享边框"分配"给了非固定的滚动元素。

**解决方案**：
使用 `box-shadow: inset` 代替 `border` 绘制固定元素的边框。

```ts
function getFixedBorderedClass(column: ColumnConfig, isLast: boolean) {
  if (!props.bordered) return "";

  // 无横向滚动时，使用普通 border
  if (!hasHorizontalScroll.value) {
    return isLast ? "" : "border-r";
  }

  // 左固定列：右边框
  if (column.fixed === 'left') {
    return "shadow-[inset_-1px_0_0_var(--border)]";
  }

  // 右固定列
  if (column.fixed === 'right') {
    // 第一个右固定列：左边框（分割线）
    if (isFirstRightFixed) {
      return isLast
        ? "shadow-[inset_1px_0_0_var(--border)]"
        : "shadow-[inset_1px_0_0_var(--border),inset_-1px_0_0_var(--border)]";
    }
    // 其他右固定列
    return isLast ? "" : "shadow-[inset_-1px_0_0_var(--border)]";
  }

  return "";
}
```

**应用范围**：
- 固定表头行的底部边框
- 展开列/选择列（sticky 时）的右边框
- 固定数据列的边框

### 4.2 表头 hover 高亮问题

**问题描述**：
TableRow 默认有 `hover:bg-muted/50`，导致表头行悬停时高亮。

**解决方案**：
给表头行添加 `hover:!bg-transparent` 强制覆盖。

```vue
<TableRow :class="cn(props.bordered && ..., 'hover:!bg-transparent')">
```

### 4.3 展开行 hover 问题

**问题描述**：
展开行的内容不应有 hover 高亮效果。

**解决方案**：
展开行使用 `hover:!bg-accent/10` 强制保持背景色。

```vue
<TableRow :class="cn('bg-accent/10 hover:!bg-accent/10', ...)">
```

### 4.4 Vue 插槽检测问题

**问题描述**：
Vue 的 `useSlots()` 即使插槽无内容也会返回一个函数，导致无法准确判断插槽是否被使用。

**解决方案**：
调用插槽函数检查实际渲染结果。

```ts
const hasExpandable = computed(() => {
  if (expandableConfig.value.expandedRowRender) return true;
  if (!slots.expandedRow) return false;
  //调用检测实际渲染结果
  const content = slots.expandedRow({ row: {} as T, index: 0 });
  return !!(content && (Array.isArray(content) ? content.length > 0 : true));
});
```

### 4.5 行 Key 缓存优化

**问题描述**：
模板中多次调用 `getRowKey(row, index)` 会导致重复计算。

**解决方案**：
预计算并缓存所有行的 key。

```ts
const rowKeyCache = computed(() =>
  paginatedData.value.map((row, index) => getRowKey(row, index)),
);
```

模板中使用 `rowKeyCache[rowIndex]` 替代 `getRowKey(row, rowIndex)`。

### 4.6 固定列样式预计算

**问题描述**：
模板中为每个单元格计算固定样式会导致重复计算。

**解决方案**：
预计算所有列的固定样式和宽度样式。

```ts
const columnFixedStyles = computed(() => {
  const styles = new Map<string, Record<string, string>>();
  for (const col of props.columns) {
    if (col.fixed === 'left') {
      styles.set(col.key, { left: `${leftOffsets.value.get(col.key)}px` });
    } else if (col.fixed === 'right') {
      styles.set(col.key, { right: `${rightOffsets.value.get(col.key)}px` });
    }
  }
  return styles;
});
```

## 五、插槽设计

组件提供三类插槽：

| 插槽 | 用途 | 参数 |
|------|------|------|
| `empty` | 自定义空状态 | 无 |
| `expandedRow` | 展开行内容 | `{ row, index }` |
| `cell-${key}` | 自定义单元格 | `CellContext` |
| `header-${key}` | 自定义表头 | `HeaderContext` |

插槽定义使用 TypeScript 泛型：

```ts
defineSlots<{
  empty: () => any;
  expandedRow: (ctx: { row: T; index: number }) => any;
} & {
  [K in `cell-${string}`]?: (ctx: CellContext<T>) => any;
} & {
  [K in `header-${string}`]?: (ctx: HeaderContext) => any;
}>();
```

## 六、性能优化

|优化点 | 方法 |
|------|------|
| 减少 DOM 操作 | `keepExpanded` 缓存展开内容 |
| 减少计算 | 预计算 rowKeyCache、columnFixedStyles |
| 减少 Watch | 合理使用 computed 替代 watch |
| 内存管理 | 数据变化时清理缓存 key |

## 七、使用示例

### 基础用法

```vue
<DataTable:data="users" :columns="columns" />
```

### 固定表头 + 固定列

```vue
<DataTable
  :data="data"
  :columns="columns"
  :scroll="{ y: 400, x: true }"
  bordered
/>
```

### 远程模式

```vue
<DataTable
  :data="data"
  :columns="columns"
  :pagination="{ page, pageSize, total }"
  :sort="{ field, order }"
  remote
  @update:page="handlePageChange"
  @update:sort="handleSortChange"
/>
```

### 行展开缓存

```vue
<DataTable
  :data="data"
  :columns="columns"
  :expandable="{ keepExpanded: true }"
>
  <template #expandedRow="{ row }">
    <div>{{ row.details }}</div>
  </template>
</DataTable>
```