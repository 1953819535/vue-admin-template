<script setup lang="ts">
import { computed } from "vue";
import { useAppStore, type LayoutType } from "@/stores/modules/app";
import SidebarLayout from "./SidebarLayout.vue";
import TopNavLayout from "./TopNavLayout.vue";

const appStore = useAppStore();

const layoutComponents: Record<LayoutType, any> = {
  sidebar: SidebarLayout,
  "top-nav": TopNavLayout,
};

const currentLayout = computed(() => layoutComponents[appStore.layout]);
</script>

<template>
  <component :is="currentLayout">
    <template #sidebar>
      <slot name="sidebar" />
    </template>
    <template #nav>
      <slot name="nav" />
    </template>
    <template #content>
      <slot name="content" />
    </template>
  </component>
</template>
