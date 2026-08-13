<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  title?: string
  variant?: 'default' | 'sidebar'
}>()
</script>

<template>
  <RouterLink
    to="/"
    :class="[
      'flex items-center gap-2.5 text-lg font-semibold transition-colors',
      variant === 'sidebar' ? 'text-sidebar-foreground hover:text-sidebar-foreground/80' : 'text-foreground hover:text-foreground/80',
    ]"
  >
    <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
      <Icon icon="lucide:box" class="size-4" />
    </span>
    {{ title || '后台管理' }}
  </RouterLink>
</template>
