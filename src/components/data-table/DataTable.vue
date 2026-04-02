<script setup lang="ts" generic="T extends Record<string, any>">
import type {
  ColumnConfig,
  DataTableProps,
  CellContext,
  HeaderContext,
  RowEvents,
} from "./types";
import { computed, ref, useSlots } from "vue";
import { Icon } from "@iconify/vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyMedia, EmptyDescription } from "@/components/ui/empty";

// 定义插槽类型
defineSlots<
  {
    // 空数据插槽
    empty: () => any;
    // 默认插槽用于 DataTableColumn 子组件
    default: () => any;
  } & {
    // 动态单元格插槽 cell-{key}
    [K in `cell-${string}`]?: (ctx: CellContext<T>) => any;
  } & {
    // 动态表头插槽 header-{key}
    [K in `header-${string}`]?: (ctx: HeaderContext) => any;
  }
>();

const props = withDefaults(defineProps<DataTableProps<T>>(), {
  columns: () => [],
  loading: false,
  rowKey: "id",
  emptyText: "暂无数据",
  size: "md",
  showHeader: true,
  bordered: false,
});

const emit = defineEmits<{
  "update:selectedRowKeys": [keys: (string | number)[]];
}>();

// 使用 useSlots 获取插槽
const slots = useSlots();

// 内部选中的行
const internalSelectedRowKeys = ref<(string | number)[]>([]);

// 合并受控和非受控的选中状态
const selectedKeys = computed(() => {
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    return props.rowSelection.selectedRowKeys;
  }
  return internalSelectedRowKeys.value;
});

// 收集子组件定义的列
const columnChildren = computed(() => {
  if (!slots.default) return [];
  let children = slots.default();
  if (!children) return [];

  // 处理 Fragment 的情况
  if (!Array.isArray(children)) {
    children = [children];
  }

  // 递归提取所有 VNode（处理嵌套 Fragment）
  function flattenVNodes(vnodes: any[]): any[] {
    const result: any[] = [];
    for (const vnode of vnodes) {
      if (!vnode) continue;
      // 如果是 Fragment，递归处理
      if (
        vnode.type?.toString() === "Symbol(Fragment)" &&
        Array.isArray(vnode.children)
      ) {
        result.push(...flattenVNodes(vnode.children));
      } else {
        result.push(vnode);
      }
    }
    return result;
  }

  const flatChildren = flattenVNodes(children);

  // 过滤并提取 DataTableColumn 子组件
  return flatChildren
    .filter((child: any) => {
      if (!child) return false;
      const childProps = child.props;
      // 检查是否是 DataTableColumn（通过检查必需的 props）
      return (
        childProps &&
        typeof childProps === "object" &&
        "key" in childProps &&
        "title" in childProps
      );
    })
    .map((child: any) => {
      const { key, title, width, align } = child.props || {};
      const columnSlots = child.children || {};
      return {
        key,
        title,
        width,
        align,
        slots: columnSlots,
      } as ColumnConfig & { slots: any };
    });
});

// 合并列配置：优先使用子组件，其次使用 props
const mergedColumns = computed(() => {
  const cols =
    columnChildren.value.length > 0 ? columnChildren.value : props.columns;

  // 如果启用行选择，添加选择列
  if (props.rowSelection?.enabled) {
    return [
      {
        key: "__selection__",
        title: "",
        width: 48,
        align: "center" as const,
      },
      ...cols,
    ];
  }

  return cols;
});

// 表格大小样式
const sizeClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "text-sm";
    case "lg":
      return "text-base";
    default:
      return "text-sm";
  }
});

// 单元格内边距
const cellPaddingClass = computed(() => {
  switch (props.size) {
    case "sm":
      return "py-2 px-3";
    case "lg":
      return "py-4 px-6";
    default:
      return "py-3 px-4";
  }
});

// 边框样式 - 外层容器
const borderClass = computed(() => {
  return "rounded-md border border-border";
});

// 边框样式 - 单元格
const cellBorderClass = computed(() => {
  if (props.bordered) {
    return "border border-border";
  }
  return "";
});

// 获取行 key
function getRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === "function") {
    return props.rowKey(row);
  }
  return (row as any)[props.rowKey] ?? index;
}

