<script setup lang="ts">
</script>

<route lang="yaml">
meta:
  layout: blank
  title: 无权限
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="text-center">
      <div class="text-6xl font-bold text-red-500 mb-4">403</div>
      <h1 class="text-2xl font-semibold mb-2">无访问权限</h1>
      <p class="text-muted-foreground mb-6">
        您没有权限访问此页面，请联系管理员
      </p>
      <RouterLink
        to="/"
        class="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
      >
        返回首页
      </RouterLink>
    </div>
  </div>
</template>