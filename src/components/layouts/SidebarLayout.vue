<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import { Button } from '@/components/ui/button'
import Logo from "@/components/app/header/Logo.vue"
import Actions from "@/components/app/header/Actions.vue"

const appStore = useAppStore()
</script>

<template>
  <div class="flex w-screen h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <aside
      class="border-r bg-sidebar flex flex-col transition-all duration-300 h-full"
      :class="appStore.sidebarCollapsed ? 'w-16' : 'w-64'"
    >
      <!-- 顶部 logo 和折叠按钮 -->
      <div class="p-4 border-b flex items-center justify-between shrink-0">
        <Logo v-if="!appStore.sidebarCollapsed" />
        <Button
          variant="ghost"
          size="icon"
          @click="appStore.toggleSidebar"
        >
          <Icon
            :icon="appStore.sidebarCollapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'"
            class="size-5"
          />
        </Button>
      </div>

      <!-- 导航菜单 -->
      <div class="flex-1 overflow-auto">
        <slot name="sidebar" />
      </div>

      <!-- 底部操作 -->
      <div class="p-4 border-t shrink-0">
        <Actions :collapsed="appStore.sidebarCollapsed" />
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col overflow-hidden h-full">
      <!-- 内容插槽 -->
      <div class="flex-1 overflow-auto p-6">
        <slot name="content" />
      </div>
    </main>
  </div>
</template>