import Taro from '@tarojs/taro'
import { Chart } from '../../utils/chart'
import type { DataSet } from '../../utils/types'

const { windowWidth } = Taro.getSystemInfoSync()

export const getCanvasLayoutSync = () => ({ windowWidth })

export const CHART_Y_AXIS_WIDTH = 44

/** x 轴每个日期标签的预估宽度（px），用于计算不重叠的标签间隔 */
const X_AXIS_LABEL_WIDTH = 36

/**
 * 获取图表内容区宽度（始终一屏，不滚动）
 */
export const getScrollableContentWidth = (_length: number) => {
  return Math.max(0, windowWidth - CHART_Y_AXIS_WIDTH - 8)
}

/**
 * 根据可视宽度和数据点数量，计算 x 轴标签的显示间隔，避免重叠
 */
export const createXAxisShowFn = (length: number) => {
  const visibleContentWidth = Math.max(0, windowWidth - CHART_Y_AXIS_WIDTH - 8)
  const maxLabels = Math.max(1, Math.floor(visibleContentWidth / X_AXIS_LABEL_WIDTH))
  const interval = Math.max(1, Math.ceil(length / maxLabels))
  return (index: number) => length <= maxLabels || index % interval === 0
}

export const renderSplitCanvas = async (
  feedType: string | number,
  chartConfig: Omit<DataSet, 'hideYAxis' | 'title'>,
  yAxisWidth: number,
  contentWidth: number,
  canvasIds?: {
    yAxisCanvasId: string
    contentCanvasId: string
  }
) => {
  await Promise.all([
    new Chart().init(canvasIds?.yAxisCanvasId || `${feedType}YAxisCanvas`, {
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
    }),
    new Chart().init(canvasIds?.contentCanvasId || `${feedType}ContentCanvas`, {
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
  ])
}