// 获取单元格值
function getCellValue(row: T, key: string): any {
  return (row as any)[key];
}

// 获取对齐样式
function getAlignClass(align?: "left" | "center" | "right"): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

// 获取列宽样式
function getWidthStyle(width?: number | string): string | undefined {
  if (!width) return undefined;
  return typeof width === "number" ? `${width}px` : width;
}

// 获取行事件
function getRowEvents(row: T, index: number): RowEvents<T> {
  if (typeof props.customRow === "function") {
    return props.customRow(row, index);
  }
  return props.customRow || {};
}

// 处理行点击
function handleRowClick(row: T, index: number, event: MouseEvent) {
  const events = getRowEvents(row, index);
  events.onClick?.(row, index, event);
}

// 处理行双击
function handleRowDblclick(row: T, index: number, event: MouseEvent) {
  const events = getRowEvents(row, index);
  events.onDblclick?.(row, index, event);
}

// 处理鼠标进入
function handleMouseenter(row: T, index: number, event: MouseEvent) {
  const events = getRowEvents(row, index);
  events.onMouseenter?.(row, index, event);
}

// 处理鼠标离开
function handleMouseleave(row: T, index: number, event: MouseEvent) {
  const events = getRowEvents(row, index);
  events.onMouseleave?.(row, index, event);
}

// 判断行是否选中
function isRowSelected(row: T, index: number): boolean {
  const key = getRowKey(row, index);
  return selectedKeys.value.includes(key);
}

// 判断行是否禁用选择
function isRowDisabled(row: T): boolean {
  return props.rowSelection?.getCheckboxProps?.(row)?.disabled ?? false;
}

// 处理行选择
function handleRowSelect(row: T, index: number, checked: boolean) {
  const key = getRowKey(row, index);
  let newSelectedKeys: (string | number)[];

  if (checked) {
    newSelectedKeys = [...selectedKeys.value, key];
  } else {
    newSelectedKeys = selectedKeys.value.filter((k) => k !== key);
  }

  // 非受控模式更新内部状态
  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  // 触发事件
  emit("update:selectedRowKeys", newSelectedKeys);

  // 获取选中的行数据
  const selectedRows = props.data.filter((r, i) =>
    newSelectedKeys.includes(getRowKey(r, i)),
  );
  props.rowSelection?.onChange?.(newSelectedKeys, selectedRows);
}

// 判断是否全选
function isAllSelected(): boolean {
  const selectableRows = props.data.filter((row) => !isRowDisabled(row));
  if (selectableRows.length === 0) return false;
  return selectableRows.every((row, index) => isRowSelected(row, index));
}

// 判断是否部分选中
function isIndeterminate(): boolean {
  const selectableRows = props.data.filter((row) => !isRowDisabled(row));
  if (selectableRows.length === 0) return false;
  const selectedCount = selectableRows.filter((row, index) =>
    isRowSelected(row, index),
  ).length;
  return selectedCount > 0 && selectedCount < selectableRows.length;
}

// 处理全选
function handleSelectAll(checked: boolean) {
  let newSelectedKeys: (string | number)[];

  if (checked) {
    // 选中所有可选的行
    newSelectedKeys = [
      ...selectedKeys.value,
      ...props.data
        .filter(
          (row, index) => !isRowDisabled(row) && !isRowSelected(row, index),
        )
        .map((row, index) => getRowKey(row, index)),
    ];
  } else {
    // 取消选中所有可选的行
    const disabledKeys = props.data
      .filter((row) => isRowDisabled(row))
      .map((row, index) => getRowKey(row, index));
    newSelectedKeys = selectedKeys.value.filter((k) =>
      disabledKeys.includes(k),
    );
  }

  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  emit("update:selectedRowKeys", newSelectedKeys);

  const selectedRows = props.data.filter((r, i) =>
    newSelectedKeys.includes(getRowKey(r, i)),
  );
  props.rowSelection?.onChange?.(newSelectedKeys, selectedRows);
}

