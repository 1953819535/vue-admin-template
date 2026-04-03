<script setup lang="ts">
import { ref } from 'vue'
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

type ThemeNamesZh = Record<string, { title: string; description: string }>

function getTitle(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.title || name
}

function getDescription(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.description || ''
}

function getThemePreviewColors(name: string) {
  const theme = themes.find((t) => t.name === name)
  if (!theme) return { primary: '', accent: '', background: '' }

  const light = theme.cssVars.light || {}
  const dark = theme.cssVars.dark || {}
  const vars = appStore.isDark ? dark : light

  return {
    primary: vars.primary || '',
    accent: vars.accent || vars.secondary || '',
    background: vars.background || '',
  }
}

function handleSelect(name: string) {
  appStore.setThemeName(name)
  drawerOpen.value = false
}
</script>

<template>
  <Button variant="ghost" size="icon" @click="drawerOpen = true">
    <Icon icon="lucide:palette" class="size-5" />
  </Button>

  <Drawer :open="drawerOpen" @update:open="drawerOpen = $event" direction="right">
    <DrawerContent class="w-[400px] sm:max-w-[400px]">
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
        <div class="px-4 pb-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="theme in appStore.availableThemes"
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
                :style="{ background: getThemePreviewColors(theme.name).background }"
              >
                <div
                  class="h-full flex"
                  :style="{
                    background: `linear-gradient(135deg,
                    ${getThemePreviewColors(theme.name).primary} 0%,
                    ${getThemePreviewColors(theme.name).primary} 30%,
                    ${getThemePreviewColors(theme.name).accent} 30%,
                    ${getThemePreviewColors(theme.name).accent} 60%,
                    ${getThemePreviewColors(theme.name).background} 60%
                  )`,
                  }"
                />
              </div>

              <div class="font-medium text-sm">{{ getTitle(theme.name) }}</div>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div class="text-xs text-muted-foreground line-clamp-1 cursor-default">
                    {{ getDescription(theme.name) }}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" class="max-w-50">
                  {{ getDescription(theme.name) }}
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