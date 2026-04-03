<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
</script>

<route lang="yaml">
meta:
  layout: default
  menuTitle: 仪表盘
  menuIcon: lucide:home
  menuOrder: 1
</route>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">仪表盘</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="text-3xl font-bold">128</div>
          <div class="text-muted-foreground">总用户数</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="text-3xl font-bold">56</div>
          <div class="text-muted-foreground">活跃用户</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="p-6">
          <div class="text-3xl font-bold">23</div>
          <div class="text-muted-foreground">今日访问</div>
        </CardContent>
      </Card>
    </div>
    <p class="mt-6 text-muted-foreground">使用 admin 布局（带侧边栏）</p>
  </div>
</template>