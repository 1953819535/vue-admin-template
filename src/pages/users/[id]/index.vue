<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const userId = route.params.id;

// 模拟用户数据
const user = {
  id: userId,
  name: "张三",
  email: "zhangsan@example.com",
  role: "admin",
  status: "active",
  createdAt: "2024-01-15",
  lastLogin: "2024-12-20 14:30",
};
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 用户详情
  requiresAuth: true
</route>

<template>
  <div class="p-6 border rounded-lg bg-card">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold">用户详情</h3>
      <RouterLink
        to="/users"
        class="text-sm text-muted-foreground hover:text-foreground"
      >
        返回列表
      </RouterLink>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-muted-foreground">用户 ID</label>
          <div class="font-medium">{{ user.id }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">用户名</label>
          <div class="font-medium">{{ user.name }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">邮箱</label>
          <div class="font-medium">{{ user.email }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">角色</label>
          <div class="font-medium">{{ user.role }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">状态</label>
          <div class="font-medium text-green-600">活跃</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">注册时间</label>
          <div class="font-medium">{{ user.createdAt }}</div>
        </div>
      </div>

      <div class="pt-4 border-t flex gap-4">
        <RouterLink
          :to="`/users/${user.id}/edit`"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          编辑用户
        </RouterLink>
        <button class="px-4 py-2 border rounded-md hover:bg-muted">
          禁用账户
        </button>
      </div>
    </div>
  </div>
</template>
