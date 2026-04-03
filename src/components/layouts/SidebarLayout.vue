<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Logo from "@/components/app/header/Logo.vue"
import Actions from "@/components/app/header/Actions.vue"

const appStore = useAppStore()
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏 -->
    <aside
      class="border-r bg-sidebar flex flex-col transition-all duration-300"
      :class="appStore.sidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <!-- 顶部 logo 和折叠按钮 -->
      <div class="p-4 border-b flex items-center justify-between">
        <Logo v-if="!appStore.sidebarCollapsed" />
        <button
          class="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
          @click="appStore.toggleSidebar"
        >
          <Icon
            :icon="appStore.sidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
            class="size-5 text-sidebar-foreground"
          />
        </button>
      </div>

      <!-- 导航菜单 -->
      <slot name="sidebar" />

      <!-- 底部操作 -->
      <div class="p-4 border-t">
        <Actions v-if="!appStore.sidebarCollapsed" />
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- 内容插槽 -->
      <div class="flex-1 overflow-auto p-6">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>