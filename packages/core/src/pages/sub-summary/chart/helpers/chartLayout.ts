import Taro from '@tarojs/taro'
import { Chart } from '../../utils/chart'
import type { DataSet } from '../../utils/types'

const { windowWidth } = Taro.getSystemInfoSync()

export const getCanvasLayoutSync = () => ({ windowWidth })

export const SCROLLABLE_POINT_WIDTH = 34
export const SCROLLABLE_Y_AXIS_WIDTH = 44

export const getScrollableContentWidth = (length: number) => {
  const visibleContentWidth = Math.max(0, windowWidth - SCROLLABLE_Y_AXIS_WIDTH - 8)
  const pointContentWidth = Math.max(length - 1, 1) * SCROLLABLE_POINT_WIDTH + 80
  return Math.max(visibleContentWidth, pointContentWidth)
}

export const createXAxisShowFn = (length: number) => {
  const interval = Math.floor(length / 7)
  return (index: number) => length <= 7 || index % interval === 0
}

export const renderSplitCanvas = (
  feedType: string | number,
  chartConfig: Omit<DataSet, 'hideYAxis' | 'title'>,
  yAxisWidth: number,
  contentWidth: number
) => {
  new Chart().init(`${feedType}YAxisCanvas`, {
    hideYAxis: false,
    title: { text: '', color: '#333', size: 14 },
    ...chartConfig,
    chart: {
      ...chartConfig.chart,
      width: yAxisWidth,
      respectWidth: true,
      renderOnlyYAxis: true,
      showYAxisGridLines: false,
      yAxisAxisLeft: yAxisWidth
    }
  })
  new Chart().init(`${feedType}ContentCanvas`, {
    hideYAxis: false,
    title: { text: '', color: '#333', size: 14 },
    ...chartConfig,
    chart: {
      ...chartConfig.chart,
      width: contentWidth,
      respectWidth: true,
      renderOnlyContent: true,
      showYAxisLabels: false,
      showYAxisLine: false,
      axisLeft: 0
    }
  })
}
