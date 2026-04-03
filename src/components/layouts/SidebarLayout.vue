<template>
  <div class="flex min-h-screen">
    <!-- 侧边栏插槽 -->
    <aside class="w-64 border-r bg-sidebar flex flex-col">
      <slot name="sidebar" />
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col">
      <!-- 顶部插槽 -->
      <slot name="header" />

      <!-- 内容插槽 -->
      <div class="flex-1 overflow-auto p-6">
        <slot name="content" />
      </div>

      <!-- 底部插槽 -->
      <slot name="footer" />
    </main>
  </div>
</template>