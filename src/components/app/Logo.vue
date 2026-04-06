<script setup lang="ts">
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
      variant === 'sidebar'
        ? 'text-sidebar-foreground hover:text-sidebar-foreground/80'
        : 'text-foreground hover:text-foreground/80'
    ]"
  >
    <img src="/favicon.svg" alt="Logo" class="w-7 h-7" />
    {{ title || '后台管理' }}
  </RouterLink>
</template>