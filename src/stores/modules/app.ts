import { computed, ref, watch, onScopeDispose } from 'vue'
import { defineStore } from 'pinia'
import themes from '@/themes/tweakcn-themes.json'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeName = string
export type LayoutType = 'sidebar' | 'top-nav'

/** 自定义主题数据结构 */
export interface CustomThemeData {
  name: string
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
    theme?: Record<string, string>
  }
  rawCss: string
}

/** 水印配置 */
export interface WatermarkConfig {
  /** 是否启用水印 */
  enabled: boolean
  /** 水印透明度 (0-1) */
  alpha?: number
  /** 水印旋转角度 */
  rotate?: number
}

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
  const customTheme = ref<CustomThemeData | null>(null)
  const watermarkConfig = ref<WatermarkConfig>({
    enabled: true,
  })

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
    // 如果有自定义主题，优先使用
    if (customTheme.value) {
      return {
        name: 'custom',
        title: '自定义主题',
        description: '用户自定义的主题配置',
        cssVars: customTheme.value.cssVars
      }
    }
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
  watch([isDark, currentTheme, customTheme], () => {
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

  /** 设置自定义主题 */
  const setCustomTheme = (data: CustomThemeData) => {
    customTheme.value = data
    currentTheme.value = 'custom'
  }

  /** 清除自定义主题 */
  const clearCustomTheme = () => {
    customTheme.value = null
    // 恢复到默认主题
    currentTheme.value = 'vintage-paper'
  }

  /** 设置水印配置 */
  const setWatermarkConfig = (config: Partial<WatermarkConfig>) => {
    watermarkConfig.value = {
      ...watermarkConfig.value,
      ...config,
    }
  }

  return {
    currentTheme,
    mode,
    layout,
    customTheme,
    watermarkConfig,
    resolvedMode,
    isDark,
    themeData,
    availableThemes,
    setThemeName,
    setMode,
    setLayout,
    toggleTheme,
    applyTheme,
    setCustomTheme,
    clearCustomTheme,
    setWatermarkConfig,
  }
}, {
  persist: {
    pick: ['currentTheme', 'mode', 'layout', 'customTheme', 'watermarkConfig']
  }
})