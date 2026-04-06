<script setup lang="ts">
import ThemeSwitcher from '@/components/app/ThemeSwitcher.vue'
import LayoutSwitcher from '@/components/app/LayoutSwitcher.vue'
import ModeSwitcher from '@/components/app/ModeSwitcher.vue'
import UserMenu from '@/components/app/UserMenu.vue'
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-1">
      <ThemeSwitcher />
      <LayoutSwitcher />
      <ModeSwitcher />
    </div>
    <UserMenu />
  </div>
</template>