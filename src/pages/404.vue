<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<route lang="yaml">
meta:
  layout: blank
  title: 页面未找到
  menuHidden: true
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="text-center">
      <div class="text-6xl font-bold text-muted-foreground mb-4">404</div>
      <h1 class="text-2xl font-semibold mb-2">页面未找到</h1>
      <p class="text-muted-foreground mb-6">
        您访问的页面不存在或已被移除
      </p>
      <Button as-child>
        <RouterLink to="/">
          返回首页
        </RouterLink>
      </Button>
    </div>
  </div>
</template>