<script setup lang="ts">
import { ref } from 'vue'

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive' },
])
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 用户管理
  requiresAuth: true
</route>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">用户管理</h2>
      <RouterLink
        to="/users/create"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
      >
        新增用户
      </RouterLink>
    </div>

    <!-- 子路由导航 -->
    <div class="mb-4 text-sm text-muted-foreground">
      <span>当前页面：用户列表</span>
      <span class="mx-2">|</span>
      <RouterLink to="/users/1" class="text-primary hover:underline">查看用户详情示例</RouterLink>
    </div>

    <!-- 用户列表表格 -->
    <div class="border rounded-lg">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th class="px-4 py-3 text-left">ID</th>
            <th class="px-4 py-3 text-left">用户名</th>
            <th class="px-4 py-3 text-left">邮箱</th>
            <th class="px-4 py-3 text-left">角色</th>
            <th class="px-4 py-3 text-left">状态</th>
            <th class="px-4 py-3 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t hover:bg-muted/30">
            <td class="px-4 py-3">{{ user.id }}</td>
            <td class="px-4 py-3">{{ user.name }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span :class="user.role === 'admin' ? 'text-primary' : ''">
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="user.status === 'active' ? 'text-green-600' : 'text-muted-foreground'"
              >
                {{ user.status === 'active' ? '活跃' : '禁用' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <RouterLink
                  :to="`/users/${user.id}`"
                  class="text-primary hover:underline"
                >
                  查看
                </RouterLink>
                <RouterLink
                  :to="`/users/${user.id}/edit`"
                  class="text-primary hover:underline"
                >
                  编辑
                </RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 子路由渲染位置 -->
    <RouterView />
  </div>
</template>