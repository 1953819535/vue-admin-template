<script setup lang="ts">
/**
 * 完整功能示例
 * 展示 size、bordered、showHeader、rowSelection、customRow
 */
import { ref } from 'vue'
import { DataTable } from '@/components/data-table'
import type { RowSelection } from '@/components/data-table'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'active' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', role: 'admin', status: 'inactive' },
])

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色', slot: 'role' },
  { key: 'status', title: '状态', slot: 'status' },
]

// 表格配置
const size = ref<'sm' | 'md' | 'lg'>('md')
const bordered = ref(true)
const showHeader = ref(true)

// 行选择
const selectedRowKeys = ref<(string | number)[]>([])
const rowSelection: RowSelection<User> = {
  enabled: true,
  getCheckboxProps: (row) => ({
    disabled: row.role === 'admin', // 管理员不可选
  }),
}

function handleSelectionChange(keys: (string | number)[], rows: User[]) {
  selectedRowKeys.value = keys
  console.log('选中的行:', rows)
}

// 行事件
function handleRowClick(row: User, index: number) {
  console.log('点击行:', row, index)
}

// 提交选中项
function handleSubmit() {
  const selectedRows = data.value.filter((row, i) =>
    selectedRowKeys.value.includes(row.id)
  )
  console.log('提交选中:', selectedRows)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">完整功能示例</h3>

    <!-- 配置面板 -->
    <div class="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
      <div class="flex items-center gap-2">
        <span class="text-sm">表格大小:</span>
        <select v-model="size" class="px-2 py-1 border rounded text-sm">
          <option value="sm">小</option>
          <option value="md">中</option>
          <option value="lg">大</option>
        </select>
      </div>

      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="bordered" />
        显示边框
      </label>

      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" v-model="showHeader" />
        显示表头
      </label>
    </div>

    <!-- 表格 -->
    <DataTable
      :data="data"
      :columns="columns"
      :size="size"
      :bordered="bordered"
      :show-header="showHeader"
      :row-selection="rowSelection"
      :custom-row="(row, index) => ({
        onClick: () => handleRowClick(row, index)
      })"
      @update:selected-row-keys="handleSelectionChange"
    >
      <template #cell-role="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded text-xs',
            value === 'admin'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          ]"
        >
          {{ value === 'admin' ? '管理员' : '用户' }}
        </span>
      </template>

      <template #cell-status="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded text-xs',
            value === 'active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-muted text-muted-foreground'
          ]"
        >
          {{ value === 'active' ? '启用' : '禁用' }}
        </span>
      </template>
    </DataTable>

    <!-- 操作按钮 -->
    <div class="flex items-center gap-4">
      <span class="text-sm text-muted-foreground">
        已选择 {{ selectedRowKeys.length }} 项
      </span>
      <button
        class="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm"
        @click="handleSubmit"
      >
        提交选中
      </button>
    </div>
  </div>
</template>