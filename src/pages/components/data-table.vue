<script setup lang="tsx">
/**
 * DataTable 交互式示例
 * 包含所有配置功能，可实时修改
 */
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RowSelection, ColumnConfig, SortInfo } from "@/components/shared/data-table";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createTime: string;
}

// 数据
const data = ref<User[]>([
  { id: 1, name: "张三", email: "zhangsan@example.com", role: "admin", status: "active", createTime: "2024-01-15" },
  { id: 2, name: "李四", email: "lisi@example.com", role: "user", status: "active", createTime: "2024-02-20" },
  { id: 3, name: "王五", email: "wangwu@example.com", role: "user", status: "inactive", createTime: "2024-03-10" },
  { id: 4, name: "赵六", email: "zhaoliu@example.com", role: "user", status: "active", createTime: "2024-04-05" },
  { id: 5, name: "钱七", email: "qianqi@example.com", role: "admin", status: "inactive", createTime: "2024-05-12" },
  { id: 6, name: "孙八", email: "sunba@example.com", role: "user", status: "active", createTime: "2024-06-01" },
  { id: 7, name: "周九", email: "zhoujiu@example.com", role: "user", status: "active", createTime: "2024-06-15" },
  { id: 8, name: "吴十", email: "wushi@example.com", role: "user", status: "inactive", createTime: "2024-07-20" },
  { id: 9, name: "郑一", email: "zhengyi@example.com", role: "user", status: "active", createTime: "2024-08-03" },
  { id: 10, name: "冯二", email: "fenger@example.com", role: "admin", status: "active", createTime: "2024-08-18" },
  { id: 11, name: "陈三", email: "chensan@example.com", role: "user", status: "active", createTime: "2024-09-05" },
  { id: 12, name: "褚四", email: "chusi@example.com", role: "user", status: "inactive", createTime: "2024-09-22" },
  { id: 13, name: "卫五", email: "weiwu@example.com", role: "user", status: "active", createTime: "2024-10-08" },
  { id: 14, name: "蒋六", email: "jiangliu@example.com", role: "user", status: "active", createTime: "2024-10-25" },
  { id: 15, name: "沈七", email: "shenqi@example.com", role: "admin", status: "inactive", createTime: "2024-11-11" },
  { id: 16, name: "韩八", email: "hanba@example.com", role: "user", status: "active", createTime: "2024-11-28" },
  { id: 17, name: "杨九", email: "yangjiu@example.com", role: "user", status: "active", createTime: "2024-12-14" },
  { id: 18, name: "朱十", email: "zhushi@example.com", role: "user", status: "inactive", createTime: "2024-12-30" },
]);

// ========== 配置项 ==========

// 表格大小
const size = ref<"xs" | "sm" | "md" | "lg">("md");

// 显示表头
const showHeader = ref(true);

// 显示边框
const bordered = ref(true);

// 加载状态
const loading = ref(false);

// 空数据
const showEmpty = ref(false);

// 行选择
const enableSelection = ref(true);
const selectionType = ref<"single" | "multiple">("multiple");
const selectedRowKeys = ref<(string | number)[]>([]);

// 分页
const enablePagination = ref(true);
const remoteMode = ref(false);
const paginationPage = ref(1);
const paginationPageSize = ref(3);
const paginationPosition = ref<"left" | "center" | "right">("right");

// 排序
const enableSort = ref(true);
const currentSort = ref<SortInfo | undefined>(undefined);

// 行点击
const enableRowClick = ref(true);
const clickedRow = ref<User | null>(null);

// ========== 列配置 ==========

const columns = computed<ColumnConfig<User>[]>(() => [
  {
    key: "id",
    title: "ID",
    width: 80,
    align: "center",
    sortable: enableSort.value,
  },
  {
    key: "name",
    title: "用户名",
    align: "center",
    sortable: enableSort.value,
  },
  {
    key: "email",
    title: "邮箱",
    headerRender: () => (
      <div class="flex items-center justify-center gap-1">
        <Icon icon="lucide:mail" class="size-4" />
        邮箱
      </div>
    ),
    align: "center",
  },
  {
    key: "role",
    title: "角色",
    align: "center",
  },
  {
    key: "status",
    title: "状态",
    align: "center",
  },
  {
    key: "createTime",
    title: "创建时间",
    sortable: enableSort.value,
  },
  {
    key: "action",
    title: "操作",
    width: 120,
    align: "center",
  },
]);

// 行选择配置（受控模式）
const rowSelection = computed<RowSelection<User>>(() => ({
  enabled: enableSelection.value,
  type: selectionType.value,
  selectedRowKeys: selectedRowKeys.value,
  getCheckboxProps: (row: User) => ({
    disabled: row.role === "admin",
  }),
}));

