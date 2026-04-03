<script setup lang="ts">
import Sidebar from '@/components/app/Sidebar.vue'
import TopNavMenu from '@/components/app/TopNavMenu.vue'
import LayoutProvider from '@/components/layouts/LayoutProvider.vue'
import AppHeader from '@/components/app/AppHeader.vue'

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
  <LayoutProvider>
    <!-- 侧边栏插槽 -->
    <template #sidebar>
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
    </template>

    <!-- 横向菜单插槽（用于 top-nav 布局） -->
    <template #nav>
      <TopNavMenu :items="navItems" :groups="navGroups" />
    </template>

    <!-- 顶部插槽 -->
    <template #header>
      <AppHeader title="后台管理" />
    </template>

    <!-- 内容插槽 -->
    <template #content>
      <RouterView />
    </template>
  </LayoutProvider>
</template>