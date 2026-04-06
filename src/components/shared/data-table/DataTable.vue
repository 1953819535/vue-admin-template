<script setup lang="ts" generic="T extends Record<string, any>">
import type {
  ColumnConfig,
  DataTableProps,
  PaginationConfig,
  CellContext,
  HeaderContext,
  RowEvents,
  SortInfo,
} from "./types";
import { computed, ref, useSlots, watch } from "vue";
import { cn, toPx } from "@/lib/utils";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Empty, EmptyMedia, EmptyDescription } from "@/components/ui/empty";
import { PaginationBar } from "@/components/shared/pagination-bar";

defineSlots<
  {
    empty: () => any;
    expandedRow: (ctx: { row: T; index: number }) => any;
  } & {
    [K in `cell-${string}`]?: (ctx: CellContext<T>) => any;
  } & {
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
  pagination: false,
  sort: undefined,
  remote: false,
  expandable: undefined,
  scroll: undefined,
});

const emit = defineEmits<{
  "update:selectedRowKeys": [keys: (string | number)[]];
  "update:page": [page: number];
  "update:pageSize": [pageSize: number];
  "update:sort": [sort: SortInfo | undefined];
  "update:expandedRowKeys": [keys: (string | number)[]];
}>();

const slots = useSlots();

const internalPage = ref(1);
const internalPageSize = ref(10);
const internalSort = ref<SortInfo | undefined>(undefined);

const paginationConfig = computed<PaginationConfig>(() => {
  if (props.pagination === false) return {};
  if (props.pagination === true) return {};
  return props.pagination;
});

const sortConfig = computed(() => {
  if (props.sort?.field && props.sort?.order) {
    return { field: props.sort.field, order: props.sort.order };
  }
  return internalSort.value;
});

const hasPagination = computed(() => props.pagination !== false);

const currentPage = computed({
  get: () => paginationConfig.value.page ?? internalPage.value,
  set: (val) => {
    internalPage.value = val;
    emit("update:page", val);
  },
});

const currentPageSize = computed({
  get: () => paginationConfig.value.pageSize ?? internalPageSize.value,
  set: (val) => {
    internalPageSize.value = val;
    emit("update:pageSize", val);
  },
});

const paginationTotal = computed(() => {
  if (!hasPagination.value) return 0;
  return props.remote ? (paginationConfig.value.total ?? 0) : props.data.length;
});

const paginatedData = computed(() => {
  let result = props.data;

  if (!props.remote && sortConfig.value) {
    const { field, order } = sortConfig.value;
    const column = props.columns.find((col) => col.key === field);

    result = [...result].sort((a, b) => {
      if (column?.sortFn) {
        return column.sortFn(a, b, order);
      }

      const aValue = (a as any)[field];
      const bValue = (b as any)[field];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return order === "ascend" ? -1 : 1;
      if (bValue == null) return order === "ascend" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return order === "ascend"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const compare = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return order === "ascend" ? compare : -compare;
    });
  }

  if (!hasPagination.value || props.remote) return result;

  const start = (currentPage.value - 1) * currentPageSize.value;
  const end = start + currentPageSize.value;
  return result.slice(start, end);
});

