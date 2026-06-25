import { EnumFeedType } from '@/dict'

export interface IChartState {
  tabActive: EnumFeedType
  form: {
    startFeedTime: string
    endFeedTime: string
  }
}

export type GrowthAxisData = {
  heightArr: (number | undefined)[]
  weightArr: (number | undefined)[]
  headCircumferenceArr: (number | undefined)[]
}

export type HeightWeightStrategy = {
  data: { value: GrowthAxisData | undefined }
  childCode: { value: string }
  yAxisCanvasId: { value: string }
  contentCanvasId: { value: string }
  chartWidth?: { value: number }
  chartContentWidth?: { value: number }
  currMonth?: { value: number }
}
