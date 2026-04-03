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
  return props.remote
    ? (paginationConfig.value.total ?? 0)
    : props.data.length;
});

const paginatedData = computed(() => {
  let result = props.data;

  // 本地排序（非远程模式时）
  if (!props.remote && sortConfig.value) {
    const { field, order } = sortConfig.value;
    const column = props.columns.find(col => col.key === field);

    result = [...result].sort((a, b) => {
      if (column?.sortFn) {
        return column.sortFn(a, b, order);
      }

      const aValue = (a as any)[field];
      const bValue = (b as any)[field];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return order === 'ascend' ? -1 : 1;
      if (bValue == null) return order === 'ascend' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'ascend'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const compare = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return order === 'ascend' ? compare : -compare;
    });
  }

  // 本地分页
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

function getSortDirections(column: ColumnConfig): ('ascend' | 'descend')[] {
  return column.sortDirections ?? ['ascend', 'descend'];
}

function getColumnSortOrder(column: ColumnConfig): 'ascend' | 'descend' | undefined {
  if (!sortConfig.value || sortConfig.value.field !== column.key) {
    return undefined;
  }
  return sortConfig.value.order;
}

function getNextSortOrder(column: ColumnConfig): 'ascend' | 'descend' | undefined {
  const directions = getSortDirections(column);
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

  emit('update:sort', newSort);
}

const internalSelectedRowKeys = ref<(string | number)[]>([]);

const expandableConfig = computed(() => props.expandable ?? {});

const hasExpandable = computed(() => {
  if (!props.expandable) return false;
  return props.expandable.enabled ?? true;
});

const internalExpandedRowKeys = ref<(string | number)[]>([]);

watch(
  () => [props.expandable, props.data],
  () => {
    if (expandableConfig.value.expandAll && props.data.length > 0) {
      internalExpandedRowKeys.value = props.data.map((row, index) => getRowKey(row, index));
    } else if (expandableConfig.value.defaultExpandedRowKeys) {
      internalExpandedRowKeys.value = expandableConfig.value.defaultExpandedRowKeys;
    }
  },
  { immediate: true }
);

const expandedKeys = computed(() => {
  if (expandableConfig.value.expandedRowKeys !== undefined) {
    return expandableConfig.value.expandedRowKeys;
  }
  return internalExpandedRowKeys.value;
});

const expandedKeysSet = computed(() => new Set(expandedKeys.value));

const everExpandedKeys = ref<Set<string | number>>(new Set());

const shouldKeepExpanded = computed(() => expandableConfig.value.keepExpanded ?? false);

function isRowExpanded(row: T, index: number): boolean {
  const key = getRowKey(row, index);
  return expandedKeysSet.value.has(key);
}

function wasRowEverExpanded(row: T, index: number): boolean {
  const key = getRowKey(row, index);
  return everExpandedKeys.value.has(key);
}

function isRowExpandable(row: T): boolean {
  if (!hasExpandable.value) return false;
  if (expandableConfig.value.rowExpandable) {
    return expandableConfig.value.rowExpandable(row);
  }
  return true;
}

function handleExpandToggle(row: T, index: number) {
  const key = getRowKey(row, index);
  const wasExpanded = isRowExpanded(row, index);

  if (!wasExpanded && shouldKeepExpanded.value) {
    everExpandedKeys.value.add(key);
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
  xs: { text: "text-xs", padding: "py-1 px-1.5" },
  sm: { text: "text-sm", padding: "py-2 px-3" },
  md: { text: "", padding: "py-3 px-4" },
  lg: { text: "text-base", padding: "py-4 px-6" },
} as const;

const SELECTION_PADDING = {
  xs: "py-1",
  sm: "py-2",
  md: "py-3",
  lg: "py-4",
} as const;

const ROW_STATE_STYLES = {
  selected: "bg-accent/50",
  hover: "hover:bg-accent/30",
} as const;

function getRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === "function") {
    return props.rowKey(row);
  }
  return (row as any)[props.rowKey] ?? index;
}

function getCellValue(row: T, key: string): any {
  return (row as any)[key];
}

function getWidthStyle(width?: number | string): string | undefined {
  return toPx(width);
}

function getRowEvents(row: T, index: number): RowEvents<T> {
  return typeof props.customRow === "function"
    ? props.customRow(row, index)
    : props.customRow ?? {};
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

function isRowSelected(row: T, index: number): boolean {
  const key = getRowKey(row, index);
  return selectedKeysSet.value.has(key);
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
  const disabledKeys: (string | number)[] = [];

  for (let i = 0; i < paginatedData.value.length; i++) {
    const key = getRowKey(paginatedData.value[i], i);
    if (!isRowDisabled(paginatedData.value[i])) {
      selectableKeys.push(key);
    } else {
      disabledKeys.push(key);
    }
  }

  const selectableCount = selectableKeys.length;
  if (selectableCount === 0) {
    return { selectableKeys: [], disabledKeys, isAllSelected: false, isIndeterminate: false };
  }

  const selectedCount = selectableKeys.filter(
    (key) => selectedKeysSet.value.has(key)
  ).length;

  return {
    selectableKeys,
    disabledKeys,
    isAllSelected: selectedCount === selectableCount,
    isIndeterminate: selectedCount > 0 && selectedCount < selectableCount,
  };
});

function updateSelection(newSelectedKeys: (string | number)[]) {
  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  emit("update:selectedRowKeys", newSelectedKeys);

  const selectedRows = paginatedData.value.filter((r, i) =>
    newSelectedKeys.includes(getRowKey(r, i)),
  );
  props.rowSelection?.onChange?.(newSelectedKeys, selectedRows);
}

function handleRowSelect(row: T, index: number, checked: boolean) {
  const key = getRowKey(row, index);

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
  if (checked) {
    const newKeys = new Set(selectedKeys.value);
    selectionState.value.selectableKeys.forEach((key) => newKeys.add(key));
    updateSelection([...newKeys]);
  } else {
    // 保留禁用行的选中状态
    const disabledKeySet = new Set(selectionState.value.disabledKeys);
    updateSelection(selectedKeys.value.filter((k) => disabledKeySet.has(k)));
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
  const value = getCellValue(row, column.key);
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
</script>

<template>
  <div class="space-y-4">
    <div class="relative rounded-md border overflow-hidden">
      <!-- 加载遮罩 -->
      <div
        v-if="props.loading"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <Icon
          icon="lucide:loader-2"
          class="size-5 animate-spin text-muted-foreground"
        />
      </div>

      <!-- 固定表头模式：使用原生 table 绕过 Table 组件的 overflow-auto 包裹层 -->
      <template v-if="hasStickyHeader">
        <div class="overflow-auto" :style="{ maxHeight: scrollYStyle }">
          <table :class="cn('w-full caption-bottom text-sm', SIZE_STYLES[props.size].text)">
            <thead
              v-if="props.showHeader"
              class="sticky top-0 z-10 bg-background [&_tr]:border-b"
            >
              <tr :class="props.bordered && 'border-b'">
                <!-- 展开列 -->
                <th
                  v-if="hasExpandable"
                  :class="cn(
                    SELECTION_PADDING[props.size],
                    'w-12 text-center px-0 font-medium',
                    hasSelection && 'border-r'
                  )"
                >
                  <div class="flex items-center justify-center"></div>
                </th>
                <!-- 选择列 -->
                <th
                  v-if="hasSelection"
                  :class="cn(
                    SELECTION_PADDING[props.size],
                    'w-12 text-center px-0 font-medium',
                    props.bordered && 'border-r'
                  )"
                >
                  <div class="flex items-center justify-center">
                    <Checkbox
                      v-if="!isSingleSelect"
                      :model-value="selectionState.isAllSelected"
                      :indeterminate="selectionState.isIndeterminate"
                      @update:model-value="(v) => handleSelectAll(v === true)"
                    />
                  </div>
                </th>
                <!-- 数据列 -->
                <th
                  v-for="(column, index) in props.columns"
                  :key="column.key"
                  :class="
                    cn(
                      SIZE_STYLES[props.size].padding,
                      'font-medium text-left',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer select-none hover:bg-accent/50',
                      props.bordered &&
                        index < props.columns.length - 1 &&
                        'border-r',
                    )
                  "
                  :style="{ width: getWidthStyle(column.width) }"
                  @click="column.sortable && handleSortClick(column)"
                >
                  <div class="flex items-center gap-2" :class="cn(column.align === 'center' && 'justify-center', column.align === 'right' && 'justify-end')">
                    <component :is="() => renderHeader(column, index)" />
                    <span v-if="column.sortable" class="flex items-center">
                      <Icon
                        v-if="getColumnSortOrder(column) === 'ascend'"
                        icon="lucide:arrow-up"
                        class="size-4 text-primary"
                      />
                      <Icon
                        v-else-if="getColumnSortOrder(column) === 'descend'"
                        icon="lucide:arrow-down"
                        class="size-4 text-primary"
                      />
                      <Icon
                        v-else
                        icon="lucide:arrow-up-down"
                        class="size-4 text-muted-foreground/50"
                      />
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="[&_tr:last-child]:border-0">
              <tr v-if="paginatedData.length === 0">
                <td :colspan="totalColumns" class="p-6">
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
                </td>
              </tr>

              <template v-else>
                <template v-for="(row, rowIndex) in paginatedData" :key="getRowKey(row, rowIndex)">
                  <!-- 数据行 -->
                  <tr
                    :class="
                      cn(
                        SIZE_STYLES[props.size].padding,
                        props.bordered && rowIndex < paginatedData.length - 1 && 'border-b',
                        isRowSelected(row, rowIndex) && ROW_STATE_STYLES.selected,
                        isRowClickable(row, rowIndex) && cn('cursor-pointer', ROW_STATE_STYLES.hover),
                        isRowExpanded(row, rowIndex) && 'bg-accent/20',
                      )
                    "
                    @click="handleRowEvent('onClick', row, rowIndex, $event)"
                    @dblclick="handleRowEvent('onDblclick', row, rowIndex, $event)"
                    @mouseenter="handleRowEvent('onMouseenter', row, rowIndex, $event)"
                    @mouseleave="handleRowEvent('onMouseleave', row, rowIndex, $event)"
                  >
                    <!-- 展开列 -->
                    <td
                      v-if="hasExpandable"
                      :class="cn(
                        SELECTION_PADDING[props.size],
                        'w-12 text-center px-0',
                        hasSelection && 'border-r'
                      )"
                    >
                      <div class="flex items-center justify-center">
                        <button
                          v-if="isRowExpandable(row)"
                          type="button"
                          class="p-1 rounded hover:bg-accent/50 transition-colors"
                          @click.stop="handleExpandToggle(row, rowIndex)"
                        >
                          <Icon
                            :icon="isRowExpanded(row, rowIndex) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                            class="size-4 text-muted-foreground"
                          />
                        </button>
                      </div>
                    </td>
                    <!-- 选择列 -->
                    <td
                      v-if="hasSelection"
                      :class="cn(
                        SELECTION_PADDING[props.size],
                        'w-12 text-center px-0',
                        props.bordered && 'border-r'
                      )"
                    >
                      <div class="flex items-center justify-center">
                        <RadioGroup
                          v-if="isSingleSelect"
                          :model-value="isRowSelected(row, rowIndex) ? getRowKey(row, rowIndex).toString() : undefined"
                          @update:model-value="(val) => val && handleRowSelect(row, rowIndex, true)"
                        >
                          <RadioGroupItem
                            :value="getRowKey(row, rowIndex).toString()"
                            :disabled="isRowDisabled(row)"
                            @click.stop
                          />
                        </RadioGroup>
                        <Checkbox
                          v-else
                          :model-value="isRowSelected(row, rowIndex)"
                          :disabled="isRowDisabled(row)"
                          @update:model-value="(v) => handleRowSelect(row, rowIndex, v === true)"
                        />
                      </div>
                    </td>
                    <!-- 数据列 -->
                    <td
                      v-for="(column, colIndex) in props.columns"
                      :key="column.key"
                      :class="
                        cn(
                          SIZE_STYLES[props.size].padding,
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          props.bordered &&
                            colIndex < props.columns.length - 1 &&
                            'border-r',
                        )
                      "
                    >
                      <component :is="() => renderCell(column, row, rowIndex)" />
                    </td>
                  </tr>

                  <!-- 展开行 -->
                  <tr
                    v-if="hasExpandable && isRowExpandable(row) && (shouldKeepExpanded ? wasRowEverExpanded(row, rowIndex) : isRowExpanded(row, rowIndex))"
                    v-show="!shouldKeepExpanded || isRowExpanded(row, rowIndex)"
                    :class="cn('bg-accent/10', props.bordered && 'border-b')"
                  >
                    <td :colspan="totalColumns" class="p-4">
                      <component
                        v-if="expandableConfig.expandedRowRender"
                        :is="() => expandableConfig.expandedRowRender!(row, rowIndex)"
                      />
                      <component
                        v-else-if="slots.expandedRow"
                        :is="() => slots.expandedRow!({ row, index: rowIndex })"
                      />
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
      </template>

      <!-- 非固定表头模式：使用 Table 组件 -->
      <template v-else>
        <Table :class="SIZE_STYLES[props.size].text">
          <TableHeader v-if="props.showHeader">
            <TableRow :class="props.bordered && 'border-b'">
              <!-- 展开列 -->
              <TableHead
                v-if="hasExpandable"
                :class="cn(
                  SELECTION_PADDING[props.size],
                  'w-12 text-center px-0',
                  hasSelection && 'border-r'
                )"
              >
                <div class="flex items-center justify-center"></div>
              </TableHead>
              <!-- 选择列 -->
              <TableHead
                v-if="hasSelection"
                :class="cn(
                  SELECTION_PADDING[props.size],
                  'w-12 text-center px-0',
                  props.bordered && 'border-r'
                )"
              >
                <div class="flex items-center justify-center">
                  <Checkbox
                    v-if="!isSingleSelect"
                    :model-value="selectionState.isAllSelected"
                    :indeterminate="selectionState.isIndeterminate"
                    @update:model-value="(v) => handleSelectAll(v === true)"
                  />
                </div>
              </TableHead>
              <!-- 数据列 -->
              <TableHead
                v-for="(column, index) in props.columns"
                :key="column.key"
                :class="
                  cn(
                    SIZE_STYLES[props.size].padding,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.sortable && 'cursor-pointer select-none hover:bg-accent/50',
                    props.bordered &&
                      index < props.columns.length - 1 &&
                      'border-r',
                  )
                "
                :style="{ width: getWidthStyle(column.width) }"
                @click="column.sortable && handleSortClick(column)"
              >
                <div class="flex items-center gap-2" :class="cn(column.align === 'center' && 'justify-center', column.align === 'right' && 'justify-end')">
                  <component :is="() => renderHeader(column, index)" />
                  <span v-if="column.sortable" class="flex items-center">
                    <Icon
                      v-if="getColumnSortOrder(column) === 'ascend'"
                      icon="lucide:arrow-up"
                      class="size-4 text-primary"
                    />
                    <Icon
                      v-else-if="getColumnSortOrder(column) === 'descend'"
                      icon="lucide:arrow-down"
                      class="size-4 text-primary"
                    />
                    <Icon
                      v-else
                      icon="lucide:arrow-up-down"
                      class="size-4 text-muted-foreground/50"
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
              <template v-for="(row, rowIndex) in paginatedData" :key="getRowKey(row, rowIndex)">
                <!-- 数据行 -->
                <TableRow
                  :class="
                    cn(
                      SIZE_STYLES[props.size].padding,
                      props.bordered && rowIndex < paginatedData.length - 1 && 'border-b',
                      isRowSelected(row, rowIndex) && ROW_STATE_STYLES.selected,
                      isRowClickable(row, rowIndex) && cn('cursor-pointer', ROW_STATE_STYLES.hover),
                      isRowExpanded(row, rowIndex) && 'bg-accent/20',
                    )
                  "
                  @click="handleRowEvent('onClick', row, rowIndex, $event)"
                  @dblclick="handleRowEvent('onDblclick', row, rowIndex, $event)"
                  @mouseenter="handleRowEvent('onMouseenter', row, rowIndex, $event)"
                  @mouseleave="handleRowEvent('onMouseleave', row, rowIndex, $event)"
                >
                  <!-- 展开列 -->
                  <TableCell
                    v-if="hasExpandable"
                    :class="cn(
                      SELECTION_PADDING[props.size],
                      'w-12 text-center px-0',
                      hasSelection && 'border-r'
                    )"
                  >
                    <div class="flex items-center justify-center">
                      <button
                        v-if="isRowExpandable(row)"
                        type="button"
                        class="p-1 rounded hover:bg-accent/50 transition-colors"
                        @click.stop="handleExpandToggle(row, rowIndex)"
                      >
                        <Icon
                          :icon="isRowExpanded(row, rowIndex) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                          class="size-4 text-muted-foreground"
                        />
                      </button>
                    </div>
                  </TableCell>
                  <!-- 选择列 -->
                  <TableCell
                    v-if="hasSelection"
                    :class="cn(
                      SELECTION_PADDING[props.size],
                      'w-12 text-center px-0',
                      props.bordered && 'border-r'
                    )"
                  >
                    <div class="flex items-center justify-center">
                      <RadioGroup
                        v-if="isSingleSelect"
                        :model-value="isRowSelected(row, rowIndex) ? getRowKey(row, rowIndex).toString() : undefined"
                        @update:model-value="(val) => val && handleRowSelect(row, rowIndex, true)"
                      >
                        <RadioGroupItem
                          :value="getRowKey(row, rowIndex).toString()"
                          :disabled="isRowDisabled(row)"
                          @click.stop
                        />
                      </RadioGroup>
                      <Checkbox
                        v-else
                        :model-value="isRowSelected(row, rowIndex)"
                        :disabled="isRowDisabled(row)"
                        @update:model-value="(v) => handleRowSelect(row, rowIndex, v === true)"
                      />
                    </div>
                  </TableCell>
                  <!-- 数据列 -->
                  <TableCell
                    v-for="(column, colIndex) in props.columns"
                    :key="column.key"
                    :class="
                      cn(
                        SIZE_STYLES[props.size].padding,
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        props.bordered &&
                          colIndex < props.columns.length - 1 &&
                          'border-r',
                      )
                    "
                  >
                    <component :is="() => renderCell(column, row, rowIndex)" />
                  </TableCell>
                </TableRow>

                <!-- 展开行 -->
                <TableRow
                  v-if="hasExpandable && isRowExpandable(row) && (shouldKeepExpanded ? wasRowEverExpanded(row, rowIndex) : isRowExpanded(row, rowIndex))"
                  v-show="!shouldKeepExpanded || isRowExpanded(row, rowIndex)"
                  :class="cn('bg-accent/10', props.bordered && 'border-b')"
                >
                  <TableCell :colspan="totalColumns" class="p-4">
                    <component
                      v-if="expandableConfig.expandedRowRender"
                      :is="() => expandableConfig.expandedRowRender!(row, rowIndex)"
                    />
                    <component
                      v-else-if="slots.expandedRow"
                      :is="() => slots.expandedRow!({ row, index: rowIndex })"
                    />
                  </TableCell>
                </TableRow>
              </template>
            </template>
          </TableBody>
        </Table>
      </template>
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