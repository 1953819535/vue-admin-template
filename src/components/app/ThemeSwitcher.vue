<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import Button from '@/components/ui/button/Button.vue'
import ThemeDrawer from './ThemeDrawer.vue'

const drawerOpen = ref(false)
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="drawerOpen = true"
  >
    <Icon icon="lucide:palette" class="size-5" />
  </Button>

  <ThemeDrawer
    :open="drawerOpen"
    @update:open="drawerOpen = $event"
  />
</template>