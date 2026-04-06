<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<route lang="yaml">
meta:
  layout: blank
  title: 无权限
  menuHidden: true
  constant: true
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="text-center">
      <div class="text-6xl font-bold text-red-500 mb-4">403</div>
      <h1 class="text-2xl font-semibold mb-2">无访问权限</h1>
      <p class="text-muted-foreground mb-6">
        您没有权限访问此页面，请联系管理员
      </p>
      <Button as-child>
        <RouterLink to="/">
          返回首页
        </RouterLink>
      </Button>
    </div>
  </div>
</template>