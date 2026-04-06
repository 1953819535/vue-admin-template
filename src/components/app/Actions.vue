<script setup lang="ts">
import NotificationPanel from "@/components/app/NotificationPanel.vue";
import SettingsPanel from "@/components/app/SettingsPanel.vue";
import UserMenu from "@/components/app/UserMenu.vue";
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-1">
      <NotificationPanel />
      <SettingsPanel />
    </div>
    <div class="flex items-center gap-1">
      <UserMenu />
    </div>
  </div>
</template>
