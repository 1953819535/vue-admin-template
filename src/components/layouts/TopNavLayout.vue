<script setup lang="ts">
import Logo from "@/components/app/header/Logo.vue";
import Actions from "@/components/app/header/Actions.vue";
</script>

<template>
  <div class="flex flex-col w-screen h-screen overflow-hidden">
    <!-- 顶部区域：logo + menu + action 同一行 -->
    <header class="border-b bg-background shrink-0">
      <div class="px-6 py-4 flex items-center justify-between gap-6">
        <Logo />
        <nav class="flex-1">
          <slot name="nav" />
        </nav>
        <Actions />
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto p-6">
      <slot name="content" />
    </main>
  </div>
</template>