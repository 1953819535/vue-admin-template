<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore, type LayoutType } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'

const appStore = useAppStore()

const layoutOptions: { value: LayoutType; label: string; icon: string }[] = [
  { value: 'sidebar', label: '侧边栏布局', icon: 'lucide:panel-left' },
  { value: 'top-nav', label: '顶部导航', icon: 'lucide:layout-template' },
]
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon icon="lucide:layout" class="size-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>布局方式</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        v-for="option in layoutOptions"
        :key="option.value"
        :class="appStore.layout === option.value ? 'bg-accent' : ''"
        @click="appStore.setLayout(option.value)"
      >
        <Icon :icon="option.icon" class="size-4" />
        <span>{{ option.label }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>