<script setup lang="ts">
import Logo from '@/components/app/Logo.vue'
import Actions from '@/components/app/Actions.vue'
import HorizontalMenu from '@/components/app/HorizontalMenu.vue'
</script>

<template>
  <div class="flex flex-col h-screen bg-background">
    <header class="shrink-0 flex items-center gap-6 px-6 py-3 border-b border-border bg-card">
      <Logo />
      <nav class="flex-1">
        <HorizontalMenu />
      </nav>
      <Actions />
    </header>
    <main class="flex-1 overflow-auto bg-muted/30 p-6">
      <slot />
    </main>
  </div>
</template>