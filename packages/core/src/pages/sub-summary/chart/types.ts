import { EnumFeedType } from '@/dict'

export interface IChartState {
  tabActive: EnumFeedType
  form: {
    startFeedTime: string
    endFeedTime: string
  }
}
