<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useAppStore } from '@/stores/modules/app'
import Button from '@/components/ui/button/Button.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const appStore = useAppStore()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon v-if="appStore.mode === 'system'" icon="lucide:monitor" class="size-5" />
        <Icon v-else-if="appStore.mode === 'dark'" icon="lucide:moon-star" class="size-5" />
        <Icon v-else icon="lucide:sun" class="size-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="appStore.setMode('light')">
        <Icon icon="lucide:sun" class="size-4" />
        <span>亮色</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="appStore.setMode('dark')">
        <Icon icon="lucide:moon-star" class="size-4" />
        <span>暗色</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="appStore.setMode('system')">
        <Icon icon="lucide:monitor" class="size-4" />
        <span>跟随系统</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>