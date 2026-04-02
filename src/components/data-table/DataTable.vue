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

// 定义插槽类型
defineSlots<
  {
    // 空数据插槽
    empty: () => any;
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

// 合并列配置
const mergedColumns = computed(() => {
  const cols = props.columns;

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

// 表格大小样式映射
const SIZE_STYLES = {
  xs: { text: "text-xs", padding: "py-1 px-1.5" },
  sm: { text: "text-sm", padding: "py-2 px-3" },
  md: { text: "", padding: "py-3 px-4" },
  lg: { text: "text-base", padding: "py-4 px-6" },
} as const;

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

// 行事件处理器
function handleRowEvent(
  type: keyof RowEvents<T>,
  row: T,
  index: number,
  event: MouseEvent,
) {
  getRowEvents(row, index)[type]?.(row, index, event);
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

// 是否单选模式
const isSingleSelect = computed(() => props.rowSelection?.type === "single");

// 监听模式切换：多选切单选时清空已选择
watch(isSingleSelect, (newVal, oldVal) => {
  if (newVal && !oldVal && selectedKeys.value.length > 1) {
    // 多选切单选，且选中项超过1个，清空选择
    updateSelection([]);
  }
});

// 可选择的行
const selectableRows = computed(() =>
  props.data.filter((row) => !isRowDisabled(row)),
);

// 可选择行的 keys
const selectableKeys = computed(() =>
  selectableRows.value.map((row, index) => getRowKey(row, index)),
);

// 是否全选
const isAllSelected = computed(() => {
  if (selectableRows.value.length === 0) return false;
  return selectableRows.value.every((row, index) => isRowSelected(row, index));
});

// 是否部分选中
const isIndeterminate = computed(() => {
  if (selectableRows.value.length === 0) return false;
  const selectedCount = selectableRows.value.filter((row, index) =>
    isRowSelected(row, index),
  ).length;
  return selectedCount > 0 && selectedCount < selectableRows.value.length;
});

// 更新选择状态（公共逻辑）
function updateSelection(newSelectedKeys: (string | number)[]) {
  // 非受控模式更新内部状态
  if (props.rowSelection?.selectedRowKeys === undefined) {
    internalSelectedRowKeys.value = newSelectedKeys;
  }

  emit("update:selectedRowKeys", newSelectedKeys);

  const selectedRows = props.data.filter((r, i) =>
    newSelectedKeys.includes(getRowKey(r, i)),
  );
  props.rowSelection?.onChange?.(newSelectedKeys, selectedRows);
}

// 处理行选择
function handleRowSelect(row: T, index: number, checked: boolean) {
  const key = getRowKey(row, index);

  if (isSingleSelect.value) {
    // 单选模式：直接替换为当前选中项（互斥逻辑）
    updateSelection(checked ? [key] : []);
  } else {
    // 多选模式：添加或移除
    const newSelectedKeys = checked
      ? [...selectedKeys.value, key]
      : selectedKeys.value.filter((k) => k !== key);
    updateSelection(newSelectedKeys);
  }
}

// 处理全选
function handleSelectAll(checked: boolean) {
  if (checked) {
    // 选中所有可选的行
    const newKeys = new Set(selectedKeys.value);
    selectableKeys.value.forEach((key) => newKeys.add(key));
    updateSelection([...newKeys]);
  } else {
    // 取消选中所有可选的行，保留禁用行的选中状态
    const disabledKeys = new Set(
      props.data
        .filter((row) => isRowDisabled(row))
        .map((row, index) => getRowKey(row, index)),
    );
    updateSelection(selectedKeys.value.filter((k) => disabledKeys.has(k)));
  }
}

// 渲染表头
function renderHeader(column: ColumnConfig, index: number) {
  const ctx: HeaderContext = { column, index };

  // 1. 使用 headerRender
  if (column.headerRender) {
    return column.headerRender(ctx);
  }

  // 2. 使用 header-{key} slot
  const slotName = `header-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  // 3. 默认渲染 title
  return column.title;
}

// 渲染单元格内容
function renderCell(column: ColumnConfig, row: T, index: number) {
  const value = getCellValue(row, column.key);
  const ctx: CellContext = { value, row, index };

  // 1. 使用 customRender
  if (column.customRender) {
    return column.customRender(ctx);
  }

  // 2. 使用 cell-{key} slot
  const slotName = `cell-${column.key}`;
  if (slots[slotName as keyof typeof slots]) {
    return (slots[slotName as keyof typeof slots] as any)(ctx);
  }

  // 3. 默认渲染值
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
                :model-value="isAllSelected"
                :indeterminate="isIndeterminate"
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
