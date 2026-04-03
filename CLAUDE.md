# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 语言

默认使用中文与用户对话。

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

## 架构概览

### 文件路由系统

使用 `vite-plugin-pages` 实现 Nuxt 风格文件路由：

- 页面目录: `src/pages/`
- 路由自动生成，无需手动配置
- 动态路由使用 `[param]` 语法，如 `src/pages/users/[id]/index.vue` → `/users/:id`

在页面中使用 `<route>` 块定义元信息：

```vue
<route lang="yaml">
meta:
  layout: admin
  title: 用户管理
</route>
```

### 布局系统

使用 `vite-plugin-vue-layouts`：

- 布局目录: `src/layouts/`
- 通过 `meta.layout` 指定布局
- 主要布局: `admin`（带侧边栏）、`blank`（空白页）
- 布局组件实际位于 `src/components/layouts/`，由 LayoutProvider 动态渲染

### 主题系统

在 `src/stores/modules/app.ts` 的 `useAppStore` 中管理：

- 36 个预设主题（数据源: `src/themes/tweakcn-themes.json`）
- 三种模式: `light` / `dark` / `system`
- 两种布局类型: `sidebar` / `top-nav`
- 状态持久化到 localStorage

切换主题示例：

```typescript
const appStore = useAppStore()
appStore.setThemeName('catppuccin')
appStore.setMode('dark')
```

### 状态管理

使用 Pinia + pinia-plugin-persistedstate：

- Store 目录: `src/stores/modules/`
- 使用 `persist.pick` 选择需要持久化的字段
- 主要 Store: `useAppStore`（主题、布局、侧边栏状态）

### UI 组件规范

**禁止修改 `src/components/ui/` 目录下的组件**

这些组件由 shadcn-vue CLI 管理，手动修改会导致：
- 无法通过 CLI 更新组件
- 与 CLI 安装的新组件样式不一致
- 重新安装组件时丢失修改

如需定制组件样式或行为，应在 `src/components/app/` 中创建封装组件。

组件目录说明：
- `src/components/ui/` - shadcn-vue 基础组件（禁止修改）
- `src/components/app/` - 业务组件（自行开发）
- `src/components/layouts/` - 布局实现组件
- `src/components/data-table/` - 数据表格封装组件

### 样式与主题适配

**优先使用 UI 组件和语义化样式变量，以确保主题切换时样式一致。**

推荐做法：
- **优先使用 `src/components/ui/` 中的组件**：这些组件已内置主题适配
- **使用语义化颜色变量**：`bg-background`、`text-foreground`、`bg-primary`、`text-muted-foreground` 等
- **避免硬编码颜色值**：如 `bg-white`、`text-gray-500`、`#ffffff` 等无法随主题变化

常用语义化颜色变量：

**基础颜色**

| 变量 | 用途 |
|------|------|
| `background` / `foreground` | 页面背景与主要文字 |
| `card` / `card-foreground` | 卡片背景与文字 |
| `popover` / `popover-foreground` | 弹出层背景与文字 |
| `primary` / `primary-foreground` | 主要按钮/强调元素 |
| `secondary` / `secondary-foreground` | 次要按钮/元素 |
| `muted` / `muted-foreground` | 禁用/弱化状态 |
| `accent` / `accent-foreground` | 悬停/焦点状态 |
| `destructive` / `destructive-foreground` | 危险操作/错误状态 |
| `border` | 边框颜色 |
| `input` | 输入框背景 |
| `ring` | 焦点环颜色 |

**侧边栏颜色**

| 变量 | 用途 |
|------|------|
| `sidebar` / `sidebar-foreground` | 侧边栏背景与文字 |
| `sidebar-primary` / `sidebar-primary-foreground` | 侧边栏主要元素 |
| `sidebar-accent` / `sidebar-accent-foreground` | 侧边栏悬停状态 |
| `sidebar-border` / `sidebar-ring` | 侧边栏边框与焦点环 |

**图表颜色**

| 变量 | 用途 |
|------|------|
| `chart-1` ~ `chart-5` | 图表系列颜色（5 种预设色） |

**其他变量**

| 变量 | 用途 |
|------|------|
| `radius` | 圆角大小（默认 0.625rem） |
| `font-sans` / `font-serif` / `font-mono` | 字体族 |
| `shadow-sm` ~ `shadow-2xl` | 阴影层级 |

### 已安装组件

项目已安装 60 个 shadcn-vue 组件，涵盖表单、布局、导航、数据展示等场景。常用组件包括：

- **表单**: `button`、`input`、`textarea`、`checkbox`、`select`、`form`、`radio-group`、`switch`、`slider`
- **布局**: `card`、`dialog`、`sheet`、`drawer`、`sidebar`、`separator`、`scroll-area`
- **导航**: `breadcrumb`、`navigation-menu`、`menubar`、`tabs`、`pagination`
- **数据展示**: `table`、`data-table`、`chart`、`badge`、`avatar`、`skeleton`、`spinner`
- **反馈**: `alert`、`alert-dialog`、`toast`(sonner)、`tooltip`、`popover`、`hover-card`

完整组件列表见 `src/components/ui/` 目录。

### 工具函数

`src/lib/utils.ts` 提供 `cn()` 函数用于合并 Tailwind 类名。

## 导入路径别名

`@` 映射到 `src/`（在 vite.config.ts 中配置）。