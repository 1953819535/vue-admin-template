<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  groups?: NavGroup[]
  items?: NavItem[]
}

defineProps<Props>()

const route = useRoute()

function isActive(to: RouteLocationRaw) {
  const path = typeof to === 'string' ? to : (to as any).path
  return route.path === path
}

function isGroupActive(group: NavGroup) {
  return group.items.some(item => isActive(item.to))
}
</script>

<template>
  <div class="px-6 py-2 flex items-center gap-1">
    <!-- 顶级导航项 -->
    <RouterLink
      v-for="item in items"
      :key="item.title"
      :to="item.to"
      :class="[
        'px-3 py-1.5 rounded-md text-sm transition-colors',
        isActive(item.to)
          ? 'bg-primary text-primary-foreground font-medium'
          : 'hover:bg-accent hover:text-accent-foreground'
      ]"
    >
      <Icon v-if="item.icon" :icon="item.icon" class="size-4 mr-1 inline" />
      {{ item.title }}
    </RouterLink>

    <!-- 分组导航（下拉菜单） -->
    <DropdownMenu v-for="group in groups" :key="group.title">
      <DropdownMenuTrigger
        :class="[
          'px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-1',
          isGroupActive(group)
            ? 'bg-primary text-primary-foreground font-medium'
            : 'hover:bg-accent hover:text-accent-foreground'
        ]"
      >
        {{ group.title }}
        <Icon icon="lucide:chevron-down" class="size-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          v-for="item in group.items"
          :key="item.title"
          :class="[
            isActive(item.to) ? 'bg-accent font-medium' : ''
          ]"
          as-child
        >
          <RouterLink :to="item.to" class="flex items-center w-full">
            <Icon v-if="item.icon" :icon="item.icon" class="size-4 mr-2" />
            <span :class="item.indent ? 'pl-4' : ''">{{ item.title }}</span>
          </RouterLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>