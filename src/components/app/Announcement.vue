<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useLocalStorage, useIntervalFn, useElementHover } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { fetchAnnouncements } from '@/mock/announcement'
import type { AnnouncementItem } from '@/types/announcement'

const STORAGE_KEY = 'announcement-closed'
const CLOSE_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24小时
const ROTATION_INTERVAL_MS = 5000 // 5秒

const announcements = ref<AnnouncementItem[]>([])
const visible = ref(true)
const currentIndex = ref(0)
const containerRef = ref<HTMLElement | null>(null)
const isHovered = useElementHover(containerRef)

const closedAt = useLocalStorage<string | null>(STORAGE_KEY, null)

const typeConfig = {
  info: {
    style: 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300',
    icon: 'lucide:info',
  },
  warning: {
    style: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
    icon: 'lucide:alert-triangle',
  },
  success: {
    style: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    icon: 'lucide:check-circle',
  },
  error: {
    style: 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300',
    icon: 'lucide:x-circle',
  },
} satisfies Record<AnnouncementItem['type'], { style: string; icon: string }>

const { pause: pauseRotation, resume: resumeRotation } = useIntervalFn(
  () => {
    currentIndex.value = (currentIndex.value + 1) % announcements.value.length
  },
  ROTATION_INTERVAL_MS,
  { immediate: false }
)

watch(isHovered, (hovered) => {
  hovered ? pauseRotation() : resumeRotation()
})

const current = computed(() => announcements.value[currentIndex.value])

onMounted(async () => {
  if (closedAt.value) {
    const closedTime = new Date(closedAt.value).getTime()
    if (!isNaN(closedTime) && Date.now() - closedTime < CLOSE_EXPIRY_MS) {
      visible.value = false
      return
    }
  }

  try {
    announcements.value = await fetchAnnouncements()
    if (announcements.value.length > 1) {
      resumeRotation()
    }
  } catch (e) {
    console.warn('Failed to fetch announcements:', e)
  }
})

function close() {
  visible.value = false
  closedAt.value = new Date().toISOString()
  pauseRotation()
}
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-full"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-full"
  >
    <div
      v-if="visible && announcements.length > 0"
      ref="containerRef"
      class="relative overflow-hidden border-b"
      :class="typeConfig[current?.type ?? 'info'].style"
    >
      <div class="container mx-auto px-4 py-2 flex items-center gap-3">
        <Icon
          :icon="typeConfig[current?.type ?? 'info'].icon"
          class="shrink-0 text-lg"
        />

        <div class="flex-1 overflow-hidden">
          <TransitionGroup
            name="announcement"
            tag="div"
            class="relative"
          >
            <div
              :key="current?.id"
              class="flex items-center gap-2 whitespace-nowrap"
            >
              <span class="font-medium">{{ current?.title }}</span>
              <span class="opacity-70">{{ current?.content }}</span>
            </div>
          </TransitionGroup>
        </div>

        <div
          v-if="announcements.length > 1"
          class="shrink-0 flex items-center gap-1"
        >
          <span
            v-for="(item, index) in announcements"
            :key="item.id"
            class="w-1.5 h-1.5 rounded-full transition-all duration-300"
            :class="index === currentIndex ? 'bg-current w-3' : 'bg-current/30'"
          />
        </div>

        <button
          class="shrink-0 p-1 rounded-md hover:bg-foreground/5 transition-colors"
          @click="close"
        >
          <Icon icon="lucide:x" class="text-lg" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.announcement-enter-active,
.announcement-leave-active {
  transition: all 0.3s ease;
}

.announcement-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.announcement-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.announcement-leave-active {
  position: absolute;
}
</style>