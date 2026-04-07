<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'
import { useScroll } from '@vueuse/core'
import { Button } from '@/components/ui/button'

const props = withDefaults(
  defineProps<{
    /** 滚动超过多少像素时显示按钮 */
    threshold?: number
  }>(),
  {
    threshold: 300,
  },
)

const scrollContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainer, { throttle: 100 })
const visible = computed(() => y.value > props.threshold)

function scrollToTop() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  scrollContainer.value = document.querySelector('[data-scroll-container]')
  if (import.meta.env.DEV && !scrollContainer.value) {
    console.warn('[BackToTop] 未找到 [data-scroll-container] 元素')
  }
})
</script>

<template>
  <Transition name="fade">
    <Button
      v-if="visible"
      variant="secondary"
      size="icon"
      class="fixed bottom-6 right-6 z-50 shadow-md"
      @click="scrollToTop"
    >
      <ArrowUp class="size-4" />
    </Button>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>