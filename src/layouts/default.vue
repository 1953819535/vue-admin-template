<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore, type LayoutType } from '@/stores/modules/app'
import SidebarLayout from '@/components/layouts/SidebarLayout.vue'
import TopNavLayout from '@/components/layouts/TopNavLayout.vue'

const appStore = useAppStore()

const layoutComponents: Record<LayoutType, any> = {
  sidebar: SidebarLayout,
  'top-nav': TopNavLayout,
}

const currentLayout = computed(() => layoutComponents[appStore.layout])
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>