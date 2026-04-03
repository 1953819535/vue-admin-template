<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import ThemeSwitcher from '@/components/app/actions/ThemeSwitcher.vue'
import LayoutSwitcher from '@/components/app/actions/LayoutSwitcher.vue'
import ModeSwitcher from '@/components/app/actions/ModeSwitcher.vue'
import LogoutButton from '@/components/app/actions/LogoutButton.vue'

defineProps<{
  collapsed?: boolean
}>()

const appStore = useAppStore()
</script>

<template>
  <!-- 展开状态：直接显示所有按钮 -->
  <div v-if="!collapsed" class="flex items-center gap-4">
    <ThemeSwitcher />
    <LayoutSwitcher />
    <ModeSwitcher />
    <LogoutButton />
  </div>

  <!-- 折叠状态：使用下拉菜单 -->
  <div v-else class="flex flex-col items-center gap-2">
    <ThemeSwitcher />
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon">
          <Icon icon="lucide:settings-2" class="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" class="w-48">
        <!-- 布局切换 -->
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Icon icon="lucide:layout" class="size-4 mr-2" />
            布局方式
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              :class="appStore.layout === 'sidebar' ? 'bg-accent' : ''"
              @click="appStore.setLayout('sidebar')"
            >
              <Icon icon="lucide:panel-left" class="size-4 mr-2" />
              侧边栏布局
            </DropdownMenuItem>
            <DropdownMenuItem
              :class="appStore.layout === 'top-nav' ? 'bg-accent' : ''"
              @click="appStore.setLayout('top-nav')"
            >
              <Icon icon="lucide:layout-template" class="size-4 mr-2" />
              顶部导航
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <!-- 明暗模式 -->
        <DropdownMenuItem @click="appStore.setMode('light')">
          <Icon icon="lucide:sun" class="size-4 mr-2" />
          <span>亮色</span>
          <Icon v-if="appStore.mode === 'light'" icon="lucide:check" class="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="appStore.setMode('dark')">
          <Icon icon="lucide:moon-star" class="size-4 mr-2" />
          <span>暗色</span>
          <Icon v-if="appStore.mode === 'dark'" icon="lucide:check" class="size-4 ml-auto" />
        </DropdownMenuItem>
        <DropdownMenuItem @click="appStore.setMode('system')">
          <Icon icon="lucide:monitor" class="size-4 mr-2" />
          <span>跟随系统</span>
          <Icon v-if="appStore.mode === 'system'" icon="lucide:check" class="size-4 ml-auto" />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <!-- 退出登录 -->
        <DropdownMenuItem as-child>
          <RouterLink to="/login" class="flex items-center w-full">
            <Icon icon="lucide:log-out" class="size-4 mr-2" />
            退出登录
          </RouterLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>