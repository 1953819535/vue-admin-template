<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <h1 class="text-xl font-semibold">
    {{ title || '后台管理' }}
  </h1>
</template>