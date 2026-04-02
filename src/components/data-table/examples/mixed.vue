<script setup lang="ts">
/**
 * 混合模式示例
 * columns 定义基础列配置，slot 覆盖特定单元格
 */
import { h, ref } from 'vue'
import { DataTable } from '@/components/data-table'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createTime: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', createTime: '2024-01-15' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active', createTime: '2024-02-20' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive', createTime: '2024-03-10' },
])

// 列配置：混合使用 customRender 和 slot
const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色', slot: 'role' },
  // 使用 customRender 格式化日期
  {
    key: 'createTime',
    title: '创建时间',
    customRender: ({ value }) => {
      return h('span', { class: 'text-muted-foreground' }, value)
    }
  },
  { key: 'status', title: '状态', slot: 'status' },
  { key: 'action', title: '操作', width: 150, slot: 'action' },
]

const loading = ref(false)

function handleView(row: User) {
  console.log('查看', row)
}

function handleEdit(row: User) {
  console.log('编辑', row)
}

function handleDelete(row: User) {
  console.log('删除', row)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">混合模式</h3>
    <p class="text-sm text-muted-foreground">
      columns 定义基础列，部分列使用 slot 自定义，部分使用 customRender
    </p>

    <DataTable :data="data" :columns="columns" :loading="loading">
      <!-- 角色列 -->
      <template #cell-role="{ value }">
        <span
          :class="[
            'px-2 py-1 rounded text-xs font-medium',
            value === 'admin'
              ? 'bg-primary/10 text-primary'
              : 'bg-secondary text-secondary-foreground'
          ]"
        >
          {{ value === 'admin' ? '管理员' : '用户' }}
        </span>
      </template>

      <!-- 状态列 -->
      <template #cell-status="{ value }">
        <span
          :class="[
            'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
            value === 'active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          ]"
        >
          <span
            :class="[
              'w-1.5 h-1.5 rounded-full',
              value === 'active' ? 'bg-green-500' : 'bg-red-500'
            ]"
          />
          {{ value === 'active' ? '正常' : '禁用' }}
        </span>
      </template>

      <!-- 操作列 -->
      <template #cell-action="{ row }">
        <div class="flex items-center gap-3">
          <button
            class="text-sm text-muted-foreground hover:text-foreground"
            @click="handleView(row)"
          >
            查看
          </button>
          <button
            class="text-sm text-primary hover:underline"
            @click="handleEdit(row)"
          >
            编辑
          </button>
          <button
            class="text-sm text-destructive hover:underline"
            @click="handleDelete(row)"
          >
            删除
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>