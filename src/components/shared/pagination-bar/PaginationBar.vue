<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-vue-next";
import type { AcceptableValue } from "reka-ui";
import { computed } from "vue";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** PaginationBar 组件 Props，与 DataTable PaginationConfig 保持一致 */
interface PaginationBarProps {
  /** 当前页码 */
  page?: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
  /** 每页条数选项 */
  pageSizes?: number[];
  /** 是否显示总条数 */
  showTotal?: boolean;
  /** 是否显示每页条数切换器 */
  showSizeChanger?: boolean;
  /** 分页按钮两侧显示的页码按钮数量 */
  siblingCount?: number;
  /** 是否显示首尾页按钮 */
  showEdges?: boolean;
  /** 自定义样式类 */
  class?: string;
}

const props = withDefaults(defineProps<PaginationBarProps>(), {
  page: 1,
  pageSizes: () => [10, 20, 50, 100],
  showTotal: true,
  showSizeChanger: true,
  siblingCount: 1,
  showEdges: true,
});

const emit = defineEmits<{
  "update:page": [page: number];
  "update:pageSize": [pageSize: number];
  change: [page: number, pageSize: number];
}>();

const totalPages = computed(() => Math.ceil(props.total / props.pageSize) || 1);

const pageInfo = computed(() => {
  const start = (props.page - 1) * props.pageSize + 1;
  const end = Math.min(props.page * props.pageSize, props.total);
  return { start, end };
});

function handlePageChange(page: number) {
  if (page < 1 || page > totalPages.value) return;
  emit("update:page", page);
  emit("change", page, props.pageSize);
}

function handlePageSizeChange(value: AcceptableValue) {
  const newPageSize = Number(value);
  if (!newPageSize) return;
  const newPage = Math.min(
    props.page,
    Math.ceil(props.total / newPageSize) || 1,
  );
  emit("update:pageSize", newPageSize);
  emit("update:page", newPage);
  emit("change", newPage, newPageSize);
}
</script>

<template>
  <div :class="cn('flex flex-wrap items-center gap-4', props.class)">
    <!-- 总条数 -->
    <span v-if="showTotal" class="text-sm text-muted-foreground">
      共 {{ total }} 条，第 {{ pageInfo.start }}-{{ pageInfo.end }} 条
    </span>

    <!-- 分页器 -->
    <Pagination
      :page="page"
      :items-per-page="pageSize"
      :total="total"
      :sibling-count="siblingCount"
      :show-edges="showEdges"
      class="mx-0 w-auto"
      @update:page="handlePageChange"
    >
      <PaginationContent v-slot="{ items }">
        <PaginationFirst>
          <ChevronsLeft />
          <span class="hidden sm:block">首页</span>
        </PaginationFirst>
        <PaginationPrevious>
          <ChevronLeft />
          <span class="hidden sm:block">上一页</span>
        </PaginationPrevious>

        <template v-for="item in items">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="page === item.value"
          />
          <PaginationEllipsis v-else />
        </template>

        <PaginationNext>
          <span class="hidden sm:block">下一页</span>
          <ChevronRight />
        </PaginationNext>
        <PaginationLast>
          <span class="hidden sm:block">末页</span>
          <ChevronsRight />
        </PaginationLast>
      </PaginationContent>
    </Pagination>

    <!-- 每页条数 -->
    <div v-if="showSizeChanger" class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">每页</span>
      <Select
        :model-value="String(pageSize)"
        @update:model-value="handlePageSizeChange"
      >
        <SelectTrigger class="w-auto h-8 px-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="size in pageSizes"
            :key="size"
            :value="String(size)"
          >
            {{ size }}
          </SelectItem>
        </SelectContent>
      </Select>
      <span class="text-sm text-muted-foreground">条</span>
    </div>
  </div>
</template>
