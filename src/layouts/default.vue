<script setup lang="ts">
import routes from '~pages'
import Vertical from '@/components/app/menu/Vertical.vue'
import Horizontal from '@/components/app/menu/Horizontal.vue'
import LayoutProvider from '@/components/layouts/LayoutProvider.vue'
import { generateMenus } from '@/utils/menu'

const menuConfig = generateMenus(routes)
</script>

<template>
  <LayoutProvider>
    <template #sidebar>
      <Vertical :items="menuConfig.items" :groups="menuConfig.groups" />
    </template>

    <template #nav>
      <Horizontal :items="menuConfig.items" :groups="menuConfig.groups" />
    </template>

    <template #content>
      <RouterView />
    </template>
  </LayoutProvider>
</template>