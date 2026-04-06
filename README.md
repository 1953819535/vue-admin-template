# Vue Admin Template

一个现代化的 Vue 3 后台管理系统模板，支持多主题切换、文件路由、布局系统。

## 特性

- **Vue 3 + TypeScript** - 类型安全，开发体验佳
- **文件路由** - Nuxt 风格，页面即路由
- **布局系统** - 支持多布局切换（admin/blank）
- **多主题支持** - 内置 36 个主题风格，支持亮色/暗色/跟随系统
- **shadcn-vue** - 高质量 UI 组件库，可定制性强
- **Tailwind CSS 4** - 原子化 CSS，样式灵活
- **Pinia** - 轻量级状态管理，支持持久化

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.5 + TypeScript 5.9 |
| 构建 | Vite 8 |
| 路由 | vue-router + vite-plugin-pages + vite-plugin-vue-layouts |
| 样式 | Tailwind CSS 4 |
| 组件 | shadcn-vue (reka-ui) |
| 状态 | Pinia + pinia-plugin-persistedstate |
| 图标 | @iconify/vue (lucide) |

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

## 目录结构

```
src/
├── components/
│   ├── ui/              # shadcn-vue 基础组件（禁止修改）
│   │   ├── button/
│   │   ├── card/
│   │   ├── dropdown-menu/
│   │   └── ...
│   ├── shared/          # 通用封装组件（S 前缀）
│   │   ├── sdata-table/     # SDataTable 数据表格
│   │   ├── spagination/     # SPaginationBar 分页条
│   │   └── stoaster/        # SToaster 消息提示
│   ├── app/             # 业务组件
│   │   ├── Actions.vue      # 顶部操作栏
│   │   ├── Logo.vue         # Logo 组件
│   │   └── ThemeSwitcher.vue # 主题切换器
│   └── layouts/         # 布局实现组件
│       ├── SidebarLayout.vue
│       └── TopNavLayout.vue
├── layouts/             # 布局入口
│   ├── admin.vue        # 后台管理布局（带侧边栏）
│   ├── blank.vue        # 空白布局（登录页等）
│   └── default.vue      # 默认布局
├── pages/               # 页面（文件路由）
│   ├── index.vue        # 首页（重定向到 dashboard）
│   ├── dashboard.vue    # 仪表盘
│   ├── login.vue        # 登录页
│   ├── users/           # 用户管理
│   └── system/          # 系统设置
├── stores/              # Pinia 状态管理
│   └── modules/
│       └── app.ts       # 应用状态（主题、模式）
├── themes/              # 主题配置
│   ├── tweakcn-themes.json    # 主题数据
│   ├── theme-names-zh.json    # 中文映射
│   └── README.md              # 主题文档
├── lib/                 # 工具函数
│   └── utils.ts         # cn() 等
├── router/              # 路由配置
├── style.css            # 全局样式 + CSS 变量
├── App.vue              # 根组件
└── main.ts              # 入口文件
```

## 文件路由

使用 `vite-plugin-pages` 实现 Nuxt 风格的文件路由：

| 文件路径 | 路由地址 |
|---------|---------|
| `src/pages/index.vue` | `/` |
| `src/pages/dashboard.vue` | `/dashboard` |
| `src/pages/users/index.vue` | `/users` |
| `src/pages/users/[id]/index.vue` | `/users/:id` |
| `src/pages/users/create.vue` | `/users/create` |

### 路由元信息

在 `.vue` 文件中使用 `<route>` 块定义：

```vue
<route lang="yaml">
meta:
  layout: admin
  title: 用户管理
  requiresAuth: true
</route>
```

## 布局系统

通过 `meta.layout` 指定布局：

| 布局 | 说明 | 使用场景 |
|------|------|---------|
| `admin` | 带侧边栏的后台布局 | 管理页面 |
| `blank` | 空白布局 | 登录、注册、404 |

```vue
<!-- 使用 admin 布局 -->
<route lang="yaml">
meta:
  layout: admin
</route>
```

## UI 组件 (shadcn-vue)

