import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'

/**
 * 自定义主题 CSS 变量解析和管理的 Hook
 * 支持从 CSS 文本或 JSON URL 解析主题配置
 */
export function useCustomTheme() {
  const appStore = useAppStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 解析 CSS 变量文本，提取主题配置
   * 支持格式：
   * - :root { --var: value; }
   * - .dark { --var: value; }
   * - @theme inline { --var: value; }
   */
  function parseCssVars(cssText: string): {
    light: Record<string, string>
    dark: Record<string, string>
    theme: Record<string, string>
  } {
    const light: Record<string, string> = {}
    const dark: Record<string, string> = {}
    const theme: Record<string, string> = {}

    // 移除注释
    const cleanedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '')

    // 匹配块内容 - 支持嵌套的大括号
    const extractBlock = (css: string, selector: string): string => {
      const startIdx = css.indexOf(selector)
      if (startIdx === -1) return ''

      const braceStart = css.indexOf('{', startIdx)
      if (braceStart === -1) return ''

      let depth = 1
      let braceEnd = braceStart + 1
      while (braceEnd < css.length && depth > 0) {
        if (css[braceEnd] === '{') depth++
        else if (css[braceEnd] === '}') depth--
        braceEnd++
      }

      return css.slice(braceStart + 1, braceEnd - 1)
    }

    // 解析变量声明
    const parseVars = (content: string, target: Record<string, string>) => {
      const lines = content.split(';')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('--')) continue

        const colonIdx = trimmed.indexOf(':')
        if (colonIdx === -1) continue

        const key = trimmed.slice(0, colonIdx).trim().slice(2)
        const value = trimmed.slice(colonIdx + 1).trim()
        if (key && value) {
          target[key] = value
        }
      }
    }

    // 解析 :root 变量 (light 模式)
    const rootContent = extractBlock(cleanedCss, ':root')
    if (rootContent) parseVars(rootContent, light)

    // 解析 .dark 变量
    const darkContent = extractBlock(cleanedCss, '.dark')
    if (darkContent) parseVars(darkContent, dark)

    // 解析 @theme inline 变量
    const themeContent = extractBlock(cleanedCss, '@theme inline')
    if (themeContent) parseVars(themeContent, theme)

    return { light, dark, theme }
  }

  /**
   * 从 URL 获取主题配置 (支持 JSON 和 CSS 格式)
   */
  async function fetchFromUrl(url: string): Promise<string> {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
      }
      const text = await response.text()
      return text
    } catch (e) {
      const message = e instanceof Error ? e.message : '获取配置失败'
      error.value = message
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 解析 JSON 格式的主题数据 (tweakcn /r/ 格式)
   */
  function parseJsonTheme(jsonText: string): {
    light: Record<string, string>
    dark: Record<string, string>
    theme: Record<string, string>
  } | null {
    try {
      const data = JSON.parse(jsonText)
      if (data.cssVars) {
        return {
          light: data.cssVars.light || {},
          dark: data.cssVars.dark || {},
          theme: data.cssVars.theme || {},
        }
      }
    } catch {
      // 不是 JSON 格式，返回 null
    }
    return null
  }

  /**
   * 应用自定义主题
   */
  function applyCustomTheme(cssText: string, themeName?: string) {
    error.value = null

    // 先尝试解析 JSON 格式
    const jsonResult = parseJsonTheme(cssText)
    if (jsonResult) {
      appStore.setCustomTheme({
        name: themeName || 'custom',
        cssVars: jsonResult,
        rawCss: cssText,
      })
      return true
    }

    // 再解析 CSS 格式
    const { light, dark, theme } = parseCssVars(cssText)

    if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) {
      error.value = '未能解析出有效的主题配置'
      return false
    }

    appStore.setCustomTheme({
      name: themeName || 'custom',
      cssVars: { light, dark, theme },
      rawCss: cssText,
    })

    return true
  }

  /**
   * 从 URL 加载并应用主题
   */
  async function loadFromUrl(url: string, themeName?: string) {
    const text = await fetchFromUrl(url)
    return applyCustomTheme(text, themeName)
  }

  /**
   * 清除自定义主题
   */
  function clearCustomTheme() {
    appStore.clearCustomTheme()
  }

  const isCustomTheme = computed(() => appStore.currentTheme === 'custom')
  const customThemeCss = computed(() => appStore.customTheme?.rawCss || '')

  return {
    isLoading,
    error,
    isCustomTheme,
    customThemeCss,
    parseCssVars,
    applyCustomTheme,
    loadFromUrl,
    fetchFromUrl,
    clearCustomTheme,
  }
}