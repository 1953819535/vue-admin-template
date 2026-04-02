import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type ThemeMode = 'light' | 'dark' | 'system'

export const useAppStore = defineStore('app', () => {
  const theme = ref<ThemeMode>('system')

  // 计算实际应用的主题
  const resolvedTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })

  // 是否为暗色主题
  const isDark = computed(() => resolvedTheme.value === 'dark')

  // 设置主题
  const setTheme = (mode: ThemeMode) => {
    theme.value = mode
    applyTheme()
  }

  // 切换明暗
  const toggleTheme = () => {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  // 应用主题到 DOM
  const applyTheme = () => {
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return {
    theme,
    resolvedTheme,
    isDark,
    setTheme,
    toggleTheme,
    applyTheme,
  }
}, {
  persist: true,
})