const paginationPositionClass = computed(() => {
  if (!hasPagination.value) return "";
  const position = paginationConfig.value.position ?? "right";
  return {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[position];
});

function handlePageChange(page: number) {
  currentPage.value = page;
}

function handlePageSizeChange(pageSize: number) {
  currentPageSize.value = pageSize;
}

function getColumnSortOrder(
  column: ColumnConfig,
): "ascend" | "descend" | undefined {
  if (!sortConfig.value || sortConfig.value.field !== column.key) {
    return undefined;
  }
  return sortConfig.value.order;
}

function getNextSortOrder(
  column: ColumnConfig,
): "ascend" | "descend" | undefined {
  const directions = column.sortDirections ?? ["ascend", "descend"];
  const currentOrder = getColumnSortOrder(column);

  if (!currentOrder) {
    return directions[0];
  }

  const currentIndex = directions.indexOf(currentOrder);
  if (currentIndex === directions.length - 1) {
    return undefined;
  }
  return directions[currentIndex + 1];
}

function handleSortClick(column: ColumnConfig) {
  if (!column.sortable) return;

  const nextOrder = getNextSortOrder(column);
  const newSort: SortInfo | undefined = nextOrder
    ? { field: column.key, order: nextOrder }
    : undefined;

  internalSort.value = newSort;

  emit("update:sort", newSort);
}

const internalSelectedRowKeys = ref<(string | number)[]>([]);

const expandableConfig = computed(() => props.expandable ?? {});

const hasExpandable = computed(() => {
  if (expandableConfig.value.expandedRowRender) return true;
  if (!slots.expandedRow) return false;
  // Vue 插槽即使无内容也会注册，需调用检测实际渲染结果
  const content = slots.expandedRow({ row: {} as T, index: 0 });
  return !!(content && (Array.isArray(content) ? content.length > 0 : true));
});

const internalExpandedRowKeys = ref<(string | number)[]>([]);

watch(
  () => [props.expandable, props.data],
  () => {
    if (expandableConfig.value.expandAll && props.data.length > 0) {
      internalExpandedRowKeys.value = props.data.map((row, index) =>
        getRowKey(row, index),
      );
    } else if (expandableConfig.value.defaultExpandedRowKeys) {
      internalExpandedRowKeys.value =
        expandableConfig.value.defaultExpandedRowKeys;
    }
  },
  { immediate: true },
);

const expandedKeys = computed(() => {
  if (expandableConfig.value.expandedRowKeys !== undefined) {
    return expandableConfig.value.expandedRowKeys;
  }
  return internalExpandedRowKeys.value;
});

const expandedKeysSet = computed(() => new Set(expandedKeys.value));

const everExpandedKeys = ref<(string | number)[]>([]);

const everExpandedKeysSet = computed(() => new Set(everExpandedKeys.value));

const shouldKeepExpanded = computed(
  () => expandableConfig.value.keepExpanded ?? false,
);

// 开启缓存时同步已展开的行
watch(shouldKeepExpanded, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    everExpandedKeys.value = [...expandedKeys.value];
  }
});

// 数据变化时清理不存在的缓存 key，防止内存无限增长
watch(
  () => props.data,
  () => {
    if (shouldKeepExpanded.value && everExpandedKeys.value.length > 0) {
      const currentKeySet = new Set(
        props.data.map((row, index) => getRowKey(row, index)),
      );
      everExpandedKeys.value = everExpandedKeys.value.filter((key) =>
        currentKeySet.has(key),
      );
    }
  },
);

function isRowExpandable(row: T): boolean {
  if (!hasExpandable.value) return false;
  if (expandableConfig.value.rowExpandable) {
    return expandableConfig.value.rowExpandable(row);
  }
  return true;
}

function handleExpandToggle(row: T, index: number) {
  const key = rowKeyCache.value[index];
  const wasExpanded = expandedKeysSet.value.has(key);

  if (
    !wasExpanded &&
    shouldKeepExpanded.value &&
    !everExpandedKeysSet.value.has(key)
  ) {
    everExpandedKeys.value = [...everExpandedKeys.value, key];
  }

  const newExpandedKeys = wasExpanded
    ? expandedKeys.value.filter((k) => k !== key)
    : [...expandedKeys.value, key];

  if (expandableConfig.value.expandedRowKeys === undefined) {
    internalExpandedRowKeys.value = newExpandedKeys;
  }

  emit("update:expandedRowKeys", newExpandedKeys);
  expandableConfig.value.onExpand?.(!wasExpanded, row);
}

const scrollConfig = computed(() => props.scroll ?? {});

const hasStickyHeader = computed(() => !!scrollConfig.value.y);

const scrollYStyle = computed(() => toPx(scrollConfig.value.y));

