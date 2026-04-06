# 主题系统

本项目支持 tweakcn 提供的 36 个主题风格，支持亮色/暗色/跟随系统三种明暗模式。

## 目录结构

```
src/themes/
├── tweakcn-themes.json    # tweakcn 主题数据（从官方 registry 提取）
├── theme-names-zh.json    # 主题中文描述映射
└── README.md              # 本文档
```

## 可用主题

| 主题名称 | 中文标题 | 描述 |
|---------|---------|------|
| modern-minimal | 现代极简 | 简洁现代的设计风格，低饱和度配色 |
| catppuccin | Catppuccin | 柔和 pastel 色调，温暖的深色模式 |
| cyberpunk | 赛博朋克 | 霓虹色彩、高对比度、未来科幻感 |
| claude | Claude | Anthropic Claude 官方风格配色 |
| vercel | Vercel | Vercel 官方黑白极简风格 |
| ... | ... | 完整列表见 `theme-names-zh.json` |

## 使用方式

### 在组件中使用

```vue
<script setup>
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()

// 切换主题风格
appStore.setThemeName('catppuccin')

// 切换明暗模式
appStore.setMode('dark')       // 暗色
appStore.setMode('light')      // 亮色
appStore.setMode('system')     // 跟随系统

// 获取当前状态
console.log(appStore.currentTheme)  // 当前主题名称
console.log(appStore.mode)          // 明暗模式
console.log(appStore.isDark)        // 是否为暗色
</script>
```

### 获取主题列表

```ts
import { availableThemes } from '@/stores/modules/app'

// availableThemes 是一个数组，包含所有可用主题
availableThemes.forEach(theme => {
  console.log(theme.name, theme.title, theme.description)
})
```

## 更新主题数据

当 tweakcn 官方更新主题时，按以下步骤同步：

### 步骤 1：下载最新 registry

```bash
curl -sL "https://raw.githubusercontent.com/jnsahaj/tweakcn/main/public/r/registry.json" -o registry.json
```

### 步骤 2：提取主题数据

创建临时脚本 `extract-themes.cjs`：

```javascript
const fs = require('fs')
const registry = JSON.parse(fs.readFileSync('registry.json', 'utf8'))

const themes = registry.items.map(item => ({
  name: item.name,
  title: item.title,
  description: item.description,
  cssVars: item.cssVars
}))

fs.writeFileSync('src/themes/tweakcn-themes.json', JSON.stringify(themes, null, 2))
console.log('Extracted', themes.length, 'themes')
```

运行脚本：

```bash
node extract-themes.cjs && rm extract-themes.cjs registry.json
```

### 步骤 3：更新中文描述

1. 检查是否有新增主题
2. 在 `theme-names-zh.json` 中添加新主题的中文翻译

```bash
# 查看所有主题名称
grep -o '"name": "[^"]*"' src/themes/tweakcn-themes.json | sed 's/"name": "//;s/"//'
```

## 技术实现

### CSS 变量系统

主题通过 CSS 变量实现，核心变量包括：

- `--background` / `--foreground`：背景和前景色
- `--primary` / `--primary-foreground`：主色及其前景色
- `--secondary` / `--secondary-foreground`：次色及其前景色
- `--muted` / `--muted-foreground`：弱化色
- `--accent` / `--accent-foreground`：强调色
- `--card` / `--card-foreground`：卡片色
- `--border` / `--input` / `--ring`：边框、输入框、焦点环
- `--sidebar-*`：侧边栏相关变量

### 应用流程

1. `main.ts` 启动时调用 `appStore.applyTheme()` 初始化
2. `applyTheme()` 读取当前主题的 CSS 变量数据
3. 通过 `document.documentElement.style.setProperty()` 设置变量
4. Tailwind 通过 `@theme inline` 将变量映射为类名

### 持久化存储

使用 `pinia-plugin-persistedstate` 自动持久化：
- `currentTheme`：当前主题名称
- `mode`：明暗模式

用户选择会保存到 localStorage，下次访问自动恢复。

## 相关文件

- [src/stores/modules/app.ts](../stores/modules/app.ts) - 主题状态管理
- [src/style.css](../style.css) - CSS 变量基础定义
- [src/components/app/ThemeSwitcher.vue](../components/app/ThemeSwitcher.vue) - 主题切换组件
- [src/components/app/Sidebar.vue](../components/app/Sidebar.vue) - 侧边栏组件
- [src/layouts/admin.vue](../layouts/admin.vue) - 集成切换器

## 组件目录结构

```
src/components/
├── ui/                    # 第三方组件库 (shadcn-vue，禁止修改)
│   ├── button/
│   ├── dropdown-menu/
│   ├── separator/
│   ├── card/
│   └── avatar/
├── shared/                # 通用封装组件（S 前缀命名）
│   ├── sdata-table/       # SDataTable 数据表格
│   ├── spagination/       # SPaginationBar 分页条
│   └── stoaster/          # SToaster 消息提示
└── app/                   # 应用业务组件
    ├── ThemeSwitcher.vue  # 主题风格切换器
    ├── Logo.vue           # Logo 组件
    └── Actions.vue        # 顶部操作栏
```

## UI 组件安装

本项目使用 shadcn-vue 组件库，主题系统依赖以下组件：

| 组件 | 命令 | 用途 |
|-----|------|------|
| Button | `pnpm dlx shadcn-vue@latest add button` | 按钮组件 |
| DropdownMenu | `pnpm dlx shadcn-vue@latest add dropdown-menu` | 下拉菜单 |
| Separator | `pnpm dlx shadcn-vue@latest add separator` | 分隔线 |
| Card | `pnpm dlx shadcn-vue@latest add card` | 卡片容器 |
| Avatar | `pnpm dlx shadcn-vue@latest add avatar` | 用户头像 |

批量安装：

```bash
pnpm dlx shadcn-vue@latest add button dropdown-menu separator card avatar
```

## 参考链接

- [tweakcn 官网](https://tweakcn.com)
- [tweakcn GitHub](https://github.com/jnsahaj/tweakcn)
- [tweakcn 主题预览](https://tweakcn.com/themes)
- [tweakcn 主题编辑器](https://tweakcn.com/editor/theme) - 预设主题查看与自定义主题创建
- [shadcn-vue 文档](https://www.shadcn-vue.com)