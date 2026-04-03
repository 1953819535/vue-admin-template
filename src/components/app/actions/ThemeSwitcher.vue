<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import themes from '@/themes/tweakcn-themes.json'
import themeNamesZh from '@/themes/theme-names-zh.json'
import Button from '@/components/ui/button/Button.vue'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const appStore = useAppStore()
const drawerOpen = ref(false)
const scrollContainerRef = ref<HTMLElement | null>(null)

const drawerDirection = computed(() => appStore.layout === 'sidebar' ? 'left' : 'right')

// 抽屉打开时滚动到当前选中的主题
watch(drawerOpen, async (open) => {
  if (open) {
    await nextTick()
    // 等待 Drawer 动画完成后滚动
    setTimeout(() => {
      const selectedBtn = scrollContainerRef.value?.querySelector('.border-primary')
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ behavior: 'instant', block: 'center' })
      }
    }, 100)
  }
})

type ThemeNamesZh = Record<string, { title: string; description: string }>

const themeNamesZhMap = themeNamesZh as ThemeNamesZh

type ThemeCssVars = { primary?: string; accent?: string; secondary?: string; background?: string }

// Build a Map for O(1) theme lookup
const themeDataMap = new Map(themes.map(t => [t.name, t]))

const themePreviewData = computed(() => {
  return appStore.availableThemes.map(theme => {
    const themeData = themeDataMap.get(theme.name)
    const light = (themeData?.cssVars.light || {}) as ThemeCssVars
    const dark = (themeData?.cssVars.dark || {}) as ThemeCssVars
    const vars = appStore.isDark ? dark : light

    return {
      name: theme.name,
      title: themeNamesZhMap[theme.name]?.title || theme.name,
      description: themeNamesZhMap[theme.name]?.description || '',
      colors: {
        primary: vars.primary || '',
        accent: vars.accent || vars.secondary || '',
        background: vars.background || '',
      },
    }
  })
})

function handleSelect(name: string) {
  appStore.setThemeName(name)
  drawerOpen.value = false
}
</script>

<template>
  <Button variant="ghost" size="icon" @click="drawerOpen = true">
    <Icon icon="lucide:palette" class="size-5" />
  </Button>

  <Drawer :open="drawerOpen" @update:open="drawerOpen = $event" :direction="drawerDirection">
    <DrawerContent class="w-[320px] max-w-[320px]">
      <DrawerHeader>
        <DrawerTitle class="flex items-center justify-between">
          <span>主题风格</span>
          <DrawerClose as-child>
            <Button variant="ghost" size="icon">
              <Icon icon="lucide:x" class="size-4" />
            </Button>
          </DrawerClose>
        </DrawerTitle>
      </DrawerHeader>

      <TooltipProvider>
        <div ref="scrollContainerRef" class="px-4 pb-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="theme in themePreviewData"
              :key="theme.name"
              class="group relative rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-sm"
              :class="[
                appStore.currentTheme === theme.name
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border',
              ]"
              @click="handleSelect(theme.name)"
            >
              <div
                class="mb-2 h-8 w-full rounded-md overflow-hidden"
                :style="{ background: theme.colors.background }"
              >
                <div
                  class="h-full flex"
                  :style="{
                    background: `linear-gradient(135deg,
                    ${theme.colors.primary} 0%,
                    ${theme.colors.primary} 30%,
                    ${theme.colors.accent} 30%,
                    ${theme.colors.accent} 60%,
                    ${theme.colors.background} 60%
                  )`,
                  }"
                />
              </div>

              <div class="font-medium text-sm">{{ theme.title }}</div>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div class="text-xs text-muted-foreground line-clamp-1 cursor-default">
                    {{ theme.description }}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" class="max-w-50">
                  {{ theme.description }}
                </TooltipContent>
              </Tooltip>

              <div v-if="appStore.currentTheme === theme.name" class="absolute right-2 top-2">
                <Icon icon="lucide:check" class="size-4 text-primary" />
              </div>
            </button>
          </div>
        </div>
      </TooltipProvider>
    </DrawerContent>
  </Drawer>
</template>