import { EnumFeedType } from '@/dict'
import { useAppStore } from '@/stores'
import { EnumYesNoPlus, useDate } from '@allkit/shared'
import Taro from '@tarojs/taro'
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

type GrowthAxisData = {
  heightArr: (number | undefined)[]
  weightArr: (number | undefined)[]
  headCircumferenceArr: (number | undefined)[]
  footLengthArr: (number | undefined)[]
}

type HeightWeightStrategy = {
  data: { value: GrowthAxisData | undefined }
  childCode: { value: string }
  chartWidth?: { value: number }
  chartYAxisWidth?: { value: number }
  chartContentWidth?: { value: number }
  chartHeight?: { value: number }
  orientation?: { value: 'portrait' | 'landscape' }
  windowSize?: { value: { windowWidth: number; windowHeight: number } }
  safeAreaInsets?: { value: { top: number; right: number; bottom: number; left: number } }
  currMonth?: { value: number }
}

const POINT_WIDTH = 40
const Y_AXIS_WIDTH = 34
const POINT_START_PADDING = 8
const POINT_END_PADDING = 24
const PORTRAIT_HEIGHT_RATIO = 1.3

const hasMeasurement = (value: unknown) => value !== undefined && value !== null && value !== ''

const findNearestAgeIndex = (ageRows: number[], month: number) => {
  let nearestIndex = 0
  let nearestDistance = Number.POSITIVE_INFINITY

  ageRows.forEach((ageMonth, index) => {
    const distance = Math.abs(ageMonth - month)
    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestIndex = index
    }
  })

  return nearestIndex
}

const getDisplayEndIndex = (ageRows: number[], month: number) => {
  const cappedMonth = Math.min(Math.max(month, 0), ageRows[ageRows.length - 1])
  for (let index = ageRows.length - 1; index >= 0; index--) {
    if (ageRows[index] <= cappedMonth) return index
  }
  return 0
}

const getRoundedAgeMonth = (feedTime: string, birthDate: string) => {
  const feedDate = useDate(feedTime)
  let month = feedDate.diff(useDate(birthDate), 'month')
  const sameMonthTargetDate = useDate(birthDate).add(month, 'month')
  const diffDays = feedDate.diff(sameMonthTargetDate, 'day')

  if (diffDays > 15) {
    month += 1
  }

  return month
}

const getChartLayout = (
  labelCount: number,
  orientation: 'portrait' | 'landscape',
  windowSize?: { windowWidth: number; windowHeight: number },
  safeAreaInsets?: { top: number; right: number; bottom: number; left: number }
) => {
  const { windowWidth, windowHeight } = windowSize || Taro.getSystemInfoSync()
  const yAxisWidth =
    orientation === 'landscape' ? Y_AXIS_WIDTH + (safeAreaInsets?.left || 0) : Y_AXIS_WIDTH
  const rightSafeInset = orientation === 'landscape' ? safeAreaInsets?.right || 0 : 0
  const visibleWidth = Math.max(280, windowWidth - rightSafeInset - 8)
  const contentAreaWidth = Math.max(0, visibleWidth - yAxisWidth)
  const contentWidth = Math.max(
    contentAreaWidth,
    Math.max(labelCount - 1, 1) * POINT_WIDTH + POINT_START_PADDING + POINT_END_PADDING
  )
  const chartHeight = orientation === 'landscape' ? windowHeight : windowWidth * PORTRAIT_HEIGHT_RATIO

  return {
    width: visibleWidth,
    yAxisWidth,
    contentWidth,
    height: chartHeight
  }
}

const syncChartLayout = (strategy: HeightWeightStrategy, labelCount: number) => {
  const layout = getChartLayout(
    labelCount,
    strategy.orientation?.value || 'portrait',
    strategy.windowSize?.value,
    strategy.safeAreaInsets?.value
  )
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

    this.data.value = list.reduce<GrowthAxisData>(
      (axis, feedRecord) => {
        const month = getRoundedAgeMonth(feedRecord.feedTime, birthDate)
        const heightWeightIndex = findNearestAgeIndex(heightWeightAgeMonths, month)
        const headCircumferenceIndex = findNearestAgeIndex(headCircumferenceAgeMonths, month)
        const { content } = feedRecord

        if (hasMeasurement(content.height)) {
          axis.heightArr[heightWeightIndex] = Number(content.height)
        }
        if (hasMeasurement(content.weight)) {
          axis.weightArr[heightWeightIndex] = Number(content.weight)
        }
        if (hasMeasurement(content.headCircumference)) {
          axis.headCircumferenceArr[headCircumferenceIndex] = Number(content.headCircumference)
        }
        if (hasMeasurement(content.footLength)) {
          axis.footLengthArr[heightWeightIndex] = Number(content.footLength)
        }

        return axis
      },
      {
        heightArr: new Array(heightWeightAgeMonths.length).fill(undefined),
        weightArr: new Array(heightWeightAgeMonths.length).fill(undefined),
        headCircumferenceArr: new Array(headCircumferenceAgeMonths.length).fill(undefined),
        footLengthArr: new Array(heightWeightAgeMonths.length).fill(undefined)
      }
    )

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
      case EnumHeightWeightIndex.FOOT_LENGTH:
        seriesData = {}
        yData = axis.footLengthArr
        xAxisLabels = heightWeightAgeLabels
        ageRows = heightWeightAgeMonths
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
      hideYAxis: false,
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
      title: {
        text: '',
        color: '#333333',
        size: 15
      },
      xAxis: {
        color: '#666A73',
        size: 10,
        data: visibleXAxisLabels,
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

    new Chart().init(`${EnumFeedType.HEIGHT_WEIGHT}YAxisCanvas`, {
      ...chartConfig,
      chart: {
        ...chartConfig.chart,
        width: layout.yAxisWidth,
        respectWidth: true,
        renderOnlyYAxis: true,
        showYAxisGridLines: false,
        yAxisAxisLeft: layout.yAxisWidth
      }
    })
    new Chart().init(`${EnumFeedType.HEIGHT_WEIGHT}ContentCanvas`, {
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
  }

  return {
    initHeightWeight,
    renderHeightWeight
  }
}
