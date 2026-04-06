import { computed, ref, watch, nextTick } from 'vue'
import { useAppStore } from '@/stores/modules/app'

export interface ChartColors {
  series: string[]
  background: string
  foreground: string
  mutedForeground: string
  border: string
  primary: string
}

/** 从 CSS 变量获取图表颜色（仅调用一次 getComputedStyle） */
export function getChartColors(): ChartColors {
  if (typeof document === 'undefined') {
    return { series: [], background: '', foreground: '', mutedForeground: '', border: '', primary: '' }
  }

  const style = getComputedStyle(document.documentElement)
  const getVar = (name: string) => style.getPropertyValue(name).trim()

  return {
    series: [
      getVar('--chart-1'),
      getVar('--chart-2'),
      getVar('--chart-3'),
      getVar('--chart-4'),
      getVar('--chart-5'),
    ],
    background: getVar('--background'),
    foreground: getVar('--foreground'),
    mutedForeground: getVar('--muted-foreground'),
    border: getVar('--border'),
    primary: getVar('--primary'),
  }
}

/** 图表主题 Hook - 响应式监听主题变化 */
export function useChartTheme() {
  const appStore = useAppStore()
  const refreshKey = ref(0)

  // 监听主题变化，appStore.applyTheme() 同步设置 CSS 变量
  // 使用 nextTick 确保 DOM 更新完成后再读取
  watch(
    [() => appStore.isDark, () => appStore.currentTheme, () => appStore.customTheme],
    () => {
      nextTick(() => {
        refreshKey.value++
      })
    },
    { immediate: false }
  )

  const chartColors = computed(() => {
    refreshKey.value // 建立响应式依赖
    return getChartColors()
  })

  return {
    chartColors,
    isDark: computed(() => appStore.isDark),
  }
}