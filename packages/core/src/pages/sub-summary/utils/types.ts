/** 单个图表配置 */
export interface ISerie {
  name: string
  category?: string
  data: (number | undefined)[]
  toolTips: {
    show: boolean | ((index: number) => boolean)
    formatter?: (params: any) => string
    offset?: number[]
    color?: string
  }
  // 新增 type 属性，用于指定线条类型
  type?: 'solid' | 'dashed'
}

// 新增类型定义
interface Title {
  color: string
  size: number
  text: string
}

interface Legend {
  color: string
  size: number
}

interface XAxis {
  color: string
  size: number
  data: any[]
  show?: boolean | ((index: number) => boolean)
}

interface ChartLayout {
  width?: number
  scrollContentWidth?: number
  scrollLeft?: number
  height?: number
  respectWidth?: boolean
  yAxisMarkCount?: number
  yAxisPaddingRatio?: number
  yAxisMinValue?: number
  yAxisInteger?: boolean
  lineWidth?: number
  renderOnlyYAxis?: boolean
  renderOnlyContent?: boolean
  showYAxisLabels?: boolean
  showYAxisLine?: boolean
  showYAxisGridLines?: boolean
  yAxisLabelWidth?: number
  axisLeft?: number
  yAxisAxisLeft?: number
  yAxisTextSpace?: number
  pointOnTick?: boolean
  firstXAxisLabelOffset?: number
  pointStartPadding?: number
  pointEndPadding?: number
  showXAxisTickPoints?: boolean
  xAxisTickPointRadius?: number
}

export interface DataSet {
  hideYAxis: boolean
  title: Title
  legend?: Legend
  chart?: ChartLayout
  colors: string[]
  xAxis: XAxis
  series: ISerie[]
}

// 新增 ChartOpt 接口
export interface ChartOpt {
  chartPieCount: number
  hideXYAxis: boolean
  axisYMarks: number[]
  barLength: number
  barNum: number
  lineColor: string
  bgColor: string
  chartWidth: number
  chartHeight: number
  legendWidth: number
  legendHeight: number
  chartSpace: number
  textSpace: number
  top: number
  left: number
  right: number
  bottom: number
  axisLeft: number
  axisBottom: number
  scrollContentWidth?: number
  scrollLeft?: number
  // 修正拼写错误
  axisTop: number
}
