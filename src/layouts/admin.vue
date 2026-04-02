<template>
  <div class="flex min-h-screen">
    <aside class="w-64 border-r bg-muted/30 p-4">
      <div class="mb-8 font-semibold text-lg">管理系统</div>
      <nav class="space-y-1">
        <!-- 仪表盘 -->
        <RouterLink
          to="/dashboard"
          class="block px-3 py-2 rounded-md hover:bg-muted"
          active-class="bg-primary/10 text-primary"
        >
          仪表盘
        </RouterLink>

        <!-- 用户管理 -->
        <div class="pt-2">
          <div class="px-3 py-1 text-xs text-muted-foreground font-medium">
            用户管理
          </div>
          <RouterLink
            to="/users"
            class="block px-3 py-2 rounded-md hover:bg-muted"
            active-class="bg-primary/10 text-primary"
          >
            用户列表
          </RouterLink>
          <RouterLink
            to="/users/create"
            class="block px-3 py-2 rounded-md hover:bg-muted pl-6"
            active-class="bg-primary/10 text-primary"
          >
            新增用户
          </RouterLink>
        </div>

        <!-- 系统设置 -->
        <div class="pt-2">
          <div class="px-3 py-1 text-xs text-muted-foreground font-medium">
            系统设置
          </div>
          <RouterLink
            to="/system"
            class="block px-3 py-2 rounded-md hover:bg-muted"
            active-class="bg-primary/10 text-primary"
          >
            基本信息
          </RouterLink>
          <RouterLink
            to="/system/settings"
            class="block px-3 py-2 rounded-md hover:bg-muted pl-6"
            active-class="bg-primary/10 text-primary"
          >
            参数配置
          </RouterLink>
          <RouterLink
            to="/system/logs"
            class="block px-3 py-2 rounded-md hover:bg-muted pl-6"
            active-class="bg-primary/10 text-primary"
          >
            操作日志
          </RouterLink>
        </div>

        <!-- 其他 -->
        <div class="pt-4 border-t mt-4">
          <RouterLink
            to="/403"
            class="block px-3 py-2 rounded-md hover:bg-muted text-sm text-muted-foreground"
          >
            403 页面
          </RouterLink>
          <RouterLink
            to="/404"
            class="block px-3 py-2 rounded-md hover:bg-muted text-sm text-muted-foreground"
          >
            404 页面
          </RouterLink>
        </div>
      </nav>
    </aside>
    <main class="flex-1">
      <header class="border-b px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-xl font-semibold">后台管理</h1>
          <div class="flex items-center gap-4">
            <RouterLink
              to="/login"
              class="text-sm text-muted-foreground hover:text-foreground"
            >
              退出登录
            </RouterLink>
          </div>
        </div>
      </header>
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>
