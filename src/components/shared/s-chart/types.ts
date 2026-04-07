import type { ApexOptions } from 'apexcharts'

export type ChartType = 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'treemap'

export interface SChartProps {
  /** ApexCharts 配置选项 */
  options?: ApexOptions
  /** 图表类型 */
  type?: ChartType
  /** 图表宽度 */
  width?: string | number
  /** 图表高度 */
  height?: string | number
  /** 图表数据序列 */
  series?: ApexOptions['series']
}