<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore, type LayoutType } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import ThemeSwitcher from '@/components/app/ThemeSwitcher.vue'

const appStore = useAppStore()

// 布局选项
const layoutOptions: { value: LayoutType; label: string; icon: string }[] = [
  { value: 'sidebar', label: '侧边栏布局', icon: 'lucide:panel-left' },
  { value: 'top-nav', label: '顶部导航', icon: 'lucide:layout-template' },
]

// Props
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="px-6 py-4 flex items-center justify-between">
    <h1 class="text-xl font-semibold">{{ title || '后台管理' }}</h1>
    <div class="flex items-center gap-4">
      <!-- 主题风格切换 -->
      <ThemeSwitcher />

      <!-- 布局切换 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon icon="lucide:layout" class="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>布局方式</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            v-for="option in layoutOptions"
            :key="option.value"
            :class="appStore.layout === option.value ? 'bg-accent' : ''"
            @click="appStore.setLayout(option.value)"
          >
            <Icon :icon="option.icon" class="size-4" />
            <span>{{ option.label }}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- 明暗模式切换 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="icon">
            <Icon v-if="appStore.mode === 'system'" icon="lucide:monitor" class="size-5" />
            <Icon v-else-if="appStore.mode === 'dark'" icon="lucide:moon-star" class="size-5" />
            <Icon v-else icon="lucide:sun" class="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="appStore.setMode('light')">
            <Icon icon="lucide:sun" class="size-4" />
            <span>亮色</span>
          </DropdownMenuItem>
          <DropdownMenuItem @click="appStore.setMode('dark')">
            <Icon icon="lucide:moon-star" class="size-4" />
            <span>暗色</span>
          </DropdownMenuItem>
          <DropdownMenuItem @click="appStore.setMode('system')">
            <Icon icon="lucide:monitor" class="size-4" />
            <span>跟随系统</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- 退出登录 -->
      <Button variant="link" size="sm" as-child>
        <RouterLink to="/login">退出登录</RouterLink>
      </Button>
    </div>
  </div>
  <Separator />
</template>