本项目使用 [shadcn-vue](https://www.shadcn-vue.com/) 作为 UI 组件库。

### 为什么选择 shadcn-vue

- **源码级控制** - 组件代码直接在项目中，可完全定制
- **无依赖锁定** - 不依赖特定 npm 包版本
- **设计一致性** - 基于 Radix UI，交互体验优秀
- **Tailwind 集成** - 样式与 Tailwind CSS 完美配合

### 已安装组件

| 组件 | 说明 |
|------|------|
| Button | 按钮 |
| DropdownMenu | 下拉菜单 |
| Separator | 分隔线 |
| Card | 卡片 |
| Avatar | 头像 |

### 安装新组件

```bash
# 安装单个组件
pnpm dlx shadcn-vue@latest add input
pnpm dlx shadcn-vue@latest add select
pnpm dlx shadcn-vue@latest add table

# 批量安装
pnpm dlx shadcn-vue@latest add input select table dialog form
```

### 使用示例

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>卡片标题</CardTitle>
    </CardHeader>
    <CardContent>
      <Button>点击我</Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline">打开菜单</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>选项一</DropdownMenuItem>
          <DropdownMenuItem>选项二</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardContent>
  </Card>
</template>
```

### 组件目录规范

```
src/components/
├── ui/      # shadcn-vue 组件（第三方，禁止修改）
├── shared/  # 通用封装组件（S 前缀命名）
└── app/     # 业务组件（自行开发）
```

**命名规范**：

| 目录 | 导入路径 | 组件名 | 说明 |
|------|---------|--------|------|
| `ui/` | `@/components/ui/button` | `Button` | shadcn-vue 原组件 |
| `shared/` | `@/components/shared/sdata-table` | `SDataTable` | 通用封装，S 前缀 |
| `app/` | `@/components/app/Logo` | `Logo` | 业务组件 |

**注意**：
- `ui/` 目录下的组件由 shadcn-vue CLI 管理，请勿手动修改
- `shared/` 目录使用 S 前缀命名，避免与 ui 组件混淆

### 常用组件列表

| 组件 | 安装命令 | 用途 |
|------|---------|------|
| Input | `pnpm dlx shadcn-vue@latest add input` | 输入框 |
| Select | `pnpm dlx shadcn-vue@latest add select` | 下拉选择 |
| Checkbox | `pnpm dlx shadcn-vue@latest add checkbox` | 复选框 |
| RadioGroup | `pnpm dlx shadcn-vue@latest add radio-group` | 单选组 |
| Switch | `pnpm dlx shadcn-vue@latest add switch` | 开关 |
| Table | `pnpm dlx shadcn-vue@latest add table` | 表格 |
| Dialog | `pnpm dlx shadcn-vue@latest add dialog` | 对话框 |
| Form | `pnpm dlx shadcn-vue@latest add form` | 表单 |
| Tabs | `pnpm dlx shadcn-vue@latest add tabs` | 标签页 |
| Toast | `pnpm dlx shadcn-vue@latest add toast` | 消息提示 |
| Tooltip | `pnpm dlx shadcn-vue@latest add tooltip` | 文字提示 |
| Badge | `pnpm dlx shadcn-vue@latest add badge` | 徽标 |
| Skeleton | `pnpm dlx shadcn-vue@latest add skeleton` | 骨架屏 |

## 主题系统

内置 36 个主题风格，支持亮色/暗色/跟随系统三种模式。

### 切换主题

```typescript
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

// 切换主题风格
appStore.setThemeName('catppuccin')

// 切换明暗模式
appStore.setMode('dark')    // 暗色
appStore.setMode('light')   // 亮色
appStore.setMode('system')  // 跟随系统
```

### 可用主题

| 主题名称 | 中文标题 | 描述 |
|---------|---------|------|
| modern-minimal | 现代极简 | 默认主题，简洁现代 |
| catppuccin | Catppuccin | 柔和 pastel 色调 |
| cyberpunk | 赛博朋克 | 霓虹色彩，未来感 |
| claude | Claude | Anthropic Claude 风格 |
| vercel | Vercel | Vercel 官方风格 |
| ... | ... | 完整列表见 `src/themes/` |

更多主题配置见 [src/themes/README.md](src/themes/README.md)

## 状态管理

使用 Pinia 进行状态管理，支持持久化：

```typescript
// stores/modules/app.ts
export const useAppStore = defineStore('app', () => {
  const currentTheme = ref('modern-minimal')
  const mode = ref<'light' | 'dark' | 'system'>('system')

  return { currentTheme, mode }
}, {
  persist: {
    pick: ['currentTheme', 'mode']
  }
})
```

## 样式规范

### Tailwind 类名

使用语义化颜色变量：

```html
<!-- 推荐 -->
<div class="bg-background text-foreground">
<div class="bg-primary text-primary-foreground">
<div class="text-muted-foreground">

<!-- 避免 -->
<div class="bg-white text-black">
<div class="bg-gray-100">
```

### CSS 变量

主要颜色变量：

```css
--background      /* 背景色 */
--foreground      /* 前景色 */
--primary         /* 主色 */
--secondary       /* 次色 */
--muted           /* 弱化色 */
--accent          /* 强调色 */
--border          /* 边框色 */
--sidebar-*       /* 侧边栏相关 */
```

## 开发规范

### 命名约定

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserList.vue` |
| 页面 | kebab-case | `user-list.vue` 或 `index.vue` |
| Store | camelCase | `useAppStore` |
| 类型 | PascalCase | `NavItem` |

### 组件开发

```vue
<script setup lang="ts">
// 1. 类型定义
interface Props {
  title: string
  disabled?: boolean
}

// 2. Props
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

// 3. Emits
const emit = defineEmits<{
  click: [value: string]
}>()

// 4. 响应式状态
const loading = ref(false)

// 5. 方法
function handleClick() {
  emit('click', props.title)
}
</script>

<template>
  <!-- 模板 -->
</template>
```

## 相关文档

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [reka-ui](https://reka-ui.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)

## License

MIT