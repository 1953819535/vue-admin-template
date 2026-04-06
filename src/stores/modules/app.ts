import { computed, ref, watch, onScopeDispose } from 'vue'
import { defineStore } from 'pinia'
import themes from '@/themes/tweakcn-themes.json'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeName = string
export type LayoutType = 'sidebar' | 'top-nav'

const isClient = typeof window !== 'undefined'

// 所有可用主题
export const availableThemes = themes.map(t => ({
  name: t.name,
  title: t.title,
  description: t.description
}))

export const useAppStore = defineStore('app', () => {
  const currentTheme = ref<ThemeName>('vintage-paper')
  const mode = ref<ThemeMode>('system')
  const layout = ref<LayoutType>('sidebar')

  const systemIsDark = ref(
    isClient
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  const resolvedMode = computed(() => {
    if (mode.value === 'system') {
      return systemIsDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  const isDark = computed(() => resolvedMode.value === 'dark')

  const themeData = computed(() => {
    return themes.find(t => t.name === currentTheme.value)
  })

  const applyTheme = () => {
    const root = document.documentElement
    const theme = themeData.value

    if (!theme) return

    root.classList.toggle('dark', isDark.value)

    const vars = isDark.value ? theme.cssVars.dark : theme.cssVars.light

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value as string)
    })

    if (theme.cssVars.theme) {
      Object.entries(theme.cssVars.theme).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value as string)
      })
    }
  }

  // 监听系统主题变化，自动清理
  if (isClient) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      systemIsDark.value = e.matches
    }
    mediaQuery.addEventListener('change', handler)
    onScopeDispose(() => mediaQuery.removeEventListener('change', handler))
  }

  // 监听变化自动应用主题
  watch([isDark, currentTheme], () => {
    applyTheme()
  }, { immediate: false })

  const setThemeName = (name: ThemeName) => {
    currentTheme.value = name
  }

  const setMode = (newMode: ThemeMode) => {
    mode.value = newMode
  }

  const toggleTheme = () => {
    setMode(isDark.value ? 'light' : 'dark')
  }

  const setLayout = (newLayout: LayoutType) => {
    layout.value = newLayout
  }

  return {
    currentTheme,
    mode,
    layout,
    resolvedMode,
    isDark,
    themeData,
    availableThemes,
    setThemeName,
    setMode,
    setLayout,
    toggleTheme,
    applyTheme,
  }
}, {
  persist: {
    pick: ['currentTheme', 'mode', 'layout']
  }
})