<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <Button variant="link" size="sm" as-child>
    <RouterLink to="/login">退出登录</RouterLink>
  </Button>
</template>