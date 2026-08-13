<script setup lang="ts">
import { ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useNavActive, useMenus } from '@/components/app/useNav'

const MENU_ITEM_CLASS =
  'flex flex-row items-center gap-2 px-3 py-1.5 rounded-md text-sm text-sidebar-foreground transition-colors cursor-pointer whitespace-nowrap hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring'
const ACTIVE_CLASS = 'bg-sidebar-accent text-sidebar-accent-foreground font-medium hover:bg-sidebar-accent'
const GROUP_ACTIVE_CLASS = 'bg-sidebar-accent/50'

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
    <RouterLink
      v-for="item in items"
      :key="item.title"
      :to="item.to"
      :aria-current="isActive(item.to) ? 'page' : undefined"
      :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']"
    >
      <Icon v-if="item.icon" :icon="item.icon" class="size-3.5" />
      <span>{{ item.title }}</span>
    </RouterLink>

    <div v-for="group in groups" :key="group.title" class="pt-1">
      <button
        type="button"
        class="w-full text-left justify-between"
        :class="[MENU_ITEM_CLASS, isGroupActive(group) ? GROUP_ACTIVE_CLASS : '']"
        :aria-expanded="expandedGroups.has(group.title)"
        @click="toggleGroup(group.title)"
      >
        <span class="flex items-center gap-2">
          <Icon v-if="group.icon" :icon="group.icon" class="size-3.5" />
          <span>{{ group.title }}</span>
        </span>
        <Icon
          :icon="expandedGroups.has(group.title) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          class="size-3 transition-transform duration-200"
          :class="expandedGroups.has(group.title) ? 'rotate-0' : '-rotate-90'"
        />
      </button>

      <div
        class="ml-3 mt-0.5 grid transition-[grid-template-rows] duration-200 ease-out"
        :class="expandedGroups.has(group.title) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="min-h-0 space-y-0.5 overflow-hidden">
          <RouterLink
            v-for="item in group.items"
            :key="item.title"
            :to="item.to"
            :aria-current="isActive(item.to) ? 'page' : undefined"
            :class="[MENU_ITEM_CLASS, isActive(item.to) ? ACTIVE_CLASS : '']"
          >
            <Icon v-if="item.icon" :icon="item.icon" class="size-3.5" />
            <span>{{ item.title }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>
