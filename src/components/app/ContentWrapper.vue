<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'

const appStore = useAppStore()

// ESC 键退出全屏
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && appStore.contentFullscreen) {
    appStore.setContentFullscreen(false)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div :class="['flex flex-col h-full', appStore.contentFullscreen ? 'p-4' : '']">
    <!-- 工具栏 -->
    <div class="flex items-center justify-end gap-2 mb-4">
      <!-- 非全屏时显示进入全屏按钮 -->
      <Button
        v-if="!appStore.contentFullscreen"
        variant="ghost"
        size="icon"
        @click="appStore.setContentFullscreen(true)"
      >
        <Icon icon="lucide:maximize-2" class="size-4" />
      </Button>

      <!-- 全屏时显示退出全屏按钮 -->
      <div v-if="appStore.contentFullscreen" class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">ESC 退出</span>
        <Button
          variant="outline"
          size="sm"
          @click="appStore.setContentFullscreen(false)"
        >
          <Icon icon="lucide:minimize-2" class="size-4 mr-1" />
          退出全屏
        </Button>
      </div>
    </div>

    <!-- 内容 -->
    <div class="flex-1 overflow-auto">
      <slot />
    </div>
  </div>
</template>