import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import themes from '@/themes/tweakcn-themes.json'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeName = string

// 所有可用主题
export const availableThemes = themes.map(t => ({
  name: t.name,
  title: t.title,
  description: t.description
}))

export const useAppStore = defineStore('app', () => {
  // 当前主题名称
  const currentTheme = ref<ThemeName>('modern-minimal')

  // 明暗模式
  const mode = ref<ThemeMode>('system')

  // 系统暗色模式状态
  const systemIsDark = ref(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  // 计算实际应用的明暗模式
  const resolvedMode = computed(() => {
    if (mode.value === 'system') {
      return systemIsDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  // 是否为暗色
  const isDark = computed(() => resolvedMode.value === 'dark')

  // 获取当前主题数据
  const themeData = computed(() => {
    return themes.find(t => t.name === currentTheme.value)
  })

  // 应用 CSS 变量到 DOM
  const applyTheme = () => {
    const root = document.documentElement
    const theme = themeData.value

    if (!theme) return

    // 应用明暗模式类
    root.classList.toggle('dark', isDark.value)

    // 获取对应模式的 CSS 变量
    const vars = isDark.value ? theme.cssVars.dark : theme.cssVars.light

    // 应用 CSS 变量
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string)
    })

    // 应用 theme 级别的变量
    if (theme.cssVars.theme) {
      Object.entries(theme.cssVars.theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string)
      })
    }
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      systemIsDark.value = e.matches
    })
  }

  // 监听 isDark 变化自动应用主题
  watch(isDark, () => {
    applyTheme()
  }, { immediate: false })

  // 设置主题名称
  const setThemeName = (name: ThemeName) => {
    currentTheme.value = name
    applyTheme()
  }

  // 设置明暗模式
  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
    applyTheme()
  }

  // 切换明暗
  const toggleTheme = () => {
    setMode(isDark.value ? 'light' : 'dark')
  }

  return {
    currentTheme,
    mode,
    resolvedMode,
    isDark,
    themeData,
    availableThemes,
    setThemeName,
    setMode,
    toggleTheme,
    applyTheme,
  }
}, {
  persist: {
    pick: ['currentTheme', 'mode']
  }
})