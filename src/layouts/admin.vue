<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ThemeSwitcher from '@/components/app/ThemeSwitcher.vue'
import Sidebar from '@/components/app/Sidebar.vue'

const appStore = useAppStore()

// 导航配置
const navGroups = [
  {
    title: '用户管理',
    items: [
      { title: '用户列表', to: '/users' },
      { title: '新增用户', to: '/users/create', indent: true },
    ]
  },
  {
    title: '组件示例',
    items: [
      { title: 'DataTable', to: '/components/data-table' },
    ]
  },
  {
    title: '系统设置',
    items: [
      { title: '基本信息', to: '/system' },
      { title: '参数配置', to: '/system/settings', indent: true },
      { title: '操作日志', to: '/system/logs', indent: true },
    ]
  },
]

const navItems = [
  { title: '仪表盘', to: '/dashboard' },
]

const footerItems = [
  { title: '403 页面', to: '/403' },
  { title: '404 页面', to: '/404' },
]
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏 -->
    <Sidebar title="管理系统" :items="navItems" :groups="navGroups">
      <template #footer>
        <RouterLink
          v-for="item in footerItems"
          :key="item.title"
          :to="item.to"
          class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm text-muted-foreground"
        >
          {{ item.title }}
        </RouterLink>
      </template>
    </Sidebar>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col">
      <header class="px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold">后台管理</h1>
        <div class="flex items-center gap-4">
          <!-- 主题风格切换 -->
          <ThemeSwitcher />

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
      </header>
      <Separator />

      <div class="flex-1 p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>