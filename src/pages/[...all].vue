<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  router.replace('/404')
})
</script>

<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div />
</template>