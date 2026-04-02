<script setup lang="ts">
/**
 * 表头自定义渲染示例
 * 展示表头的多种自定义方式
 */
import { h, ref } from 'vue'
import { Icon } from '@iconify/vue'
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

// 方式一：使用 headerSlot 插槽
// 方式二：使用 headerRender 渲染函数
const columns = [
  { key: 'id', title: 'ID', width: 80 },
  {
    key: 'name',
    title: '用户名',
    headerSlot: 'name',  // 使用插槽
  },
  {
    key: 'email',
    title: '邮箱',
    // 使用渲染函数添加图标
    headerRender: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Icon, { icon: 'lucide:mail', class: 'size-4' }),
      '邮箱'
    ])
  },
  { key: 'role', title: '角色', slot: 'role' },
  {
    key: 'status',
    title: '状态',
    headerSlot: 'status',  // 使用插槽
    slot: 'status'
  },
  {
    key: 'createTime',
    title: '创建时间',
    // 使用渲染函数
    headerRender: () => h('div', { class: 'flex items-center gap-1' }, [
      h(Icon, { icon: 'lucide:calendar', class: 'size-4' }),
      '创建时间'
    ])
  },
  { key: 'action', title: '操作', width: 150, slot: 'action' },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-2">表头自定义渲染</h3>
      <p class="text-sm text-muted-foreground mb-4">
        支持三种方式：headerSlot 插槽、headerRender 渲染函数、子组件 header slot
      </p>
    </div>

    <DataTable :data="data" :columns="columns">
      <!-- 表头插槽：用户名 -->
      <template #header-name>
        <div class="flex items-center gap-1">
          <Icon icon="lucide:user" class="size-4" />
          用户名
        </div>
      </template>

      <!-- 表头插槽：状态 -->
      <template #header-status>
        <div class="flex items-center gap-1">
          <Icon icon="lucide:circle-dot" class="size-4" />
          状态
        </div>
      </template>

      <!-- 单元格插槽：角色 -->
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

      <!-- 单元格插槽：状态 -->
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

      <!-- 单元格插槽：操作 -->
      <template #cell-action="{ row }">
        <div class="flex items-center gap-3">
          <button class="text-sm text-primary hover:underline">编辑</button>
          <button class="text-sm text-destructive hover:underline">删除</button>
        </div>
      </template>
    </DataTable>
  </div>
</template>