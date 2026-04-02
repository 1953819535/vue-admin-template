<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { AcceptableValue } from 'reka-ui'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import themeNamesZh from '@/themes/theme-names-zh.json'

const appStore = useAppStore()

// 处理主题切换
function handleThemeChange(value: AcceptableValue) {
  if (typeof value === 'string') {
    appStore.setThemeName(value)
  }
}

// 中文映射类型
type ThemeNamesZh = Record<string, { title: string; description: string }>

// 获取中文标题
function getTitle(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.title || name
}

// 获取中文描述
function getDescription(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.description || ''
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon icon="lucide:palette" class="size-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56 max-h-75 overflow-y-auto">
      <DropdownMenuLabel>主题风格</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
      :model-value="appStore.currentTheme"
      @update:model-value="handleThemeChange"
    >
        <DropdownMenuRadioItem
          v-for="theme in appStore.availableThemes"
          :key="theme.name"
          :value="theme.name"
        >
          <div class="flex flex-col gap-0.5">
            <span class="font-medium">{{ getTitle(theme.name) }}</span>
            <span class="text-xs text-muted-foreground">{{ getDescription(theme.name) }}</span>
          </div>
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>