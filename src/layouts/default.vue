<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { useAppStore, type LayoutType } from '@/stores/modules/app'
import { useAuthStore } from '@/stores/modules/auth'
import Watermark from 'watermark-plus'
import SidebarLayout from '@/components/layouts/SidebarLayout.vue'
import TopNavLayout from '@/components/layouts/TopNavLayout.vue'

const appStore = useAppStore()
const authStore = useAuthStore()

const layoutComponents: Record<LayoutType, any> = {
  sidebar: SidebarLayout,
  'top-nav': TopNavLayout,
}

const currentLayout = computed(() => layoutComponents[appStore.layout])

let watermark: Watermark | null = null
let prevEnabled: boolean | undefined
let prevName: string | undefined

watch(
  [() => appStore.watermarkConfig.enabled, () => authStore.displayName],
  ([enabled, name]) => {
    if (enabled === prevEnabled && name === prevName) return
    prevEnabled = enabled
    prevName = name

    watermark?.destroy()
    watermark = null

    if (enabled && name?.trim()) {
      const config = appStore.watermarkConfig
      watermark = new Watermark({
        content: name,
        alpha: config.alpha ?? 0.1,
        rotate: config.rotate ?? -20,
      })
      watermark.create()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  watermark?.destroy()
  watermark = null
})
</script>

<template>
  <component :is="currentLayout">
    <RouterView />
  </component>
</template>