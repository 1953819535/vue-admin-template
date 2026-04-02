<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore, type LayoutType } from '@/stores/modules/app'
import SidebarLayout from './SidebarLayout.vue'
import TopNavLayout from './TopNavLayout.vue'

const appStore = useAppStore()

// 布局组件映射
const layoutComponents: Record<LayoutType, any> = {
  'sidebar': SidebarLayout,
  'top-nav': TopNavLayout,
}

// 当前布局组件
const currentLayout = computed(() => layoutComponents[appStore.layout])
</script>

<template>
  <component :is="currentLayout">
    <template #sidebar>
      <slot name="sidebar" />
    </template>
    <template #nav>
      <slot name="nav" />
    </template>
    <template #header>
      <slot name="header" />
    </template>
    <template #content>
      <slot name="content" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </component>
</template>