<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import ApexCharts from 'apexcharts'
import { useChartTheme } from '@/composables/useChartTheme'
import type { ApexOptions } from 'apexcharts'
import type { SChartProps } from './types'

const props = withDefaults(defineProps<SChartProps>(), {
  type: 'line',
  height: 350,
})

// 深度合并对象配置：嵌套对象逐层合并，数组与原始值以 source 为准（source 为 undefined 时保留 target）
function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  const result: Record<string, any> = { ...target }
  for (const key of Object.keys(source)) {
    const sourceValue = source[key]
    const targetValue = target[key]
    const isPlainObject = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v)
    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      result[key] = deepMerge(targetValue, sourceValue)
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue
    }
  }
  return result as T
}

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ApexCharts | null = null

const { isDark, chartColors } = useChartTheme()

// 主题基础配置（不含 series）
const baseOptions = computed<ApexOptions>(() => {
  const colors = chartColors.value
  const themeMode = isDark.value ? 'dark' : 'light'

  return {
    chart: {
      type: props.type,
      width: props.width,
      height: props.height,
      background: 'transparent',
      fontFamily: 'inherit',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    theme: {
      mode: themeMode,
    },
    colors: colors.series,
    grid: {
      borderColor: colors.border,
    },
    tooltip: {
      theme: themeMode,
    },
    legend: {
      labels: {
        colors: colors.foreground,
      },
    },
    xaxis: {
      axisBorder: {
        color: colors.border,
      },
      axisTicks: {
        color: colors.border,
      },
      labels: {
        style: {
          colors: colors.mutedForeground,
        },
      },
    },
    yaxis: {
      axisBorder: {
        color: colors.border,
      },
      axisTicks: {
        color: colors.border,
      },
      labels: {
        style: {
          colors: colors.mutedForeground,
        },
      },
    },
  }
})

// 用户配置深度合并主题配置，props.series 始终优先
const mergedOptions = computed<ApexOptions>(() => {
  const merged = deepMerge(baseOptions.value, props.options ?? {})
  if (props.series) merged.series = props.series
  return merged
})

// 不含 series 的配置部分，用于主题/配置更新（避免与 updateSeries 重复更新）
const configOptions = computed<ApexOptions>(() => {
  const config = { ...mergedOptions.value }
  delete config.series
  return config
})

const seriesData = computed<ApexOptions['series']>(() => props.series ?? props.options?.series ?? [])

// 初始化图表
onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    chartInstance = new ApexCharts(chartRef.value, mergedOptions.value)
    chartInstance.render()
  }
})

// 监听配置/主题变化更新图表（关闭动画，避免主题切换时闪烁）
watch(
  configOptions,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.updateOptions(newOptions, true, false)
    }
  },
  { deep: true },
)

// 监听数据变化
watch(
  seriesData,
  (newSeries) => {
    if (chartInstance && newSeries) {
      chartInstance.updateSeries(newSeries)
    }
  },
  { deep: true },
)

// 清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

// 暴露图表实例方法
defineExpose({
  /** 获取图表实例 */
  getInstance: () => chartInstance,
  /** 更新配置 */
  updateOptions: (options: ApexOptions) => chartInstance?.updateOptions(options),
  /** 更新数据序列 */
  updateSeries: (series: ApexOptions['series']) => {
    if (chartInstance && series) {
      chartInstance.updateSeries(series)
    }
  },
  /** 重置数据序列 */
  resetSeries: () => chartInstance?.resetSeries(),
})
</script>

<template>
  <div ref="chartRef" class="w-full h-full min-h-[200px]" />
</template>
