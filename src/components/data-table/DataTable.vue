<script setup lang="ts" generic="T extends Record<string, any>">
import type {
  ColumnConfig,
  DataTableProps,
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
});

const emit = defineEmits<{
  "update:selectedRowKeys": [keys: (string | number)[]];
}>();

const slots = useSlots();

const internalSelectedRowKeys = ref<(string | number)[]>([]);

const selectedKeys = computed(() => {
  if (props.rowSelection?.selectedRowKeys !== undefined) {
    return props.rowSelection.selectedRowKeys;
  }
  return internalSelectedRowKeys.value;
});

const mergedColumns = computed(() => {
  const cols = props.columns;

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

const SIZE_STYLES = {
  xs: { text: "text-xs", padding: "py-1 px-1.5" },
  sm: { text: "text-sm", padding: "py-2 px-3" },
  md: { text: "", padding: "py-3 px-4" },
  lg: { text: "text-base", padding: "py-4 px-6" },
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
  if (typeof props.customRow === "function") {
    return props.customRow(row, index);
  }
  return props.customRow || {};
}

function handleRowEvent(
  type: keyof RowEvents<T>,
  row: T,
  index: number,
  event: MouseEvent,
) {
  getRowEvents(row, index)[type]?.(row, index, event);
}

function isRowSelected(row: T, index: number): boolean {
  const key = getRowKey(row, index);
  return selectedKeys.value.includes(key);
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

// Combined selection state computation to avoid redundant iterations
const selectionState = computed(() => {
  const selectableRowsData: { row: T; index: number; key: string | number }[] = [];

  for (let i = 0; i < props.data.length; i++) {
    const row = props.data[i];
    if (!isRowDisabled(row)) {
      selectableRowsData.push({
        row,
        index: i,
        key: getRowKey(row, i),
      });
    }
  }

  const selectableCount = selectableRowsData.length;
  if (selectableCount === 0) {
    return { selectableRows: [], selectableKeys: [], isAllSelected: false, isIndeterminate: false };
  }

  const selectedCount = selectableRowsData.filter(
    ({ key }) => selectedKeys.value.includes(key)
  ).length;

  return {
    selectableRows: selectableRowsData,
    selectableKeys: selectableRowsData.map(({ key }) => key),
    isAllSelected: selectedCount === selectableCount,
    isIndeterminate: selectedCount > 0 && selectedCount < selectableCount,
  };
});

function updateSelection(newSelectedKeys: (string | number)[]) {
  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  emit("update:selectedRowKeys", newSelectedKeys);

  const selectedRows = props.data.filter((r, i) =>
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
    const disabledKeys = new Set(
      props.data
        .filter((row) => isRowDisabled(row))
        .map((row, index) => getRowKey(row, index)),
    );
    updateSelection(selectedKeys.value.filter((k) => disabledKeys.has(k)));
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
            v-for="(column, index) in mergedColumns"
            :key="column.key"
            :class="
              cn(
                SIZE_STYLES[props.size].padding,
                column.key === '__selection__'
                  ? 'w-12 text-center'
                  : cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                    ),
                props.bordered &&
                  index < mergedColumns.length - 1 &&
                  'border-r',
              )
            "
            :style="{ width: getWidthStyle(column.width) }"
          >
            <!-- 选择列表头：多选显示全选框，单选留空 -->
            <div
              v-if="column.key === '__selection__'"
              class="flex items-center justify-center"
            >
              <Checkbox
                v-if="!isSingleSelect"
                :model-value="selectionState.isAllSelected"
                :indeterminate="selectionState.isIndeterminate"
                @update:model-value="(v) => handleSelectAll(v === true)"
              />
            </div>
            <!-- 普通列表头 -->
            <component v-else :is="() => renderHeader(column, Number(index))" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <!-- 空状态 -->
        <TableRow v-if="data.length === 0">
          <TableCell :colspan="mergedColumns.length" class="p-6">
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

        <!-- 数据行 -->
        <TableRow
          v-else
          v-for="(row, rowIndex) in data"
          :key="getRowKey(row, rowIndex)"
          :class="
            cn(
              SIZE_STYLES[props.size].padding,
              props.bordered && rowIndex < data.length - 1 && 'border-b',
              isRowSelected(row, rowIndex) && 'bg-muted/50',
              getRowEvents(row, rowIndex).onClick &&
                'cursor-pointer hover:bg-muted/30',
            )
          "
          @click="handleRowEvent('onClick', row, rowIndex, $event)"
          @dblclick="handleRowEvent('onDblclick', row, rowIndex, $event)"
          @mouseenter="handleRowEvent('onMouseenter', row, rowIndex, $event)"
          @mouseleave="handleRowEvent('onMouseleave', row, rowIndex, $event)"
        >
          <TableCell
            v-for="(column, colIndex) in mergedColumns"
            :key="column.key"
            :class="
              cn(
                SIZE_STYLES[props.size].padding,
                column.key === '__selection__'
                  ? 'w-12 text-center'
                  : cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                    ),
                props.bordered &&
                  colIndex < mergedColumns.length - 1 &&
                  'border-r',
              )
            "
          >
            <!-- 选择列：单选用 RadioGroup，多选用 Checkbox -->
            <div
              v-if="column.key === '__selection__'"
              class="flex items-center justify-center"
            >
              <!-- 单选模式：每行一个 RadioGroup -->
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
              <!-- 多选模式 -->
              <Checkbox
                v-else
                :model-value="isRowSelected(row, rowIndex)"
                :disabled="isRowDisabled(row)"
                @update:model-value="(v) => handleRowSelect(row, rowIndex, v === true)"
              />
            </div>
            <!-- 普通列 -->
            <component v-else :is="() => renderCell(column, row, rowIndex)" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
