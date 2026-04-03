<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = (e: Event) => {
  e.preventDefault()
  // 模拟登录逻辑
  router.push('/')
}
</script>

<route lang="yaml">
meta:
  layout: blank
  menuHidden: true
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">登录</CardTitle>
        <CardDescription>请输入您的账号信息</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit="handleLogin">
          <div class="space-y-2">
            <Label for="username">用户名</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="请输入用户名"
            />
          </div>
          <div class="space-y-2">
            <Label for="password">密码</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
            />
          </div>
          <Button type="submit" class="w-full">
            登录
          </Button>
        </form>
        <p class="text-center mt-4 text-sm text-muted-foreground">
          使用 blank 布局（无侧边栏）
        </p>
      </CardContent>
    </Card>
  </div>
</template>