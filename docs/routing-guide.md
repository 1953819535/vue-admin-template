# Vue Router 5 文件路由方案

基于 Vue Router 5 内置文件路由系统 + `vite-plugin-vue-layouts` 实现的文件系统路由。

## 概述

| 特性       | 说明                               |
| ---------- | ---------------------------------- |
| 文件路由   | `src/pages/` 目录自动生成路由      |
| 布局系统   | `src/layouts/` 目录自动注册布局    |
| 动态路由   | `[id].vue` 文件名语法              |
| 嵌套子路由 | 目录结构自动生成子路由             |
| 路由元信息 | `definePage()` 宏定义 meta         |
| 类型安全   | 自动生成路由类型，支持类型安全参数 |

## 安装

```bash
pnpm add vue-router
pnpm add -D vite-plugin-vue-layouts
```

## 配置

### vite.config.ts

```ts
import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueRouter from 'vue-router/vite'
import Layouts from 'vite-plugin-vue-layouts'

export default defineConfig({
  plugins: [
    VueRouter({
      // 排除不需要生成路由的文件
      exclude: ['**/components/**', '**/__*', '**/__*/**/*', '**/*.component.vue'],
    }),
    vue(),
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
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'

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
/// <reference types="vue-router/auto-routes" />
/// <reference types="vite-plugin-vue-layouts/client" />
```

## 目录结构

```
src/
├── layouts/              # 布局组件
│   ├── default.vue       # 默认布局
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
    ├── index.ts          # 路由入口
    └── guard.ts          # 路由守卫
```

## 路由规则

### 文件名到路由映射

| 文件路径                     | 生成的路由                   |
| ---------------------------- | ---------------------------- |
| `pages/index.vue`            | `/`                          |
| `pages/login.vue`            | `/login`                     |
| `pages/users/index.vue`      | `/users`                     |
| `pages/users/create.vue`     | `/users/create`              |
| `pages/users/[id]/index.vue` | `/users/:id`                 |
| `pages/users/[id]/edit.vue`  | `/users/:id/edit`            |
| `pages/[...path].vue`        | `/:path(.*)*` (捕获所有路由) |

### 忽略路由生成

使用 `_` 前缀的文件或配置 `exclude` 排除的文件不会生成路由：

| 文件路径                       | 是否生成路由         |
| ------------------------------ | -------------------- |
| `pages/_helper.vue`            | ❌ 不生成            |
| `pages/users/_form.vue`        | ❌ 不生成            |
| `pages/_components/button.vue` | ❌ 不生成            |
| `pages/dashboard.vue`          | ✅ 生成 `/dashboard` |

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

### definePage() 宏

Vue Router 5 使用 `definePage()` 宏定义路由元信息：

```vue
<script setup lang="ts">
definePage({
  meta: {
    title: '用户管理',
    menuTitle: '用户列表',
    menuIcon: 'lucide:users',
    menuGroup: '用户管理',
    menuGroupIcon: 'lucide:users',
    menuOrder: 10,
    requiresAuth: true,
    permissions: ['users:list'],
  },
})
</script>

<template>
  <div>页面内容</div>
</template>
```

### 布局配置

**重要**：默认布局无需指定，只有空白布局需要显式配置：

```vue
<!-- 使用默认布局（无需指定） -->
<script setup lang="ts">
definePage({
  meta: {
    title: '仪表盘',
    requiresAuth: true,
  },
})
</script>

<!-- 使用空白布局（需要指定） -->
<script setup lang="ts">
definePage({
  meta: {
    layout: 'blank',
    menuHidden: true,
    constant: true,
  },
})
</script>
```

| meta.layout | 使用的布局            |
| ----------- | --------------------- |
| `'blank'`   | `layouts/blank.vue`   |
| 未指定      | `layouts/default.vue` |

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
<!-- src/layouts/default.vue -->
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
        <RouterView />
        <!-- 页面内容渲染位置 -->
      </div>
    </main>
  </div>
</template>
```

### setupLayouts 原理

`setupLayouts` 将扁平路由转换为嵌套路由：

**输入（扁平路由）：**

```ts
;[{ path: '/dashboard', component: DashboardPage, meta: { layout: 'blank' } }]
```

**输出（嵌套路由）：**

```ts
;[
  {
    path: '/dashboard',
    component: BlankLayout, // 布局作为父路由
    children: [
      { path: '', component: DashboardPage }, // 页面作为子路由
    ],
    meta: { isLayout: true },
  },
]
```

**渲染流程：**

```
访问 /dashboard
  → 匹配 BlankLayout（渲染布局外壳）
    → BlankLayout 内 <RouterView />
      → 匹配 DashboardPage（渲染页面内容）
