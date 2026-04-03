<script setup lang="ts">
import ThemeSwitcher from '@/components/app/actions/ThemeSwitcher.vue'
import LayoutSwitcher from '@/components/app/actions/LayoutSwitcher.vue'
import ModeSwitcher from '@/components/app/actions/ModeSwitcher.vue'
import LogoutButton from '@/components/app/actions/LogoutButton.vue'
</script>

<template>
  <div class="flex items-center gap-4">
    <ThemeSwitcher />
    <LayoutSwitcher />
    <ModeSwitcher />
    <LogoutButton />
  </div>
</template>