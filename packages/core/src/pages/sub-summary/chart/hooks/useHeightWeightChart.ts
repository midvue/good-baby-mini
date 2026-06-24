import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { EnumYesNoPlus, useDate } from '@allkit/shared'
import { nextTick } from 'vue'
import { Chart, EnumLineType } from '../../utils/chart'
import { apiFeedRecordList } from '../api'
import {
  femaleHeadCircumference,
  femaleHeight,
  femaleWeight,
  headCircumferenceAgeLabels,
  headCircumferenceAgeMonths,
  heightWeightAgeLabels,
  heightWeightAgeMonths,
  maleHeadCircumference,
  maleHeight,
  maleWeight,
  type PercentileData
} from '../data'
import { EnumHeightWeightIndex } from '../dict'
import { type GrowthAxisData, type HeightWeightStrategy } from '../types'
import { createGrowthAxisData, getDisplayEndIndex } from '../helpers/heightWeightAxis'
import { getCanvasLayoutSync } from '../helpers/chartLayout'

const POINT_WIDTH = 40
const Y_AXIS_WIDTH = 34
const POINT_START_PADDING = 8
const POINT_END_PADDING = 8
const CHART_HEIGHT = 487

const getChartLayout = (labelCount: number) => {
  const { windowWidth } = getCanvasLayoutSync()
  const yAxisWidth = Y_AXIS_WIDTH
  const visibleWidth = Math.max(280, windowWidth - 8)
  const contentAreaWidth = Math.max(0, visibleWidth - yAxisWidth)
  const contentWidth = Math.max(
    contentAreaWidth,
    Math.max(labelCount - 1, 1) * POINT_WIDTH + POINT_START_PADDING + POINT_END_PADDING
  )

  return {
    width: visibleWidth,
    yAxisWidth,
    contentWidth,
    height: CHART_HEIGHT
  }
}

const syncChartLayout = (strategy: HeightWeightStrategy, labelCount: number) => {
  const layout = getChartLayout(labelCount)
  if (strategy.chartWidth) strategy.chartWidth.value = layout.width
  if (strategy.chartYAxisWidth) strategy.chartYAxisWidth.value = layout.yAxisWidth
  if (strategy.chartContentWidth) strategy.chartContentWidth.value = layout.contentWidth
  if (strategy.chartHeight) strategy.chartHeight.value = layout.height
  return layout
}

const shouldShowAgeLabel = (index: number, labelCount: number) => {
  if (labelCount <= 13) return true
  if (index === 0 || index === labelCount - 1) return true
  if (index < 12) return true
  return index % 3 === 0
}

