import type { ApexOptions } from 'apexcharts'

/** 创建带单位的坐标轴格式化器 */
function createAxisFormatters(suffix: string) {
  return {
    yaxis: {
      labels: {
        formatter: (val: number) => `${val}${suffix}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}${suffix}`,
      },
    },
  }
}

/** 折线图 - 收入趋势 */
export const revenueLineOptions: ApexOptions = {
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: {
    size: 4,
  },
  xaxis: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  ...createAxisFormatters('$'),
}

export const revenueSeries = [{
  name: '收入',
  data: [1200, 1500, 1100, 2100, 2400, 2800],
}]

/** 面积图 - 用户增长 */
export const userAreaOptions: ApexOptions = {
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月'],
  },
  ...createAxisFormatters('人'),
}

export const userSeries = [{
  name: '新增用户',
  data: [120, 180, 150, 220, 280, 350],
}]

/** 柱状图 - 月度销售 */
export const salesBarOptions: ApexOptions = {
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '60%',
    },
  },
  xaxis: {
    categories: ['产品A', '产品B', '产品C', '产品D', '产品E'],
  },
  ...createAxisFormatters('件'),
}

export const salesSeries = [{
  name: '销量',
  data: [420, 380, 290, 520, 180],
}]

/** 环形图 - 销售分类占比 */
export const categoryDonutOptions: ApexOptions = {
  labels: ['电子产品', '服装配饰', '家居用品', '食品饮料', '其他'],
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
  },
}

export const categorySeries = [35, 25, 20, 15, 5]

/** 雷达图 - 多维度指标 */
export const metricsRadarOptions: ApexOptions = {
  xaxis: {
    categories: ['营收', '用户增长', '转化率', '满意度', '留存率', '市场份额'],
  },
  yaxis: {
    max: 100,
  },
}

export const metricsSeries = [{
  name: '本月',
  data: [85, 62, 78, 90, 75, 55],
}, {
  name: '上月',
  data: [70, 55, 65, 80, 60, 45],
}]