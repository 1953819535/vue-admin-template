<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const appStore = useAppStore()
</script>

<template>
  <div class="flex min-h-screen">
    <aside class="w-64 border-r border-sidebar-border bg-sidebar p-4">
      <div class="mb-8 font-semibold text-lg text-sidebar-foreground">管理系统</div>
      <nav class="space-y-1">
        <!-- 仪表盘 -->
        <RouterLink
          to="/dashboard"
          class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          active-class="bg-sidebar-primary/10 text-sidebar-primary"
        >
          仪表盘
        </RouterLink>

        <!-- 用户管理 -->
        <div class="pt-2">
          <div class="px-3 py-1 text-xs text-sidebar-foreground/60 font-medium">
            用户管理
          </div>
          <RouterLink
            to="/users"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            active-class="bg-sidebar-primary/10 text-sidebar-primary"
          >
            用户列表
          </RouterLink>
          <RouterLink
            to="/users/create"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent pl-6 text-sidebar-foreground"
            active-class="bg-sidebar-primary/10 text-sidebar-primary"
          >
            新增用户
          </RouterLink>
        </div>

        <!-- 系统设置 -->
        <div class="pt-2">
          <div class="px-3 py-1 text-xs text-sidebar-foreground/60 font-medium">
            系统设置
          </div>
          <RouterLink
            to="/system"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            active-class="bg-sidebar-primary/10 text-sidebar-primary"
          >
            基本信息
          </RouterLink>
          <RouterLink
            to="/system/settings"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent pl-6 text-sidebar-foreground"
            active-class="bg-sidebar-primary/10 text-sidebar-primary"
          >
            参数配置
          </RouterLink>
          <RouterLink
            to="/system/logs"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent pl-6 text-sidebar-foreground"
            active-class="bg-sidebar-primary/10 text-sidebar-primary"
          >
            操作日志
          </RouterLink>
        </div>

        <!-- 其他 -->
        <div class="pt-4 border-t border-sidebar-border mt-4">
          <RouterLink
            to="/403"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm text-sidebar-foreground/60"
          >
            403 页面
          </RouterLink>
          <RouterLink
            to="/404"
            class="block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sm text-sidebar-foreground/60"
          >
            404 页面
          </RouterLink>
        </div>
      </nav>
    </aside>
    <main class="flex-1">
      <header class="border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">后台管理</h1>
          <div class="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon">
                  <Icon v-if="appStore.theme === 'system'" icon="lucide:monitor" class="h-5 w-5" />
                  <Icon v-else-if="appStore.theme === 'dark'" icon="lucide:moon-star" class="h-5 w-5" />
                  <Icon v-else icon="lucide:sun" class="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="appStore.setTheme('light')">
                  <Icon icon="lucide:sun" class="h-4 w-4" />
                  <span>亮色</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="appStore.setTheme('dark')">
                  <Icon icon="lucide:moon-star" class="h-4 w-4" />
                  <span>暗色</span>
                </DropdownMenuItem>
                <DropdownMenuItem @click="appStore.setTheme('system')">
                  <Icon icon="lucide:monitor" class="h-4 w-4" />
                  <span>跟随系统</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <RouterLink
              to="/login"
              class="text-sm text-muted-foreground hover:text-foreground"
            >
              退出登录
            </RouterLink>
          </div>
        </div>
      </header>
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>
