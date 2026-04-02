<script setup lang="ts">
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 新增用户
  requiresAuth: true
</route>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold">新增用户</h3>
      <RouterLink
        to="/users"
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        返回列表
      </RouterLink>
    </div>

    <form class="space-y-4 p-6 border rounded-lg bg-card">
      <div>
        <label class="block text-sm font-medium mb-1">用户名</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入用户名"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">邮箱</label>
        <input
          type="email"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入邮箱"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">角色</label>
        <select
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">初始密码</label>
        <input
          type="password"
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="请输入初始密码"
        />
      </div>

      <div class="pt-4 flex gap-4">
        <button
          type="submit"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          创建用户
        </button>
        <RouterLink
          to="/users"
          class="px-4 py-2 border rounded-md hover:bg-muted"
        >
          取消
        </RouterLink>
      </div>
    </form>
  </div>
</template>