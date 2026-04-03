<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NavProps } from './types'
import { useNavActive } from './useNav'

defineProps<NavProps>()

const { isActive, isGroupActive } = useNavActive()
</script>

<template>
  <div class="flex items-center gap-1">
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
          :class="[isActive(item.to) ? 'bg-accent font-medium' : '']"
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