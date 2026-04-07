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

const chartRef = ref<HTMLDivElement | null>(null)
let chartInstance: ApexCharts | null = null

const { isDark, chartColors } = useChartTheme()

// 合并配置：用户配置 + 主题配置
const mergedOptions = computed<ApexOptions>(() => {
  const colors = chartColors.value
  const themeMode = isDark.value ? 'dark' : 'light'

  const baseOptions: ApexOptions = {
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
    series: props.series,
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

  // 合并用户配置
  return {
    ...baseOptions,
    ...props.options,
    chart: {
      ...baseOptions.chart,
      ...props.options?.chart,
    },
  } as ApexOptions
})

// 初始化图表
onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    chartInstance = new ApexCharts(chartRef.value, mergedOptions.value)
    chartInstance.render()
  }
})

// 监听配置变化更新图表
watch(
  mergedOptions,
  (newOptions) => {
    if (chartInstance) {
      chartInstance.updateOptions(newOptions, true, true, false)
    }
  },
  { deep: true }
)

// 监听数据变化
watch(
  () => props.series,
  (newSeries) => {
    if (chartInstance && newSeries) {
      chartInstance.updateSeries(newSeries)
    }
  },
  { deep: true }
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