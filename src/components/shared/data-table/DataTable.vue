<script setup lang="ts" generic="T extends Record<string, any>">
import type {
  ColumnConfig,
  DataTableProps,
  PaginationConfig,
  CellContext,
  HeaderContext,
  RowEvents,
} from "./types";
import { computed, ref, useSlots, watch } from "vue";
import { cn } from "@/lib/utils";
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
});

const emit = defineEmits<{
  "update:selectedRowKeys": [keys: (string | number)[]];
  "update:page": [page: number];
  "update:pageSize": [pageSize: number];
}>();

const slots = useSlots();

const internalPage = ref(1);
const internalPageSize = ref(10);

const paginationConfig = computed<PaginationConfig>(() => {
  if (props.pagination === false) return {};
  if (props.pagination === true) return {};
  return props.pagination;
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
  // 后端分页时使用传入的 total，前端分页时使用 data.length
  return paginationConfig.value.remote
    ? (paginationConfig.value.total ?? 0)
    : props.data.length;
});

const paginatedData = computed(() => {
  if (!hasPagination.value || paginationConfig.value.remote) return props.data;

  const start = (currentPage.value - 1) * currentPageSize.value;
  const end = start + currentPageSize.value;
  return props.data.slice(start, end);
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

const internalSelectedRowKeys = ref<(string | number)[]>([]);

const selectedKeys = computed(() => {
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    return props.rowSelection.selectedRowKeys;
  }
  return internalSelectedRowKeys.value;
});

const selectedKeysSet = computed(() => new Set(selectedKeys.value));

const hasSelection = computed(() => props.rowSelection?.enabled);

const totalColumns = computed(() =>
  hasSelection.value ? props.columns.length + 1 : props.columns.length
);

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
  if (!width) return undefined;
  return typeof width === "number" ? `${width}px` : width;
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

      <Table :class="SIZE_STYLES[props.size].text">
        <TableHeader v-if="props.showHeader">
          <TableRow :class="props.bordered && 'border-b'">
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
            <TableHead
              v-for="(column, index) in props.columns"
              :key="column.key"
              :class="
                cn(
                  SIZE_STYLES[props.size].padding,
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  props.bordered &&
                    index < props.columns.length - 1 &&
                    'border-r',
                )
              "
              :style="{ width: getWidthStyle(column.width) }"
            >
              <component :is="() => renderHeader(column, index)" />
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

          <TableRow
            v-else
            v-for="(row, rowIndex) in paginatedData"
            :key="getRowKey(row, rowIndex)"
            :class="
              cn(
                SIZE_STYLES[props.size].padding,
                props.bordered && rowIndex < paginatedData.length - 1 && 'border-b',
                isRowSelected(row, rowIndex) && ROW_STATE_STYLES.selected,
                isRowClickable(row, rowIndex) && cn('cursor-pointer', ROW_STATE_STYLES.hover),
              )
            "
            @click="handleRowEvent('onClick', row, rowIndex, $event)"
            @dblclick="handleRowEvent('onDblclick', row, rowIndex, $event)"
            @mouseenter="handleRowEvent('onMouseenter', row, rowIndex, $event)"
            @mouseleave="handleRowEvent('onMouseleave', row, rowIndex, $event)"
          >
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