export function useHeightWeightChart() {
  const appStore = useAppStore()
  let drawVersion = 0

  function renderHeightWeight(this: HeightWeightStrategy) {
    if (!this.data.value) return
    initChart.call(this, this.childCode.value, this.data.value, true)
  }

  async function initHeightWeight(this: HeightWeightStrategy) {
    const code = this.childCode.value

    if (this.data.value) {
      await initChart.call(this, code, this.data.value)
      return
    }

    const list = await apiFeedRecordList<IHeightWeight>({
      babyId: appStore.babyInfo.id,
      feedType: EnumFeedType.HEIGHT_WEIGHT
    })
    const { birthDate } = appStore.babyInfo
    const currMonth = useDate().diff(useDate(birthDate), 'month')
    if (this.currMonth) this.currMonth.value = currMonth

    this.data.value = createGrowthAxisData(list, birthDate)

    await initChart.call(this, code, this.data.value)
  }

  async function initChart(
    this: HeightWeightStrategy,
    code: string,
    axis: GrowthAxisData,
    immediate = false
  ) {
    const currentDrawVersion = ++drawVersion
    const isFemale = appStore.babyInfo.gender === EnumYesNoPlus.YES
    const heightData = isFemale ? femaleHeight : maleHeight
    const weightData = isFemale ? femaleWeight : maleWeight
    const headCircumferenceData = isFemale ? femaleHeadCircumference : maleHeadCircumference
    let seriesData: PercentileData | Record<string, number[]> = {}
    let yData: (number | undefined)[] = []
    let xAxisLabels: string[] = heightWeightAgeLabels
    let ageRows = heightWeightAgeMonths

    switch (code) {
      case EnumHeightWeightIndex.HEIGHT:
        seriesData = heightData
        yData = axis.heightArr
        xAxisLabels = heightWeightAgeLabels
        ageRows = heightWeightAgeMonths
        break
      case EnumHeightWeightIndex.WEIGHT:
        seriesData = weightData
        yData = axis.weightArr
        xAxisLabels = heightWeightAgeLabels
        ageRows = heightWeightAgeMonths
        break
      case EnumHeightWeightIndex.HEAD_CIRCUMFERENCE:
        seriesData = headCircumferenceData
        yData = axis.headCircumferenceArr
        xAxisLabels = headCircumferenceAgeLabels
        ageRows = headCircumferenceAgeMonths
        break
      default:
        seriesData = {}
        yData = []
        xAxisLabels = []
        ageRows = []
    }

    const currMonth = this.currMonth?.value || 0
    const displayEndMonth = currMonth < 12 ? 12 : currMonth + 3
    const endIndex = ageRows.length
      ? getDisplayEndIndex(ageRows, displayEndMonth)
      : xAxisLabels.length - 1
    const visibleLength = Math.max(endIndex + 1, 1)
    const visibleXAxisLabels = xAxisLabels.slice(0, visibleLength)
    const visibleYData = yData.slice(0, visibleLength)
    const layout = syncChartLayout(this, visibleXAxisLabels.length)
    if (!immediate) {
      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 16))
      if (currentDrawVersion !== drawVersion) return
    }

    const chartConfig = {
      chart: {
        ...layout,
        yAxisMarkCount: 7,
        yAxisPaddingRatio: 0.03,
        lineWidth: 1.8,
        showYAxisLabels: true,
        showYAxisLine: true,
        yAxisLabelWidth: Y_AXIS_WIDTH,
        axisLeft: Y_AXIS_WIDTH,
        pointOnTick: true,
        firstXAxisLabelOffset: 0,
        pointStartPadding: POINT_START_PADDING,
        pointEndPadding: POINT_END_PADDING,
        showXAxisTickPoints: true,
        xAxisTickPointRadius: 1.2
      },
      colors: [
        '#ED7672',
        '#F3AA59',
        '#74DAE5',
        '#1aad19',
        '#74DAE5',
        '#F3AA59',
        '#ED7672',
        '#180d41'
      ],
      xAxis: {
        data: visibleXAxisLabels,
        color: '#333',
        size: 12,
        show: (index: number) => shouldShowAgeLabel(index, visibleXAxisLabels.length)
      },
      series: [
        ...Object.keys(seriesData).map((key) => {
          const data = seriesData[key as keyof typeof seriesData].slice(0, visibleLength)
          return {
            name: key,
            category: 'line',
            type: EnumLineType.DASHED,
            toolTips: {
              show: (index: number) => index === data.length - 1,
              offset: [16, 10],
              formatter: () => key
            },
            data
          }
        }),
        {
          name: appStore.babyInfo.nickname,
          category: 'line',
          toolTips: {
            show: true
          },
          data: visibleYData
        }
      ]
    }

    await Promise.all([
      new Chart().init(this.yAxisCanvasId.value, {
        hideYAxis: false,
        title: { text: '', color: '#333', size: 14 },
        ...chartConfig,
        chart: {
          ...chartConfig.chart,
          width: layout.yAxisWidth,
          respectWidth: true,
          renderOnlyYAxis: true,
          showYAxisGridLines: false,
          yAxisAxisLeft: layout.yAxisWidth
        }
      }),
      new Chart().init(this.contentCanvasId.value, {
        hideYAxis: false,
        title: { text: '', color: '#333', size: 14 },
        ...chartConfig,
        chart: {
          ...chartConfig.chart,
          width: layout.contentWidth,
          respectWidth: true,
          renderOnlyContent: true,
          showYAxisLabels: false,
          showYAxisLine: false,
          axisLeft: 0
        }
      })
    ])
  }

  return {
    initHeightWeight,
    renderHeightWeight
  }
}
