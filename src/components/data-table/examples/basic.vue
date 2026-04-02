<script setup lang="ts">
/**
 * 基础表格示例
 * 最简单的使用方式，通过 columns prop 定义列配置
 */
import { ref } from 'vue'
import { DataTable } from '@/components/data-table'

interface User {
  id: number
  name: string
  email: string
  role: string
}

const data = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
])

const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
]
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">基础表格</h3>
    <DataTable :data="data" :columns="columns" />
  </div>
</template>