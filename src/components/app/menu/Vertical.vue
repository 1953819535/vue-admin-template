<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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

const MENU_ITEM_CLASS = 'flex flex-row items-center gap-2 px-3 py-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer whitespace-nowrap'
const MENU_ITEM_COLLAPSED_CLASS = 'flex justify-center p-2 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer'
const ACTIVE_CLASS = 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
const GROUP_ACTIVE_CLASS = 'bg-sidebar-accent/50 text-sidebar-accent-foreground'

const props = defineProps<NavProps>()

const appStore = useAppStore()
const { isActive, isGroupActive } = useNavActive()

const expandedGroups = ref<Set<string>>(new Set())

// 仅在初始化时展开包含当前激活项的分组
watch(
  () => props.groups,
  (groups) => {
    if (!groups) return
    groups.forEach(group => {
      if (isGroupActive(group)) {
        expandedGroups.value.add(group.title)
      }
    })
  },
  { immediate: true, flush: 'sync' }
)

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

</script>

<template>
  <nav class="flex-1 p-4 space-y-1 overflow-auto">
    <template v-if="!appStore.sidebarCollapsed">
      <RouterLink
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']"
      >
        <Icon v-if="item.icon" :icon="item.icon" class="size-4" />
        <span>{{ item.title }}</span>
      </RouterLink>

      <div v-for="group in groups" :key="group.title" class="pt-1">
        <div
          :class="[MENU_ITEM_CLASS, 'justify-between', isGroupActive(group) ? GROUP_ACTIVE_CLASS : '']"
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
            :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']"
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
              :class="[MENU_ITEM_COLLAPSED_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']"
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
              :class="[MENU_ITEM_COLLAPSED_CLASS, isGroupActive(group) ? ACTIVE_CLASS : '']"
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