// 渲染表头
function renderHeader(column: ColumnConfig & { slots?: any }, index: number) {
  const ctx: HeaderContext = { column, index };

  // 1. 优先使用子组件的 header slot
  if (column.slots?.header) {
    return column.slots.header(ctx);
  }

  // 2. 其次使用 headerRender
  if (column.headerRender) {
    return column.headerRender(ctx);
  }

  // 3. 再次使用父组件传入的 header-{key} slot
  const slotName = `header-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  // 4. 默认渲染 title
  return column.title;
}

// 渲染单元格内容
function renderCell(
  column: ColumnConfig & { slots?: any },
  row: T,
  index: number,
) {
  const value = getCellValue(row, column.key);
  const ctx: CellContext = { value, row, index };

  // 1. 优先使用子组件的 default slot
  if (column.slots?.default) {
    return column.slots.default(ctx);
  }

  // 2. 其次使用 customRender
  if (column.customRender) {
    return column.customRender(ctx);
  }

  // 3. 再次使用父组件传入的 cell-{key} slot
  const slotName = `cell-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  // 4. 默认渲染值
  return value;
}
</script>

<template>
  <div :class="['relative overflow-x-auto', borderClass, sizeClass]">
    <!-- 加载遮罩 -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-md"
    >
      <div class="flex items-center gap-2 text-muted-foreground">
        <Icon icon="lucide:loader-2" class="size-5 animate-spin" />
        <span>加载中...</span>
      </div>
    </div>

    <Table :class="{ 'border-separate border-spacing-0': bordered }">
      <!-- 表头 -->
      <TableHeader v-if="showHeader">
        <TableRow :class="[cellBorderClass]">
          <TableHead
            v-for="(column, index) in mergedColumns"
            :key="column.key"
            :class="[
              getAlignClass(column.align),
              cellPaddingClass,
              cellBorderClass,
            ]"
            :style="{ width: getWidthStyle(column.width) }"
          >
            <!-- 选择列表头 -->
            <template v-if="column.key === '__selection__'">
              <Checkbox
                :model-value="isAllSelected()"
                :indeterminate="isIndeterminate()"
                @update:model-value="
                  (value: boolean | 'indeterminate') =>
                    handleSelectAll(value === true)
                "
              />
            </template>
            <!-- 普通列表头 -->
            <template v-else>
              <component :is="() => renderHeader(column, Number(index))" />
            </template>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <!-- 空状态 -->
        <TableRow v-if="data.length === 0">
          <TableCell :colspan="mergedColumns.length" class="p-6">
            <Empty class="border-0">
              <!-- 使用自定义插槽或默认内容 -->
              <template v-if="slots.empty">
                <component :is="slots.empty" />
              </template>
              <template v-else>
                <EmptyMedia variant="icon">
                  <Icon icon="lucide:database" class="size-6" />
                </EmptyMedia>
                <EmptyDescription>{{ emptyText }}</EmptyDescription>
              </template>
            </Empty>
          </TableCell>
        </TableRow>

        <!-- 数据行 -->
        <TableRow
          v-else
          v-for="(row, index) in data"
          :key="getRowKey(row, index)"
          :class="[
            cellPaddingClass,
            cellBorderClass,
            {
              'bg-muted/50': isRowSelected(row, index),
              'cursor-pointer': !!getRowEvents(row, index).onClick,
              'hover:bg-muted/30': !!getRowEvents(row, index).onClick,
            },
          ]"
          @click="handleRowClick(row, index, $event)"
          @dblclick="handleRowDblclick(row, index, $event)"
          @mouseenter="handleMouseenter(row, index, $event)"
          @mouseleave="handleMouseleave(row, index, $event)"
        >
          <TableCell
            v-for="column in mergedColumns"
            :key="column.key"
            :class="[getAlignClass(column.align), cellBorderClass]"
          >
            <!-- 选择列 -->
            <template v-if="column.key === '__selection__'">
              <Checkbox
                :model-value="isRowSelected(row, index)"
                :disabled="isRowDisabled(row)"
                @update:model-value="
                  (value: boolean | 'indeterminate') =>
                    handleRowSelect(row, index, value === true)
                "
              />
            </template>
            <!-- 普通列 -->
            <template v-else>
              <component :is="() => renderCell(column, row, index)" />
            </template>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