// 固定列位置常量
const FIXED_POSITION = {
  LEFT: "left",
  RIGHT: "right",
} as const;

// 选择列/展开列宽度 (对应 Tailwind w-12 = 48px)
const SELECTION_COLUMN_WIDTH = 48;

const hasFixedColumns = computed(
  () => props.columns.some((col) => col.fixed === FIXED_POSITION.LEFT || col.fixed === FIXED_POSITION.RIGHT),
);

const hasHorizontalScroll = computed(
  () => scrollConfig.value.x === true || hasFixedColumns.value,
);

const leftOffsets = computed(() => {
  const offsets: Map<string, number> = new Map();
  let offset = 0;

  if (hasSelection.value) {
    offset += SELECTION_COLUMN_WIDTH;
  }
  if (hasExpandable.value) {
    offset += SELECTION_COLUMN_WIDTH;
  }

  for (const col of props.columns) {
    if (col.fixed === FIXED_POSITION.LEFT) {
      offsets.set(col.key, offset);
      offset += Number(col.width) || 0;
    }
  }
  return offsets;
});

const rightOffsets = computed(() => {
  const offsets: Map<string, number> = new Map();
  let offset = 0;

  for (let i = props.columns.length - 1; i >= 0; i--) {
    const col = props.columns[i];
    if (col.fixed === FIXED_POSITION.RIGHT) {
      offsets.set(col.key, offset);
      offset += Number(col.width) || 0;
    }
  }
  return offsets;
});

// 预计算所有列的固定样式，避免模板中重复调用
const columnFixedStyles = computed(() => {
  const styles = new Map<string, Record<string, string>>();
  for (const col of props.columns) {
    if (col.fixed === FIXED_POSITION.LEFT) {
      const offset = leftOffsets.value.get(col.key) ?? 0;
      styles.set(col.key, { left: `${offset}px` });
    } else if (col.fixed === FIXED_POSITION.RIGHT) {
      const offset = rightOffsets.value.get(col.key) ?? 0;
      styles.set(col.key, { right: `${offset}px` });
    }
  }
  return styles;
});

// 预计算所有列的宽度样式
const columnWidthStyles = computed(() => {
  if (!hasHorizontalScroll.value) return new Map<string, { width: string }>();
  const styles = new Map<string, { width: string }>();
  for (const col of props.columns) {
    if (col.width) {
      const widthPx = toPx(col.width);
      if (widthPx) {
        styles.set(col.key, { width: widthPx });
      }
    }
  }
  return styles;
});

// 选择列的左侧偏移类名
const selectionColumnLeftClass = computed(() =>
  hasHorizontalScroll.value
    ? hasExpandable.value ? "left-12" : "left-0"
    : "",
);

const selectedKeys = computed(() => {
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    return props.rowSelection.selectedRowKeys;
  }
  return internalSelectedRowKeys.value;
});

const selectedKeysSet = computed(() => new Set(selectedKeys.value));

const hasSelection = computed(() => props.rowSelection?.enabled);

const totalColumns = computed(() => {
  let count = props.columns.length;
  if (hasSelection.value) count += 1;
  if (hasExpandable.value) count += 1;
  return count;
});

const SIZE_STYLES = {
  xs: { text: "text-xs", cell: "py-1 px-1.5", selection: "py-1" },
  sm: { text: "text-sm", cell: "py-2 px-3", selection: "py-2" },
  md: { text: "", cell: "py-3 px-4", selection: "py-3" },
  lg: { text: "text-base", cell: "py-4 px-6", selection: "py-4" },
} as const;

const sizeStyle = computed(() => SIZE_STYLES[props.size]);

const ALIGN_CLASSES = {
  center: "text-center justify-center",
  right: "text-right justify-end",
} as const;

function getAlignClass(align?: "left" | "center" | "right") {
  return align
    ? (ALIGN_CLASSES[align as keyof typeof ALIGN_CLASSES] ?? "")
    : "";
}

function getBorderedClass(isLast: boolean) {
  return props.bordered && !isLast ? "border-r" : "";
}

