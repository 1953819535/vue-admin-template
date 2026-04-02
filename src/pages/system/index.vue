<script setup lang="ts">
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 系统设置
  requiresAuth: true
  roles: [admin]
</route>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">系统设置</h2>

    <!-- 子导航 -->
    <nav class="flex gap-4 mb-6 border-b pb-4">
      <RouterLink
        to="/system"
        class="px-4 py-2 rounded-md bg-primary text-primary-foreground"
      >
        基本信息
      </RouterLink>
      <RouterLink
        to="/system/settings"
        class="px-4 py-2 rounded-md hover:bg-muted"
      >
        参数配置
      </RouterLink>
      <RouterLink
        to="/system/logs"
        class="px-4 py-2 rounded-md hover:bg-muted"
      >
        操作日志
      </RouterLink>
    </nav>

    <!-- 基本信息 -->
    <div class="p-6 border rounded-lg bg-card">
      <h3 class="text-lg font-semibold mb-4">系统基本信息</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-muted-foreground">系统名称</label>
          <div class="font-medium">后台管理系统</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">版本号</label>
          <div class="font-medium">v1.0.0</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">部署环境</label>
          <div class="font-medium">生产环境</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">运行状态</label>
          <div class="font-medium text-green-600">正常运行</div>
        </div>
      </div>
    </div>

    <!-- 子路由渲染位置 -->
    <RouterView />
  </div>
</template>