// 分页配置
const paginationConfig = computed(() => {
  if (!enablePagination.value) return false;
  return {
    page: paginationPage.value,
    pageSize: paginationPageSize.value,
    pageSizes: [3, 5, 10, 20],
    showTotal: true,
    showSizeChanger: true,
    position: paginationPosition.value,
  };
});

// 排序配置
const sortConfig = computed(() => {
  if (!enableSort.value) return undefined;
  return currentSort.value;
});

// 分页事件处理
function handlePageChange(page: number) {
  paginationPage.value = page;
}

function handlePageSizeChange(pageSize: number) {
  paginationPageSize.value = pageSize;
  paginationPage.value = 1; // 切换每页条数时重置到第一页
}

// 排序事件处理
function handleSortChange(sort: SortInfo | undefined) {
  currentSort.value = sort;
}

// 行事件
function getRowEvents(row: User, _index: number) {
  if (!enableRowClick.value) return {};
  return {
    onClick: () => {
      clickedRow.value = row;
    },
  };
}

// 选择变化
function handleSelectionChange(keys: (string | number)[]) {
  selectedRowKeys.value = keys;
}

// 清空选择
function clearSelection() {
  selectedRowKeys.value = [];
}

// 显示数据
const displayData = computed(() => (showEmpty.value ? [] : data.value));
</script>

<route lang="yaml">
meta:
  layout: default
  title: DataTable 示例
  menuTitle: DataTable
  menuIcon: lucide:table
  menuGroup: 组件示例
  menuGroupIcon: lucide:component
  menuOrder: 20