// 获取固定列的边框样式（使用 box-shadow 代替 border）
function getFixedBorderedClass(column: ColumnConfig, isLast: boolean) {
  if (!props.bordered) return "";

  // 无横向滚动时，使用普通 border
  if (!hasHorizontalScroll.value) {
    return isLast ? "" : "border-r";
  }

  const rightFixedColumns = props.columns.filter((col) => col.fixed === FIXED_POSITION.RIGHT);

  // 左固定列：右边框
  if (column.fixed === FIXED_POSITION.LEFT) {
    return "shadow-[inset_-1px_0_0_var(--border)]";
  }

  // 右固定列
  if (column.fixed === FIXED_POSITION.RIGHT) {
    const isFirstRightFixed = column.key === rightFixedColumns[0]?.key;

    // 第一个右固定列：左边框（分割线）
    if (isFirstRightFixed) {
      // 如果不是最后一列，还需要右边框
      return isLast
        ? "shadow-[inset_1px_0_0_var(--border)]"
        : "shadow-[inset_1px_0_0_var(--border),inset_-1px_0_0_var(--border)]";
    }

    // 其他右固定列：如果不是最后一列，需要右边框
    return isLast ? "" : "shadow-[inset_-1px_0_0_var(--border)]";
  }

  return "";
}

function getRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === "function") {
    return props.rowKey(row);
  }
  return (row as any)[props.rowKey] ?? index;
}

function getRowEvents(row: T, index: number): RowEvents<T> {
  return typeof props.customRow === "function"
    ? props.customRow(row, index)
    : (props.customRow ?? {});
}

function handleRowEvent(
  type: keyof RowEvents<T>,
  row: T,
  index: number,
  event: MouseEvent,
) {
  getRowEvents(row, index)[type]?.(row, index, event);
}

function isRowClickable(row: T, index: number): boolean {
  return !!getRowEvents(row, index).onClick;
}

function isRowDisabled(row: T): boolean {
  return props.rowSelection?.getCheckboxProps?.(row)?.disabled ?? false;
}

const isSingleSelect = computed(() => props.rowSelection?.type === "single");

watch(isSingleSelect, (newVal, oldVal) => {
  if (newVal && !oldVal && selectedKeys.value.length > 1) {
    updateSelection([]);
  }
});

const selectionState = computed(() => {
  const selectableKeys: (string | number)[] = [];
  const selectableKeySet = new Set<(string | number)>();

  paginatedData.value.forEach((row, i) => {
    if (!isRowDisabled(row)) {
      const key = rowKeyCache.value[i];
      selectableKeys.push(key);
      selectableKeySet.add(key);
    }
  });

  const selectableCount = selectableKeys.length;
  if (selectableCount === 0) {
    return { isAllSelected: false, isIndeterminate: false, selectableKeySet };
  }

  const selectedCount = selectableKeys.filter((key) =>
    selectedKeysSet.value.has(key),
  ).length;
  return {
    isAllSelected: selectedCount === selectableCount,
    isIndeterminate: selectedCount > 0 && selectedCount < selectableCount,
    selectableKeySet,
  };
});

// 全选复选框变化处理
// reka-ui 传入的值：indeterminate→true, checked→false, unchecked→true
function handleSelectAllChange(value: boolean | "indeterminate") {
  handleSelectAll(value === true);
}

function updateSelection(newSelectedKeys: (string | number)[]) {
  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  emit("update:selectedRowKeys", newSelectedKeys);

  const selectedRows = paginatedData.value.filter((_, i) =>
    newSelectedKeys.includes(rowKeyCache.value[i]),
  );
  props.rowSelection?.onChange?.(newSelectedKeys, selectedRows);
}

function handleRowSelect(_row: T, index: number, checked: boolean) {
  const key = rowKeyCache.value[index];

  if (isSingleSelect.value) {
    updateSelection(checked ? [key] : []);
  } else {
    const newSelectedKeys = checked
      ? [...selectedKeys.value, key]
      : selectedKeys.value.filter((k) => k !== key);
    updateSelection(newSelectedKeys);
  }
}

