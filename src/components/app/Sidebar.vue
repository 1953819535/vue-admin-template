<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  title: string
  to: RouteLocationRaw
  icon?: string
  indent?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface Props {
  title?: string
  groups?: NavGroup[]
  items?: NavItem[]
}

withDefaults(defineProps<Props>(), {
  title: '管理系统',
})

const route = useRoute()

function isActive(to: RouteLocationRaw) {
  const path = typeof to === 'string' ? to : (to as any).path
  return route.path === path
}
</script>

<template>
  <aside class="w-64 border-r bg-sidebar p-4">
    <!-- 标题 -->
    <div class="mb-8 font-semibold text-lg text-sidebar-foreground">
      {{ title }}
    </div>

    <nav class="space-y-1">
      <!-- 顶级导航项 -->
      <slot name="items">
        <RouterLink
          v-for="item in items"
          :key="item.title"
          :to="item.to"
          :class="[
            'block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground',
            item.indent ? 'pl-6' : '',
            isActive(item.to) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
          ]"
        >
          <Icon v-if="item.icon" :icon="item.icon" class="size-4 mr-2 inline" />
          {{ item.title }}
        </RouterLink>
      </slot>

      <!-- 分组导航 -->
      <template v-for="group in groups" :key="group.title">
        <div class="pt-2">
          <div class="px-3 py-1 text-xs text-muted-foreground font-medium">
            {{ group.title }}
          </div>
          <RouterLink
            v-for="item in group.items"
            :key="item.title"
            :to="item.to"
            :class="[
              'block px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground',
              item.indent ? 'pl-6' : '',
              isActive(item.to) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
            ]"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="size-4 mr-2 inline" />
            {{ item.title }}
          </RouterLink>
        </div>
      </template>

      <!-- 底部插槽 -->
      <Separator class="my-4" />
      <slot name="footer" />
    </nav>
  </aside>
</template>