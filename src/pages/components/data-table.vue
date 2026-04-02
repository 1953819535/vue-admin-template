<script setup lang="tsx">
/**
 * DataTable 交互式示例
 * 包含所有配置功能，可实时修改
 */
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import { DataTable } from "@/components/data-table";
import type { RowSelection, ColumnConfig } from "@/components/data-table";

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
  {
    id: 1,
    name: "张三",
    email: "zhangsan@example.com",
    role: "admin",
    status: "active",
    createTime: "2024-01-15",
  },
  {
    id: 2,
    name: "李四",
    email: "lisi@example.com",
    role: "user",
    status: "active",
    createTime: "2024-02-20",
  },
  {
    id: 3,
    name: "王五",
    email: "wangwu@example.com",
    role: "user",
    status: "inactive",
    createTime: "2024-03-10",
  },
  {
    id: 4,
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "user",
    status: "active",
    createTime: "2024-04-05",
  },
  {
    id: 5,
    name: "钱七",
    email: "qianqi@example.com",
    role: "admin",
    status: "inactive",
    createTime: "2024-05-12",
  },
]);

// ========== 配置项 ==========

// 表格大小
const size = ref<"sm" | "md" | "lg">("md");

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
const selectedRowKeys = ref<(string | number)[]>([]);

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
  },
  {
    key: "name",
    title: "用户名",
    headerSlot: "name",
    align: "center",
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
    slot: "role",
    align: "center",
  },
  {
    key: "status",
    title: "状态",
    slot: "status",
    align: "center",
  },
  {
    key: "createTime",
    title: "创建时间",
  },
  {
    key: "action",
    title: "操作",
    width: 120,
    align: "center",
    slot: "action",
  },
]);

// 行选择配置（受控模式）
const rowSelection = computed<RowSelection<User>>(() => ({
  enabled: enableSelection.value,
  selectedRowKeys: selectedRowKeys.value,
  getCheckboxProps: (row) => ({
    disabled: row.role === "admin",
  }),
}));

// 行事件
function getRowEvents(row: User, index: number) {
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
  layout: admin
  title: DataTable 示例
</route>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">DataTable 数据表格</h1>
      <p class="text-muted-foreground mt-1">
        灵活的数据表格组件，支持多种配置方式。下方可实时调整配置。
      </p>
    </div>

    <!-- 配置面板 -->
    <div
      class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border"
    >
      <div class="space-y-4">
        <h3 class="font-semibold text-sm">基础配置</h3>

        <div class="flex items-center gap-2">
          <label class="text-sm w-20">表格大小</label>
          <select
            v-model="size"
            class="flex-1 px-2 py-1.5 border rounded text-sm bg-background"
          >
            <option value="sm">小</option>
            <option value="md">中</option>
            <option value="lg">大</option>
          </select>
        </div>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="showHeader" class="rounded" />
          显示表头
        </label>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="bordered" class="rounded" />
          显示边框
        </label>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="loading" class="rounded" />
          加载状态
        </label>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="showEmpty" class="rounded" />
          空数据状态
        </label>
      </div>

      <div class="space-y-4">
        <h3 class="font-semibold text-sm">行选择</h3>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="enableSelection" class="rounded" />
          启用行选择
        </label>

        <p class="text-xs text-muted-foreground">* 管理员角色的行禁用选择</p>

        <div class="text-sm">
          已选择:
          <span class="font-medium">{{ selectedRowKeys.length }}</span> 项
        </div>

        <button
          class="px-3 py-1.5 text-sm border rounded hover:bg-muted"
          @click="clearSelection"
        >
          清空选择
        </button>
      </div>

      <div class="space-y-4">
        <h3 class="font-semibold text-sm">行事件</h3>

        <label class="flex items-center gap-2 text-sm">
          <input type="checkbox" v-model="enableRowClick" class="rounded" />
          启用行点击
        </label>

        <div v-if="clickedRow" class="p-3 bg-background rounded border text-sm">
          <div class="text-muted-foreground mb-1">点击的行:</div>
          <div class="font-medium">{{ clickedRow.name }}</div>
          <div class="text-muted-foreground">{{ clickedRow.email }}</div>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <DataTable
      :data="displayData"
      :columns="columns"
      :size="size"
      :show-header="showHeader"
      :bordered="bordered"
      :loading="loading"
      :row-selection="rowSelection"
      :custom-row="getRowEvents"
      empty-text="暂无用户数据"
      @update:selected-row-keys="handleSelectionChange"
    >
      <!-- 自定义空数据状态 -->
      <template #empty>
        <div class="flex flex-col items-center gap-3 py-8">
          <Icon icon="lucide:users" class="size-12 text-muted-foreground/50" />
          <div class="text-muted-foreground">暂无用户数据</div>
          <button
            class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            添加用户
          </button>
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
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-medium',
            value === 'admin'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground',
          ]"
        >
          {{ value === "admin" ? "管理员" : "用户" }}
        </span>
      </template>

      <!-- 单元格: 状态 -->
      <template #cell-status="{ value }">
        <span
          :class="[
            'inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            value === 'active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          ]"
        >
          <span
            :class="[
              'w-1.5 h-1.5 rounded-full',
              value === 'active' ? 'bg-green-500' : 'bg-red-500',
            ]"
          />
          {{ value === "active" ? "正常" : "禁用" }}
        </span>
      </template>

      <!-- 单元格: 操作 -->
      <template #cell-action="{ row }">
        <div class="flex items-center justify-center gap-2">
          <button class="text-primary hover:underline text-sm">编辑</button>
          <button class="text-destructive hover:underline text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <!-- 代码示例 -->
    <div class="p-4 bg-muted/30 rounded-lg border">
      <h3 class="font-semibold text-sm mb-3">当前配置代码</h3>
      <pre
        class="text-xs bg-background p-3 rounded overflow-x-auto"
      ><code>&lt;DataTable
  :data="data"
  :columns="columns"
  size="{{ size }}"
  :show-header="{{ showHeader }}"
  :bordered="{{ bordered }}"
  :loading="{{ loading }}"
  :row-selection="{ enabled: {{ enableSelection }} }"
  :custom-row="getRowEvents"
/&gt;</code></pre>
    </div>
  </div>
</template>
