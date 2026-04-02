<script setup lang="ts">
/**
 * 自定义单元格示例
 * 使用 slot 自定义单元格内容
 */
import { ref } from 'vue'
import { DataTable } from '@/components/data-table'

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
])

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色', slot: 'role' },
  { key: 'status', title: '状态', slot: 'status' },
  { key: 'action', title: '操作', width: 150, slot: 'action' },
]

function handleEdit(row: User) {
  console.log('编辑', row)
}

function handleDelete(row: User) {
  console.log('删除', row)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">自定义单元格</h3>
    <DataTable :data="data" :columns="columns">
      <!-- 角色列 -->
      <template #cell-role="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded text-xs',
            value === 'admin'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          ]"
        >
          {{ value === 'admin' ? '管理员' : '普通用户' }}
        </span>
      </template>

      <!-- 状态列 -->
      <template #cell-status="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded text-xs',
            value === 'active'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-muted text-muted-foreground'
          ]"
        >
          {{ value === 'active' ? '启用' : '禁用' }}
        </span>
      </template>

      <!-- 操作列 -->
      <template #cell-action="{ row }">
        <div class="flex gap-2">
          <button
            class="text-primary hover:underline text-sm"
            @click="handleEdit(row)"
          >
            编辑
          </button>
          <button
            class="text-destructive hover:underline text-sm"
            @click="handleDelete(row)"
          >
            删除
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>