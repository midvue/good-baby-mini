import { type EnumFeedType } from '@/dict'

type SummaryEnumFeedType = {
  [key in EnumFeedType]?: {
    content: {
      duration: any
      label: string | number
      volume: number
    }
    count: number
    label: EnumFeedType
  }
}

export interface SummaryFeedRecord extends SummaryEnumFeedType {
  feedTime: string
  feedTimeStr: string
}
