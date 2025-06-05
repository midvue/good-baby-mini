/** 单个图表配置 */
export interface ISerie {
  name: string
  category?: string
  data: (number | undefined)[]
  toolTips: {
    show: boolean | ((index: number) => boolean)
    formatter?: (params: any) => string
    offset?: number[]
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
}

export interface DataSet {
  hideYAxis: boolean
  title: Title
  legend?: Legend
  color: string[]
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
  // 修正拼写错误
  axisTop: number
}
