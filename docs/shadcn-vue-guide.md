# shadcn-vue 使用说明

本项目使用 [shadcn-vue](https://www.shadcn-vue.com/) 作为 UI 组件库。shadcn-vue 是一套基于 Radix Vue (reka-ui) 的可复制粘贴式组件集合，结合 Tailwind CSS 提供了美观、可定制的组件。

## 项目配置概览

| 配置项 | 值 |
|--------|-----|
| 风格 | new-york |
| TypeScript | 启用 |
| 基础色 | neutral |
| CSS 变量 | 启用 |
| 图标库 | lucide |

## 核心依赖

- **reka-ui** - 无样式的底层 UI 原语组件库（原 Radix Vue）
- **tailwindcss** - CSS 框架（v4 版本）
- **class-variance-authority (cva)** - 处理组件变体的工具
- **clsx** + **tailwind-merge** - 类名合并工具
- **lucide-vue-next** - 图标库

## 目录结构

```
src/
├── components/
│   └── ui/           # shadcn 组件存放目录
│       └── button/   # Button 组件示例
│           ├── Button.vue
│           └── index.ts
├── lib/
│   └── utils.ts      # cn() 工具函数
└── style.css         # CSS 变量 + Tailwind 配置
```

## 工具函数

`src/lib/utils.ts` 提供了 `cn()` 函数，用于合并 Tailwind 类名：

```ts
import { cn } from "@/lib/utils"

// 使用示例
cn("px-4 py-2", "bg-primary", props.class)
```

## 添加新组件

使用 CLI 添加组件：

```bash
# 添加 Button 组件（已添加）
npx shadcn-vue@latest add button

# 添加其他组件
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
npx shadcn-vue@latest add dialog

# 添加多个组件
npx shadcn-vue@latest add card input dialog --overwrite
```

## 使用组件

组件导入后直接使用：

```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button>默认按钮</Button>
  <Button variant="destructive">危险按钮</Button>
  <Button variant="outline" size="sm">小按钮</Button>
  <Button variant="ghost" size="icon">
    <Icon icon="lucide:settings" />
  </Button>
</template>
```

## Button 组件变体

当前项目已配置 Button 组件，支持以下变体：

### variant（样式变体）

| 变体 | 说明 |
|------|------|
| `default` | 主要按钮，深色背景 |
| `destructive` | 危险操作，红色背景 |
| `outline` | 边框按钮，透明背景 |
| `secondary` | 次要按钮，浅色背景 |
| `ghost` | 无背景，hover 时显示背景 |
| `link` | 链接样式，下划线 |

### size（尺寸变体）

| 尺寸 | 说明 |
|------|------|
| `default` | 标准尺寸 (h-9) |
| `sm` | 小尺寸 (h-8) |
| `lg` | 大尺寸 (h-10) |
| `icon` | 图标按钮 (size-9) |
| `icon-sm` | 小图标按钮 (size-8) |
| `icon-lg` | 大图标按钮 (size-10) |

## CSS 变量

项目在 `src/style.css` 中定义了完整的主题变量：

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --radius: 0.625rem;
  /* ... 更多变量 */
}

.dark {
  /* 暗色模式变量覆盖 */
}
```

通过 Tailwind 的 `@theme inline` 指令映射为可用的颜色类：

- `bg-background` / `text-foreground`
- `bg-primary` / `text-primary-foreground`
- `bg-secondary` / `text-secondary-foreground`
- `bg-destructive` / `text-destructive`
- `border-border` / `ring-ring`

## 暗色模式

项目支持自动暗色模式切换（基于系统偏好）：

```css
@media (prefers-color-scheme: dark) {
  :root { /* 暗色变量 */ }
}
```

也可通过 `.dark` 类手动控制：

```html
<html class="dark">
  <!-- 强制暗色模式 -->
</html>
```

## 路径别名

在 `vite.config.ts` 中配置了 `@` 别名：

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

导入时使用：

```ts
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
```

## 可用组件列表

shadcn-vue 提供的常用组件：

| 组件 | CLI 命令 |
|------|----------|
| Accordion | `npx shadcn-vue@latest add accordion` |
| Alert | `npx shadcn-vue@latest add alert` |
| Avatar | `npx shadcn-vue@latest add avatar` |
| Badge | `npx shadcn-vue@latest add badge` |
| Card | `npx shadcn-vue@latest add card` |
| Checkbox | `npx shadcn-vue@latest add checkbox` |
| Dialog | `npx shadcn-vue@latest add dialog` |
| DropdownMenu | `npx shadcn-vue@latest add dropdown-menu` |
| Input | `npx shadcn-vue@latest add input` |
| Label | `npx shadcn-vue@latest add label` |
| Popover | `npx shadcn-vue@latest add popover` |
| Progress | `npx shadcn-vue@latest add progress` |
| Select | `npx shadcn-vue@latest add select` |
| Separator | `npx shadcn-vue@latest add separator` |
| Sheet | `npx shadcn-vue@latest add sheet` |
| Skeleton | `npx shadcn-vue@latest add skeleton` |
| Slider | `npx shadcn-vue@latest add slider` |
| Switch | `npx shadcn-vue@latest add switch` |
| Table | `npx shadcn-vue@latest add table` |
| Tabs | `npx shadcn-vue@latest add tabs` |
| Tooltip | `npx shadcn-vue@latest add tooltip` |

完整组件列表请参考：[shadcn-vue 组件文档](https://www.shadcn-vue.com/docs/components)

## 自定义组件

shadcn-vue 的组件代码直接复制到项目中，可以自由修改：

1. 修改 `src/components/ui/` 下的组件文件
2. 调整 CSS 变量改变主题色
3. 使用 cva 添加新的变体

```ts
// 添加新变体示例
export const buttonVariants = cva("...", {
  variants: {
    variant: {
      // ...现有变体
      custom: "bg-purple-500 text-white hover:bg-purple-600",
    },
  },
})
```

## 参考资源

- [shadcn-vue 官方文档](https://www.shadcn-vue.com/)
- [reka-ui 文档](https://reka-ui.com/)
- [Tailwind CSS v4 文档](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)