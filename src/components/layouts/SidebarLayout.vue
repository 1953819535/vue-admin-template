<script setup lang="ts">
import Logo from "@/components/app/Logo.vue";
import Actions from "@/components/app/Actions.vue";
import VerticalMenu from "@/components/app/VerticalMenu.vue";
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden bg-background">
    <!-- 侧边栏 -->
    <aside class="w-60 shrink-0 flex flex-col overflow-hidden border-r border-border bg-sidebar">
      <!-- 顶部 logo -->
      <div class="shrink-0 px-4 py-4 border-b border-border">
        <Logo variant="sidebar" />
      </div>

      <!-- 导航菜单 -->
      <nav class="flex-1 overflow-auto px-2 py-3">
        <VerticalMenu />
      </nav>

      <!-- 底部操作 -->
      <div class="shrink-0 px-3 py-3 border-t border-border">
        <Actions />
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col overflow-hidden min-w-0 bg-muted/30">
      <div class="flex-1 overflow-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
