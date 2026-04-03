<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { NavProps } from './types'
import { useNavActive } from './useNav'

const props = defineProps<NavProps>()

const appStore = useAppStore()
const { isActive, isGroupActive } = useNavActive()

const expandedGroups = ref<Set<string>>(new Set())

watchEffect(() => {
  props.groups?.forEach(group => {
    if (isGroupActive(group)) {
      expandedGroups.value.add(group.title)
    }
  })
})

const isGroupExpanded = (groupTitle: string) => expandedGroups.value.has(groupTitle)

function toggleGroup(groupTitle: string) {
  if (expandedGroups.value.has(groupTitle)) {
    expandedGroups.value.delete(groupTitle)
  } else {
    expandedGroups.value.add(groupTitle)
  }
}

const groupIcons = computed(() => {
  const map = new Map<string, string>()
  props.groups?.forEach(group => {
    map.set(group.title, group.icon || group.items[0]?.icon || 'lucide:folder')
  })
  return map
})

const menuItemClass = 'flex items-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer'
</script>

<template>
  <nav class="flex-1 p-4 space-y-1 overflow-auto">
    <template v-if="!appStore.sidebarCollapsed">
      <RouterLink
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :class="[
          menuItemClass,
          isActive(item.to) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
        ]"
      >
        <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
        <span>{{ item.title }}</span>
      </RouterLink>

      <div v-for="group in groups" :key="group.title" class="pt-1">
        <div
          :class="[
            menuItemClass,
            'justify-between',
            isGroupActive(group) ? 'bg-sidebar-accent/50 text-sidebar-accent-foreground' : ''
          ]"
          @click="toggleGroup(group.title)"
        >
          <div class="flex items-center gap-2">
            <Icon v-if="group.icon" :icon="group.icon" class="size-4" />
            <span>{{ group.title }}</span>
          </div>
          <Icon
            :icon="isGroupExpanded(group.title) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
            class="size-4 transition-transform"
          />
        </div>

        <div
          v-show="isGroupExpanded(group.title)"
          class="ml-4 mt-1 space-y-1 overflow-hidden"
        >
          <RouterLink
            v-for="item in group.items"
            :key="item.title"
            :to="item.to"
            :class="[
              menuItemClass,
              isActive(item.to) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
            ]"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
            <span>{{ item.title }}</span>
          </RouterLink>
        </div>
      </div>
    </template>

    <template v-else>
      <TooltipProvider :delay-duration="200">
        <Tooltip v-for="item in items" :key="item.title">
          <TooltipTrigger as-child>
            <RouterLink
              :to="item.to"
              :class="[
                'flex justify-center p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors',
                isActive(item.to) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              ]"
            >
              <Icon v-if="item.icon" :icon="item.icon" class="size-5" />
            </RouterLink>
          </TooltipTrigger>
          <TooltipContent side="right">
            {{ item.title }}
          </TooltipContent>
        </Tooltip>

        <DropdownMenu v-for="group in groups" :key="group.title">
          <DropdownMenuTrigger as-child>
            <div
              :class="[
                'flex justify-center p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer',
                isGroupActive(group) ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
              ]"
            >
              <Icon :icon="groupIcons.get(group.title)!" class="size-5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" class="w-48">
            <div class="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              {{ group.title }}
            </div>
            <DropdownMenuItem
              v-for="item in group.items"
              :key="item.title"
              :class="[isActive(item.to) ? 'bg-accent font-medium' : '']"
              as-child
            >
              <RouterLink :to="item.to" class="flex items-center gap-2 w-full">
                <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
                {{ item.title }}
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    </template>
  </nav>
</template>