function handleSelectAll(checked: boolean) {
  const { selectableKeySet } = selectionState.value;
  if (checked) {
    const newKeys = new Set(selectedKeys.value);
    selectableKeySet.forEach((key) => newKeys.add(key));
    updateSelection([...newKeys]);
  } else {
    const newKeys = selectedKeys.value.filter((k) => !selectableKeySet.has(k));
    updateSelection(newKeys);
  }
}

function renderHeader(column: ColumnConfig, index: number) {
  const ctx: HeaderContext = { column, index };

  if (column.headerRender) {
    return column.headerRender(ctx);
  }

  const slotName = `header-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  return column.title;
}

function renderCell(column: ColumnConfig, row: T, index: number) {
  const value = (row as any)[column.key];
  const ctx: CellContext = { value, row, index };

  if (column.customRender) {
    return column.customRender(ctx);
  }

  const slotName = `cell-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  return value;
}

function getSortIcon(order: "ascend" | "descend" | undefined) {
  if (order === "ascend") return "lucide:arrow-up";
  if (order === "descend") return "lucide:arrow-down";
  return "lucide:arrow-up-down";
}

// 缓存每行的 key，避免模板中重复计算
const rowKeyCache = computed(() =>
  paginatedData.value.map((row, index) => getRowKey(row, index)),
);
</script>

