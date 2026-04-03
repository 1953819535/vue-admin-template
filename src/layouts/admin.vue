<script setup lang="ts">
import routes from '~pages'
import Vertical from '@/components/app/menu/Vertical.vue'
import Horizontal from '@/components/app/menu/Horizontal.vue'
import LayoutProvider from '@/components/layouts/LayoutProvider.vue'
import { generateMenus } from '@/utils/menu'

const { items, groups } = generateMenus(routes)
</script>

<template>
  <LayoutProvider>
    <!-- 侧边栏菜单插槽 -->
    <template #sidebar>
      <Vertical :items="items" :groups="groups" />
    </template>

    <!-- 横向菜单插槽 -->
    <template #nav>
      <Horizontal :items="items" :groups="groups" />
    </template>

    <!-- 内容插槽 -->
    <template #content>
      <RouterView />
    </template>
  </LayoutProvider>
</template>