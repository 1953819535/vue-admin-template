<script setup lang="ts">
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
      <div class="p-6 border rounded-lg bg-card">
        <div class="text-3xl font-bold">128</div>
        <div class="text-muted-foreground">总用户数</div>
      </div>
      <div class="p-6 border rounded-lg bg-card">
        <div class="text-3xl font-bold">56</div>
        <div class="text-muted-foreground">活跃用户</div>
      </div>
      <div class="p-6 border rounded-lg bg-card">
        <div class="text-3xl font-bold">23</div>
        <div class="text-muted-foreground">今日访问</div>
      </div>
    </div>
    <p class="mt-6 text-muted-foreground">使用 admin 布局（带侧边栏）</p>
  </div>
</template>