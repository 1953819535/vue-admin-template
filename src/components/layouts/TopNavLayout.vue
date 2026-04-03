<template>
  <div class="flex flex-col min-h-screen">
    <!-- 顶部导航插槽 -->
    <header class="border-b bg-background">
      <slot name="header" />
    </header>

    <!-- 横向菜单插槽 -->
    <nav class="border-b bg-muted/30">
      <slot name="nav" />
    </nav>

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto p-6">
      <slot name="content" />
    </main>

    <!-- 底部插槽 -->
    <footer class="border-t bg-background">
      <slot name="footer" />
    </footer>
  </div>
</template>