</route>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">DataTable 数据表格</h1>
        <p class="text-muted-foreground mt-1.5">
          灵活的数据表格组件，支持多种配置方式
        </p>
      </div>
      <Badge variant="secondary" class="shrink-0">
        <Icon icon="lucide:sparkles" class="size-3.5 mr-1" />
        交互式配置
      </Badge>
    </div>

    <!-- 配置面板 -->
    <Card>
      <CardHeader class="pb-4">
        <CardTitle class="text-base">配置选项</CardTitle>
        <CardDescription>实时调整表格参数，查看效果变化</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <!-- 基础配置 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:settings-2" class="size-4" />
              基础配置
            </h4>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Label class="w-16 text-muted-foreground">大小</Label>
                <Select v-model="size">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="选择大小" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">超小</SelectItem>
                    <SelectItem value="sm">小</SelectItem>
                    <SelectItem value="md">中</SelectItem>
                    <SelectItem value="lg">大</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-16"></div>
                <div class="flex flex-wrap gap-x-4 gap-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <Checkbox v-model="showHeader" />
                    <span class="text-sm">表头</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <Checkbox v-model="bordered" />
                    <span class="text-sm">边框</span>
                  </label>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-16"></div>
                <div class="flex flex-wrap gap-x-4 gap-y-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <Checkbox v-model="loading" />
                    <span class="text-sm">加载</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <Checkbox v-model="showEmpty" />
                    <span class="text-sm">空数据</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 行选择 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:check-square" class="size-4" />
              行选择
            </h4>

            <div class="space-y-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="enableSelection" />
                <span class="text-sm">启用行选择</span>
              </label>

              <div class="flex items-center gap-3">
                <Label class="w-16 text-muted-foreground">模式</Label>
                <Select v-model="selectionType" :disabled="!enableSelection">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="选择模式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple">多选</SelectItem>
                    <SelectItem value="single">单选</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <p class="text-xs text-muted-foreground">
                <Icon icon="lucide:info" class="size-3 inline mr-1" />
                管理员角色行禁用选择
              </p>

              <div class="flex items-center gap-2 pt-1">
                <Badge variant="outline" class="font-normal">
                  已选: {{ selectedRowKeys.length }} 项
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  :disabled="selectedRowKeys.length === 0"
                  @click="clearSelection"
                >
                  清空
                </Button>
              </div>
            </div>
          </div>

          <!-- 行事件 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:mouse-pointer-click" class="size-4" />
              行事件
            </h4>

            <div class="space-y-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="enableRowClick" />
                <span class="text-sm">启用行点击</span>
              </label>

              <div
                v-if="clickedRow"
                class="p-3 bg-muted/50 rounded-lg border text-sm space-y-1"
              >
                <div class="text-muted-foreground text-xs">点击的行:</div>
                <div class="font-medium">{{ clickedRow.name }}</div>
                <div class="text-muted-foreground text-xs">{{ clickedRow.email }}</div>
              </div>
              <div
                v-else
                class="p-3 bg-muted/30 rounded-lg border border-dashed text-sm text-muted-foreground text-center"
              >
                点击表格行查看效果
              </div>
            </div>
          </div>

          <!-- 分页配置 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:grip-horizontal" class="size-4" />
              分页
            </h4>

            <div class="space-y-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="enablePagination" />
                <span class="text-sm">启用分页</span>
              </label>

              <div class="flex items-center gap-3">
                <Label class="w-16 text-muted-foreground">位置</Label>
                <Select v-model="paginationPosition" :disabled="!enablePagination">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="选择位置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">左对齐</SelectItem>
                    <SelectItem value="center">居中</SelectItem>
                    <SelectItem value="right">右对齐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="remoteMode" />
                <span class="text-sm">远程模式</span>
              </label>

              <p class="text-xs text-muted-foreground">
                <Icon icon="lucide:info" class="size-3 inline mr-1" />
                远程模式下不分页、不排序，由外部 API 处理
              </p>

              <div v-if="enablePagination && !remoteMode" class="flex items-center gap-2 pt-1">
                <Badge variant="outline" class="font-normal">
                  第 {{ paginationPage }} / {{ Math.ceil(data.length / paginationPageSize) }} 页
                </Badge>
              </div>
            </div>
          </div>

          <!-- 排序配置 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:arrow-up-down" class="size-4" />
              排序
            </h4>

            <div class="space-y-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="enableSort" />
                <span class="text-sm">启用排序</span>
              </label>

              <p class="text-xs text-muted-foreground">
                <Icon icon="lucide:info" class="size-3 inline mr-1" />
                点击表头切换：无 → 升序 → 降序 → 无
              </p>

              <p class="text-xs text-muted-foreground">
                <Icon icon="lucide:info" class="size-3 inline mr-1" />
                远程模式下排序由外部处理
              </p>

              <div v-if="currentSort" class="flex items-center gap-2 pt-1">
                <Badge variant="outline" class="font-normal">
                  {{ currentSort.field }}: {{ currentSort.order === 'ascend' ? '升序' : '降序' }}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  @click="currentSort = undefined"
                >
                  清除
                </Button>
              </div>
              <div v-else class="text-xs text-muted-foreground">
                点击表头开始排序
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 表格 -->
    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-base">示例表格</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          :data="displayData"
          :columns="columns"
          :size="size"
          :show-header="showHeader"
          :bordered="bordered"
          :loading="loading"
          :row-selection="rowSelection"
          :custom-row="getRowEvents"
          :pagination="paginationConfig"
          :sort="sortConfig"
          :remote="remoteMode"
          empty-text="暂无用户数据"
          @update:selected-row-keys="handleSelectionChange"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
          @update:sort="handleSortChange"
        >
          <!-- 自定义空数据状态 -->
          <template #empty>
            <div class="flex flex-col items-center gap-3 py-8">
              <Icon icon="lucide:users" class="size-12 text-muted-foreground/50" />
              <div class="text-muted-foreground">暂无用户数据</div>
              <Button size="sm">添加用户</Button>
            </div>
          </template>
          <!-- 表头自定义: 用户名 -->
          <template #header-name>
            <div class="flex items-center justify-center gap-1">
              <Icon icon="lucide:user" class="size-4" />
              用户名
            </div>
          </template>

          <!-- 单元格: 角色 -->
          <template #cell-role="{ value }">
            <Badge :variant="value === 'admin' ? 'default' : 'secondary'">
              {{ value === "admin" ? "管理员" : "用户" }}
            </Badge>
          </template>

          <!-- 单元格: 状态 -->
          <template #cell-status="{ value }">
            <Badge
              :variant="value === 'active' ? 'default' : 'outline'"
              :class="
                value === 'active'
                  ? 'bg-green-500'
                  : 'text-red-600 border-red-300 dark:border-red-500'
              "
            >
              {{ value === "active" ? "正常" : "禁用" }}
            </Badge>
          </template>

          <!-- 单元格: 操作 -->
          <template #cell-action>
            <div class="flex items-center justify-center gap-2">
              <Button variant="link" size="sm">编辑</Button>
              <Button variant="link" size="sm" class="text-destructive"
                >删除</Button
              >
            </div>
          </template>
        </DataTable>
      </CardContent>
    </Card>

    <!-- 代码示例 -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">当前配置</CardTitle>
        <CardDescription>复制以下代码使用当前配置</CardDescription>
      </CardHeader>
      <CardContent>
        <pre
          class="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto border"
        ><code>&lt;DataTable
  :data="data"
  :columns="columns"
  size="{{ size }}"
  :show-header="{{ showHeader }}"
  :bordered="{{ bordered }}"
  :loading="{{ loading }}"
  :row-selection="{
    enabled: {{ enableSelection }},
    type: '{{ selectionType }}'
  }"
  :pagination="{{ enablePagination ? '{ position: \'' + paginationPosition + '\' }' : 'false' }}"
  :sort="{{ currentSort ? '{ field: \'' + currentSort.field + '\', order: \'' + currentSort.order + '\' }' : 'undefined' }}"
  :remote="{{ remoteMode }}"
  :custom-row="getRowEvents"
/&gt;</code></pre>
      </CardContent>
    </Card>
  </div>
</template>
