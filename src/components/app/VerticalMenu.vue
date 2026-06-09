<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useNavActive, useMenus } from '@/components/app/useNav'

const MENU_ITEM_CLASS =
  'flex flex-row items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent text-card-foreground transition-colors cursor-pointer whitespace-nowrap text-sm'
const ACTIVE_CLASS = 'bg-accent/80 text-accent-foreground font-medium'
const GROUP_ACTIVE_CLASS = 'bg-accent/40'

const { items, groups } = useMenus()
const { isActive, isGroupActive } = useNavActive()

const expandedGroups = ref<Set<string>>(new Set())

// 自动展开包含激活项的分组
watch(
  groups,
  (groups) => {
    for (const group of groups) {
      if (isGroupActive(group)) {
        expandedGroups.value.add(group.title)
      }
    }
  },
  { immediate: true },
)

const toggleGroup = (groupTitle: string) => {
  expandedGroups.value.has(groupTitle) ? expandedGroups.value.delete(groupTitle) : expandedGroups.value.add(groupTitle)
}
</script>

<template>
  <nav class="flex-1 p-2 space-y-0.5 overflow-auto">
    <RouterLink v-for="item in items" :key="item.title" :to="item.to" :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']">
      <Icon v-if="item.icon" :icon="item.icon" class="size-3.5" />
      <span>{{ item.title }}</span>
    </RouterLink>

    <div v-for="group in groups" :key="group.title" class="pt-1">
      <div :class="[MENU_ITEM_CLASS, 'justify-between', isGroupActive(group) ? GROUP_ACTIVE_CLASS : '']" @click="toggleGroup(group.title)">
        <div class="flex items-center gap-2">
          <Icon v-if="group.icon" :icon="group.icon" class="size-3.5" />
          <span>{{ group.title }}</span>
        </div>
        <Icon :icon="expandedGroups.has(group.title) ? 'lucide:chevron-down' : 'lucide:chevron-right'" class="size-3 transition-transform" />
      </div>

      <div v-show="expandedGroups.has(group.title)" class="ml-3 mt-0.5 space-y-0.5 overflow-hidden">
        <RouterLink v-for="item in group.items" :key="item.title" :to="item.to" :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']">
          <Icon v-if="item.icon" :icon="item.icon" class="size-3.5" />
          <span>{{ item.title }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