<template>
  <div class="space-y-4">
    <div
      class="relative rounded-md border flex flex-col overflow-hidden data-table-scroll"
      :class="[hasStickyHeader && 'overflow-y-auto', hasHorizontalScroll && 'overflow-x-auto']"
      :style="hasStickyHeader ? { maxHeight: scrollYStyle } : undefined"
    >
      <div
        v-if="props.loading"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-30"
      >
        <Icon
          icon="lucide:loader-2"
          class="size-5 animate-spin text-muted-foreground"
        />
      </div>

      <Table
        :class="
          cn(
            sizeStyle.text,
            hasStickyHeader &&
              'min-h-0 flex-1 [&_[data-slot=table-container]]:min-h-full',
          )
        "
      >
        <TableHeader
          v-if="props.showHeader"
          :class="hasStickyHeader && 'sticky top-0 bg-background z-20'"
        >
          <TableRow :class="cn(props.bordered && (hasStickyHeader ? 'shadow-[inset_0_-1px_0_var(--border)]' : 'border-b'), 'hover:!bg-transparent')">
            <!-- 展开列 -->
            <TableHead
              v-if="hasExpandable"
              :class="
                cn(
                  sizeStyle.selection,
                  'w-12 text-center',
                  hasHorizontalScroll && 'min-w-12 max-w-12 sticky left-0 bg-background',
                  props.bordered && (hasHorizontalScroll ? 'shadow-[inset_-1px_0_0_var(--border)]' : 'border-r'),
                )
              "
            />
            <!-- 选择列 -->
            <TableHead
              v-if="hasSelection"
              :class="
                cn(
                  sizeStyle.selection,
                  'w-12 text-center',
                  hasHorizontalScroll && 'min-w-12 max-w-12 sticky bg-background',
                  selectionColumnLeftClass,
                  props.bordered && (hasHorizontalScroll ? 'shadow-[inset_-1px_0_0_var(--border)]' : 'border-r'),
                  '[&:has([role=checkbox])]:pr-2',
                )
              "
            >
              <div class="flex items-center justify-center" @click.stop>
                <Checkbox
                  v-if="!isSingleSelect"
                  :model-value="
                    selectionState.isIndeterminate
                      ? 'indeterminate'
                      : selectionState.isAllSelected
                  "
                  class="data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground data-[state=indeterminate]:border-primary"
                  @update:model-value="handleSelectAllChange"
                >
                  <template #default="{ state }">
                    <Icon
                      :icon="
                        state === 'indeterminate'
                          ? 'lucide:minus'
                          : 'lucide:check'
                      "
                      class="size-3.5"
                    />
                  </template>
                </Checkbox>
              </div>
            </TableHead>
            <!-- 数据列 -->
            <TableHead
              v-for="(column, index) in props.columns"
              :key="column.key"
              :class="
                cn(
                  sizeStyle.cell,
                  getAlignClass(column.align),
                  column.sortable &&
                    'cursor-pointer select-none hover:bg-accent/50',
                  column.fixed ? getFixedBorderedClass(column, index === props.columns.length - 1) : getBorderedClass(index === props.columns.length - 1),
                  column.fixed === 'left' && 'sticky left-0 bg-background',
                  column.fixed === 'right' && 'sticky right-0 bg-background',
                )
              "
              :style="{ ...columnWidthStyles.get(column.key), ...columnFixedStyles.get(column.key) }"
              @click="column.sortable && handleSortClick(column)"
            >
              <div
                class="flex items-center gap-2"
                :class="getAlignClass(column.align)"
              >
                <component :is="() => renderHeader(column, index)" />
                <span v-if="column.sortable" class="flex items-center">
                  <Icon
                    :icon="getSortIcon(getColumnSortOrder(column))"
                    :class="
                      getColumnSortOrder(column)
                        ? 'size-4 text-primary'
                        : 'size-4 text-muted-foreground/50'
                    "
                  />
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-if="paginatedData.length === 0">
            <TableCell :colspan="totalColumns" class="p-6">
              <Empty class="border-0">
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

          <template v-else>
            <template
              v-for="(row, rowIndex) in paginatedData"
              :key="rowKeyCache[rowIndex]"
            >
              <!-- 数据行 -->
              <TableRow
                :class="
                  cn(
                    sizeStyle.cell,
                    props.bordered &&
                      rowIndex < paginatedData.length - 1 &&
                      'border-b',
                    selectedKeysSet.has(rowKeyCache[rowIndex]) &&
                      'bg-accent/50',
                    isRowClickable(row, rowIndex) &&
                      'cursor-pointer hover:bg-accent/30',
                    expandedKeysSet.has(rowKeyCache[rowIndex]) &&
                      'bg-accent/20',
                  )
                "
                @click="handleRowEvent('onClick', row, rowIndex, $event)"
                @dblclick="handleRowEvent('onDblclick', row, rowIndex, $event)"
                @mouseenter="
                  handleRowEvent('onMouseenter', row, rowIndex, $event)
                "
                @mouseleave="
                  handleRowEvent('onMouseleave', row, rowIndex, $event)
                "
              >
                <!-- 展开列 -->
                <TableCell
                  v-if="hasExpandable"
                  :class="
                    cn(
                      sizeStyle.selection,
                      'w-12 text-center',
                      hasHorizontalScroll && 'min-w-12 max-w-12 sticky left-0 bg-background',
                      props.bordered && (hasHorizontalScroll ? 'shadow-[inset_-1px_0_0_var(--border)]' : 'border-r'),
                    )
                  "
                >
                  <div class="flex items-center justify-center">
                    <button
                      v-if="isRowExpandable(row)"
                      type="button"
                      class="p-1 rounded hover:bg-accent/50 transition-colors"
                      @click.stop="handleExpandToggle(row, rowIndex)"
                    >
                      <Icon
                        :icon="
                          expandedKeysSet.has(rowKeyCache[rowIndex])
                            ? 'lucide:chevron-down'
                            : 'lucide:chevron-right'
                        "
                        class="size-4 text-muted-foreground"
                      />
                    </button>
                  </div>
                </TableCell>
                <!-- 选择列 -->
                <TableCell
                  v-if="hasSelection"
                  :class="
                    cn(
                      sizeStyle.selection,
                      'w-12 text-center',
                      hasHorizontalScroll && 'min-w-12 max-w-12 sticky bg-background',
                      selectionColumnLeftClass,
                      props.bordered && (hasHorizontalScroll ? 'shadow-[inset_-1px_0_0_var(--border)]' : 'border-r'),
                      '[&:has([role=checkbox])]:pr-2',
                    )
                  "
                >
                  <div class="flex items-center justify-center" @click.stop>
                    <RadioGroup
                      v-if="isSingleSelect"
                      :model-value="
                        selectedKeysSet.has(rowKeyCache[rowIndex])
                          ? rowKeyCache[rowIndex].toString()
                          : undefined
                      "
                      @update:model-value="
                        (val) => val && handleRowSelect(row, rowIndex, true)
                      "
                    >
                      <RadioGroupItem
                        :value="rowKeyCache[rowIndex].toString()"
                        :disabled="isRowDisabled(row)"
                      />
                    </RadioGroup>
                    <Checkbox
                      v-else
                      :model-value="selectedKeysSet.has(rowKeyCache[rowIndex])"
                      :disabled="isRowDisabled(row)"
                      @update:model-value="
                        (v) => handleRowSelect(row, rowIndex, v === true)
                      "
                    />
                  </div>
                </TableCell>
                <!-- 数据列 -->
                <TableCell
                  v-for="(column, colIndex) in props.columns"
                  :key="column.key"
                  :class="
                    cn(
                      sizeStyle.cell,
                      getAlignClass(column.align),
                      column.fixed ? getFixedBorderedClass(column, colIndex === props.columns.length - 1) : getBorderedClass(colIndex === props.columns.length - 1),
                      column.fixed === FIXED_POSITION.LEFT && 'sticky left-0 bg-background',
                      column.fixed === FIXED_POSITION.RIGHT && 'sticky right-0 bg-background',
                    )
                  "
                  :style="{ ...columnWidthStyles.get(column.key), ...columnFixedStyles.get(column.key) }"
                >
                  <component :is="() => renderCell(column, row, rowIndex)" />
                </TableCell>
              </TableRow>

              <!-- 展开行 -->
              <TableRow
                v-if="
                  hasExpandable &&
                  isRowExpandable(row) &&
                  (shouldKeepExpanded
                    ? everExpandedKeysSet.has(rowKeyCache[rowIndex])
                    : expandedKeysSet.has(rowKeyCache[rowIndex]))
                "
                v-show="
                  !shouldKeepExpanded ||
                  expandedKeysSet.has(rowKeyCache[rowIndex])
                "
                :key="'expanded-' + rowKeyCache[rowIndex]"
                :class="cn('bg-accent/10 hover:!bg-accent/10', props.bordered && 'border-b')"
              >
                <TableCell :colspan="totalColumns" class="p-4">
                  <component
                    v-if="expandableConfig.expandedRowRender"
                    :is="
                      () => expandableConfig.expandedRowRender!(row, rowIndex)
                    "
                  />
                  <slot
                    v-else-if="slots.expandedRow"
                    name="expandedRow"
                    :row="row"
                    :index="rowIndex"
                  />
                </TableCell>
              </TableRow>
            </template>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="hasPagination" :class="cn('flex', paginationPositionClass)">
      <PaginationBar
        :page="currentPage"
        :page-size="currentPageSize"
        :total="paginationTotal"
        :page-sizes="paginationConfig.pageSizes"
        :show-total="paginationConfig.showTotal ?? true"
        :show-size-changer="paginationConfig.showSizeChanger ?? true"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<style scoped>
.data-table-scroll:deep([data-slot="table-container"]) {
  scrollbar-width: thin;
  scrollbar-color: var(--muted-foreground) var(--border);
}
.data-table-scroll:deep([data-slot="table-container"]::-webkit-scrollbar) {
  display: block;
  width: 8px;
  height: 8px;
}
.data-table-scroll:deep(
  [data-slot="table-container"]::-webkit-scrollbar-thumb
) {
  background: var(--muted-foreground);
  border-radius: 4px;
}
.data-table-scroll:deep(
  [data-slot="table-container"]::-webkit-scrollbar-track
) {
  background: var(--border);
}
</style>