```

## 类型安全

### 动态路由参数

Vue Router 5 自动生成路由类型，使用泛型获取类型安全的参数：

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

// 使用泛型指定路由路径
const route = useRoute<'/users/[id]/'>()
const userId = route.params.id // 类型安全，自动推断为 string
</script>
```

### 路由名称

生成的路由名称基于文件路径：

| 文件路径                     | 路由名称     |
| ---------------------------- | ------------ |
| `pages/index.vue`            | `/`          |
| `pages/users/index.vue`      | `/users`     |
| `pages/users/[id]/index.vue` | `/users/:id` |

使用 `router.push()` 时可以使用路径或名称：

```ts
router.push('/users')
router.push({ name: '/users' })
router.push('/users/123')
```

## 路由元信息

### 可用的 meta 字段

```ts
definePage({
  meta: {
    layout: 'blank', // 布局名称（仅空白布局需要指定）
    title: '用户管理', // 页面标题
    menuTitle: '用户列表', // 菜单显示标题
    menuIcon: 'lucide:users', // 菜单图标
    menuGroup: '用户管理', // 菜单分组
    menuGroupIcon: 'lucide:users', // 分组图标
    menuOrder: 10, // 菜单排序
    menuHidden: true, // 隐藏菜单项
    requiresAuth: true, // 是否需要登录
    roles: ['admin'], // 允许的角色
    permissions: ['users:list'], // 允许的权限
    constant: true, // 常量路由（不需要权限检查）
  },
})
```

### 重定向

```ts
definePage({
  redirect: '/dashboard',
})
```

## 路由守卫

Vue Router 5 推荐使用返回值代替 `next()` 回调：

```ts
// src/router/guard.ts
import type { Router } from 'vue-router'

const WHITE_LIST = ['/login', '/404', '/403']

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    // 白名单或常量路由，直接放行
    if (WHITE_LIST.includes(to.path) || to.meta.constant) {
      return true
    }

    // 未登录，重定向到登录页
    if (!authStore.isLogin) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      }
    }

    // 已登录，放行
    return true
  })
}
```

## 获取路由数据

### 静态路由（构建时）

```ts
import { routes } from 'vue-router/auto-routes'
```

### 运行时路由

```ts
import { useRouter } from 'vue-router'

const router = useRouter()
const routes = router.getRoutes() // 获取运行时已解析的路由
```

**注意**：`router.getRoutes()` 返回的路由包含布局处理后的结构，带有 `isLayout: true` 标记。

## 权限控制

### 路由级权限

在 `definePage()` 中配置 `roles` 或 `permissions`：

```ts
definePage({
  meta: {
    roles: ['admin', 'manager'],
    permissions: ['users:list'],
  },
})
```

### 按钮级权限

使用 `useAuth` Hook：

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { hasAuth, hasRole } = useAuth()
</script>

<template>
  <Button v-if="hasAuth('users:add')">新增</Button>
  <Button v-if="hasAuth('users:delete')">删除</Button>
  <AdminPanel v-if="hasRole('admin')" />
</template>
```

## 编程式导航

```ts
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 跳转
router.push('/dashboard')
router.push({ name: '/users' })
router.push({ path: '/users', query: { page: 1 } })

// 带参数跳转
router.push(`/users/${userId}`)
router.push({ name: '/users/:id', params: { id: userId } })

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
    <RouterView />
    <!-- 必须包含 -->
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
definePage({
  meta: {
    layout: 'blank',
    menuHidden: true,
    constant: true,
  },
})
</script>

<template>
  <div>页面未找到</div>
</template>
```

### Q: 为什么菜单出现重复？

使用 `router.getRoutes()` 时会包含布局包装路由（`isLayout: true`），需要过滤：

```ts
function generateMenus(routes: RouteRecordRaw[]) {
  for (const route of routes) {
    if (route.meta?.isLayout) continue // 过滤布局包装路由
    // ...处理菜单
  }
}
```

### Q: 为什么使用 router.getRoutes() 而不是 vue-router/auto-routes？

`vue-router/auto-routes` 是静态数据，不包含布局处理后的完整路径。`router.getRoutes()` 返回运行时已解析的路由，包含完整路径和布局信息。

## 与 vite-plugin-pages 对比

| 特性      | Vue Router 5      | vite-plugin-pages |
| --------- | ----------------- | ----------------- |
| 路由生成  | 内置，无需插件    | 需要插件          |
| meta 配置 | `definePage()` 宏 | `<route>` block   |
| 类型安全  | 自动生成类型      | 需要额外配置      |
| 维护成本  | 官方维护          | 社区维护          |
| 版本要求  | vue-router ≥ 5.0  | vue-router 4      |

## 参考文档

- [Vue Router 5 文件路由](https://router.vuejs.org/zh/file-based-routing/file-based-routing.html)
- [Vue Router 5 官方文档](https://router.vuejs.org/)
- [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts)
