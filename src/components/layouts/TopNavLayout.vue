<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- 顶部导航插槽 - 全屏时隐藏 -->
    <header v-if="!appStore.contentFullscreen" class="border-b bg-background">
      <slot name="header" />
    </header>

    <!-- 横向菜单插槽 - 全屏时隐藏 -->
    <nav v-if="!appStore.contentFullscreen" class="border-b bg-muted/30">
      <slot name="nav" />
    </nav>

    <!-- 主内容区 -->
    <main :class="['flex-1 overflow-auto', appStore.contentFullscreen ? '' : 'p-6']">
      <slot name="content" />
    </main>

    <!-- 底部插槽 - 全屏时隐藏 -->
    <footer v-if="!appStore.contentFullscreen" class="border-t bg-background">
      <slot name="footer" />
    </footer>
  </div>
</template>