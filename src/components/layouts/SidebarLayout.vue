<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏插槽 - 全屏时隐藏 -->
    <aside v-if="!appStore.contentFullscreen" class="w-64 border-r bg-sidebar flex flex-col">
      <slot name="sidebar" />
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col">
      <!-- 顶部插槽 - 全屏时隐藏 -->
      <slot v-if="!appStore.contentFullscreen" name="header" />

      <!-- 内容插槽 -->
      <div :class="['flex-1 overflow-auto', appStore.contentFullscreen ? '' : 'p-6']">
        <slot name="content" />
      </div>

      <!-- 底部插槽 - 全屏时隐藏 -->
      <slot v-if="!appStore.contentFullscreen" name="footer" />
    </main>
  </div>
</template>