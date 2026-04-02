<script setup lang="ts">
/**
 * 子组件模式示例
 * 使用 DataTableColumn 子组件声明式定义列
 */
import { ref } from 'vue'
import { DataTable, DataTableColumn } from '@/components/data-table'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', status: 'inactive' },
])

function handleEdit(row: User) {
  console.log('编辑', row)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">子组件模式</h3>
    <DataTable :data="data">
      <DataTableColumn key="id" title="ID" :width="80" />
      <DataTableColumn key="name" title="用户名" />
      <DataTableColumn key="email" title="邮箱" />

      <!-- 带插槽的列 -->
      <DataTableColumn key="status" title="状态">
        <template #default="{ value }">
          <span
            :class="[
              'px-2 py-1 rounded text-xs',
              value === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            ]"
          >
            {{ value === 'active' ? '启用' : '禁用' }}
          </span>
        </template>
      </DataTableColumn>

      <DataTableColumn key="action" title="操作" :width="100">
        <template #default="{ row }">
          <button
            class="text-primary hover:underline text-sm"
            @click="handleEdit(row)"
          >
            编辑
          </button>
        </template>
      </DataTableColumn>
    </DataTable>
  </div>
</template>