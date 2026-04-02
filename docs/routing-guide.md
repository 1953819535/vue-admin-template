# Nuxt 风格路由方案

基于 `vite-plugin-pages` + `vite-plugin-vue-layouts` 实现的文件系统路由，类似 Nuxt 的约定式路由。

## 概述

| 特性 | 说明 |
|------|------|
| 文件路由 | `src/pages/` 目录自动生成路由 |
| 布局系统 | `src/layouts/` 目录自动注册布局 |
| 动态路由 | `[id].vue` 文件名语法 |
| 嵌套子路由 | 目录结构自动生成子路由 |
| 路由元信息 | `<route>` block 定义 meta |

## 安装

```bash
pnpm add -D vite-plugin-pages vite-plugin-vue-layouts
pnpm add vue-router
```

## 配置

### vite.config.ts

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  plugins: [
    vue(),
    Pages({
      dirs: 'src/pages',
      extensions: ['vue'],
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### src/router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes),
})

export default router
```

### src/main.ts

```ts
import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### src/App.vue

```vue
<template>
  <RouterView />
</template>
```

### 类型声明 src/vite-env.d.ts

```ts
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />
```

## 目录结构

```
src/
├── layouts/              # 布局组件
│   ├── default.vue       # 默认布局
│   ├── admin.vue         # 管理布局
│   └── blank.vue         # 空白布局
│
├── pages/                # 页面组件（自动生成路由）
│   ├── index.vue         # /
│   ├── login.vue         # /login
│   ├── dashboard.vue     # /dashboard
│   ├── 403.vue           # /403
│   ├── 404.vue           # /404
│   │
│   ├── users/            # 用户管理模块
│   │   ├── index.vue     # /users
│   │   ├── create.vue    # /users/create
│   │   └── [id]/         # 动态路由
│   │       ├── index.vue # /users/:id
│   │       └── edit.vue  # /users/:id/edit
│   │
│   └── system/           # 系统设置模块
│       ├── index.vue     # /system
│       ├── settings.vue  # /system/settings
│       └── logs.vue      # /system/logs
│
└── router/
    └── index.ts          # 路由入口
```

## 路由规则

### 文件名到路由映射

| 文件路径 | 生成的路由 |
|----------|-----------|
| `pages/index.vue` | `/` |
| `pages/login.vue` | `/login` |
| `pages/users/index.vue` | `/users` |
| `pages/users/create.vue` | `/users/create` |
| `pages/users/[id]/index.vue` | `/users/:id` |
| `pages/users/[id]/edit.vue` | `/users/:id/edit` |
| `pages/[...path].vue` | `/:path(.*)*` (捕获所有路由) |

### 忽略路由生成

使用 `_` 前缀的文件不会生成路由，适合放置组件、工具函数等：

| 文件路径 | 是否生成路由 |
|----------|-------------|
| `pages/_helper.vue` | ❌ 不生成 |
| `pages/users/_form.vue` | ❌ 不生成 |
| `pages/_components/button.vue` | ❌ 不生成 |
| `pages/dashboard.vue` | ✅ 生成 `/dashboard` |

**推荐用法**：将页面内部组件放在 `_components/` 目录：

```
pages/
├── dashboard.vue          # /dashboard
├── _components/           # 不生成路由
│   ├── stats-card.vue     # 页面内部组件
│   └── chart-panel.vue    # 页面内部组件
│
└── users/
    ├── index.vue          # /users
    ├── _form.vue          # 不生成路由（可被 index.vue 引用）
    └── [id]/
        ├── index.vue      # /users/:id
        └── _detail-panel.vue  # 不生成路由
```

### `<route>` block 不影响路由生成

路由生成只取决于文件是否存在，`<route>` block 仅用于添加额外配置：

```vue
<!-- 即使不定义 route block，路由依然生成 -->
<script setup lang="ts">
</script>

<template>
  <div>页面内容</div>
</template>

<!-- 生成的路由: { path: '/xxx', meta: {} } 使用 default 布局 -->
```

### 子路由规则

目录结构自动生成嵌套路由：

```
pages/
└── users/
    ├── index.vue      → 父路由 /users
    ├── create.vue     → 子路由 /users/create
    └── [id]/
        ├── index.vue  → 子路由 /users/:id
        └── edit.vue   → 子路由 /users/:id/edit
```

**注意**：父路由组件（如 `users/index.vue`）需要包含 `<RouterView />` 才能渲染子路由内容。

## 布局系统

### 布局组件写法

布局组件必须使用 `<RouterView />` 渲染页面内容：

```vue
<!-- src/layouts/admin.vue -->
<template>
  <div class="flex min-h-screen">
    <aside class="w-64 border-r">
      <!-- 侧边栏 -->
      <nav>
        <RouterLink to="/dashboard">仪表盘</RouterLink>
        <RouterLink to="/users">用户管理</RouterLink>
      </nav>
    </aside>
    <main class="flex-1">
      <header>顶部导航</header>
      <div class="p-6">
        <RouterView />  <!-- 页面内容渲染位置 -->
      </div>
    </main>
  </div>
</template>
```

### 指定页面布局

在页面中使用 `<route>` block 指定布局：

```vue
<!-- src/pages/dashboard.vue -->
<script setup lang="ts">
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 仪表盘
  requiresAuth: true
</route>

<template>
  <div>
    <h2>仪表盘</h2>
    <!-- 页面内容 -->
  </div>
</template>
```

### 布局选择规则

| meta.layout | 使用的布局 |
|-------------|-----------|
| `'admin'` | `layouts/admin.vue` |
| `'blank'` | `layouts/blank.vue` |
| 未指定 | `layouts/default.vue` |

## setupLayouts 原理

`setupLayouts` 将扁平路由转换为嵌套路由：

**输入（扁平路由）：**
```ts
[
  { path: '/dashboard', component: DashboardPage, meta: { layout: 'admin' } }
]
```

**输出（嵌套路由）：**
```ts
[
  {
    path: '/dashboard',
    component: AdminLayout,     // 布局作为父路由
    children: [
      { path: '', component: DashboardPage }  // 页面作为子路由
    ]
  }
]
```

**渲染流程：**
```
访问 /dashboard
  → 匹配 AdminLayout（渲染侧边栏）
    → AdminLayout 内 <RouterView />
      → 匹配 DashboardPage（渲染页面内容）
```

## 路由元信息

### 可用的 meta 字段

```yaml
<route lang="yaml">
meta:
  layout: admin           # 布局名称
  title: 用户管理         # 页面标题
  requiresAuth: true      # 是否需要登录
  roles: [admin, manager] # 允许的角色
</route>
```

### 重定向

```yaml
<route lang="yaml">
redirect: /dashboard
</route>
```

### 路由命名

```yaml
<route lang="yaml">
name: UserList
</route>
```

## 权限控制

### 方案一：路由守卫

```ts
// src/router/index.ts
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const roles = to.meta.roles as string[] | undefined
  
  const user = getUser() // 从 store/localStorage 获取
  
  if (requiresAuth && !user) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (roles && !roles.includes(user?.role)) {
    next('/403')
  } else {
    next()
  }
})
```

### 方案二：动态路由过滤

```ts
function filterRoutesByRole(routes: any[], role: string) {
  return routes.filter(route => {
    const allowedRoles = route.meta?.roles
    if (!allowedRoles) return true
    return allowedRoles.includes(role)
  })
}

const userRole = getUser()?.role || 'guest'
const filteredRoutes = filterRoutesByRole(generatedRoutes, userRole)

const router = createRouter({
  routes: setupLayouts(filteredRoutes),
})
```

## 编程式导航

```ts
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 跳转
router.push('/dashboard')
router.push({ name: 'UserList' })
router.push({ path: '/users', query: { page: 1 } })

// 带参数跳转
router.push(`/users/${userId}`)
router.push({ name: 'UserDetail', params: { id: userId } })

// 获取当前路由信息
const userId = route.params.id
const page = route.query.page
const layout = route.meta.layout
```

## 常见问题

### Q: 子路由不显示？

父路由组件需要包含 `<RouterView />`：

```vue
<!-- pages/users/index.vue -->
<template>
  <div>
    <h2>用户管理</h2>
    <RouterView />  <!-- 必须包含 -->
  </div>
</template>
```

### Q: 动态路由匹配顺序错误？

将动态参数放在独立目录：

```
# 错误结构
pages/users/[id].vue      # 匹配 /users/:id（会拦截 /users/1/edit）
pages/users/[id]/edit.vue

# 正确结构
pages/users/[id]/index.vue  # 匹配 /users/:id
pages/users/[id]/edit.vue   # 匹配 /users/:id/edit
```

### Q: 如何实现 404 捕获？

创建 `[...path].vue`：

```vue
<!-- src/pages/[...path].vue -->
<script setup lang="ts">
</script>

<route lang="yaml">
meta:
  layout: blank
</route>

<template>
  <div>页面未找到</div>
</template>
```

### Q: 布局能否动态切换？

当前方案通过静态 `meta.layout` 指定。如需动态布局，可自定义 `setupLayouts`：

```ts
// 自定义 setupLayouts
export function setupLayouts(routes: RouteRecordRaw[]) {
  return routes.map(route => ({
    path: route.path,
    component: () => {
      // 动态逻辑
      const layout = route.meta?.layout || 'default'
      return layouts[layout]
    },
    children: [{ path: '', component: route.component }],
  }))
}
```

## 与手动配置对比

| 特性 | 文件路由 | 手动配置 |
|------|---------|---------|
| 开发效率 | 高（约定优于配置） | 低（需要手动编写） |
| 灵活性 | 受文件规则约束 | 完全自由 |
| 动态布局 | 需自定义 | 直接支持 |
| 适用场景 | 中小型项目 | 复杂权限/动态路由 |