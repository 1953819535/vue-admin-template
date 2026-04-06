# CLAUDE.md

## 语言

使用中文对话。

## 项目

Vue 3 后台管理系统，Vite + TypeScript + Pinia + shadcn-vue + Tailwind CSS 4。

## 核心约束

1. **禁止修改 `src/components/ui/` 目录**：这些组件由 shadcn-vue CLI 管理，手动修改会导致无法更新。如需定制，在 `src/components/shared/` 或 `src/components/app/` 中封装。

2. **优先使用语义化颜色变量**：`bg-background`、`text-foreground`、`bg-primary`、`text-muted-foreground` 等，避免硬编码颜色值（如 `bg-white`、`text-gray-500`、`#ffffff`），确保主题切换时样式一致。

3. **不要重复造轮子**：新建组件或工具函数前，先检查 `@/components/shared/`、`@/components/app/`、`@/lib/` 下现有代码，保持风格一致。

4. **渐进式开发**：在整体框架基础上增量添加功能，保持逻辑精简、代码最小化，避免过度设计。

5. **组件目录规范**：
   - `src/components/ui/` - shadcn-vue 基础组件（禁止修改）
   - `src/components/shared/` - 通用封装组件
   - `src/components/app/` - 业务组件
   - `src/components/layouts/` - 布局实现组件

## 技术细节

- **组件**：统一使用 `<script setup lang="ts">`
- **样式**：统一使用 Tailwind CSS，优先语义化变量
- **状态**：Pinia Store 强制使用 Setup 函数式写法
- **导入**：`@` 映射到 `src/`

### 文件路由

使用 `vite-plugin-pages` 实现 Nuxt 风格文件路由：

| 文件路径 | 路由地址 |
|---------|---------|
| `src/pages/index.vue` | `/` |
| `src/pages/dashboard.vue` | `/dashboard` |
| `src/pages/users/index.vue` | `/users` |
| `src/pages/users/[id]/index.vue` | `/users/:id` |
| `src/pages/users/create.vue` | `/users/create` |

在页面中使用 `<route>` 块定义元信息：

```vue
<route lang="yaml">
meta:
  layout: default
  title: 用户管理
  requiresAuth: true
  permissions: [users:list]
  roles: [admin]
</route>
```

### 权限系统

**路由级权限**：通过 `meta.roles` 或 `meta.permissions` 控制

**按钮级权限**：使用 `useAuth` Hook

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'
const { hasAuth, hasRole } = useAuth()
</script>

<template>
  <Button v-if="hasAuth('users:add')">新增</Button>
</template>
```

**超级管理员**：拥有 `admin` 角色或 `*:*:*` 权限的用户自动拥有所有权限

### 布局系统

通过 `meta.layout` 指定布局，布局组件位于 `src/layouts/`：

| 布局 | 说明 |
|------|------|
| `admin` | 带侧边栏的后台布局 |
| `blank` | 空白布局（登录、404 等） |
| `default` | 默认布局 |

## 验证流程

修改代码后执行构建验证（包含 TypeScript 类型检查）：

```bash
pnpm run build
```

## 边界确认

修改以下文件前需用户确认：

- 构建配置：`vite.config.ts`、`tsconfig.json`
- 依赖：`package.json`

## Git 规范

中文 Conventional Commits：

- `feat(scope): 描述` - 新功能
- `fix(scope): 描述` - 修复
- `refactor(scope): 描述` - 重构
- `docs: 描述` / `chore: 描述`

提交前确保 build 通过。

## 常用命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本（包含 TypeScript 类型检查）
pnpm build

# 预览构建结果
pnpm preview
```

## 安装 shadcn-vue 组件

```bash
# 安装单个组件
pnpm dlx shadcn-vue@latest add input

# 批量安装
pnpm dlx shadcn-vue@latest add dialog form tabs
```

## 语义化颜色速查

| 变量 | 用途 |
|------|------|
| `background` / `foreground` | 页面背景与主要文字 |
| `card` / `card-foreground` | 卡片背景与文字 |
| `primary` / `primary-foreground` | 主要按钮/强调元素 |
| `secondary` / `secondary-foreground` | 次要按钮/元素 |
| `muted` / `muted-foreground` | 禁用/弱化状态 |
| `accent` / `accent-foreground` | 悬停/焦点状态 |
| `destructive` / `destructive-foreground` | 危险操作/错误状态 |
| `border` | 边框颜色 |
| `ring` | 焦点环颜色 |
| `chart-1` ~ `chart-5` | 图表系列颜色 |

侧边栏专用：`sidebar`、`sidebar-foreground`、`sidebar-accent` 等。