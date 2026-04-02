<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleLogin = (e: Event) => {
  e.preventDefault()
  // 模拟登录逻辑
  router.push('/')
}
</script>

<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border">
      <h2 class="text-2xl font-bold text-center mb-6">登录</h2>
      <form class="space-y-4" @submit="handleLogin">
        <div>
          <label class="block text-sm font-medium mb-1">用户名</label>
          <input
            type="text"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入用户名"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">密码</label>
          <input
            type="password"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="请输入密码"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90"
        >
          登录
        </button>
      </form>
      <p class="text-center mt-4 text-sm text-muted-foreground">
        使用 blank 布局（无侧边栏）
      </p>
    </div>
  </div>
</template>