import { type EnumFeedType } from '@/dict'

export interface FeedRecordResp {
  count: number
  list: IFeedRecord[]
}

type SummaryEnumFeedType = {
  [key in EnumFeedType]?: {
    content: { label: string | number; volume: number }
    count: number
    label: EnumFeedType
  }
}

export interface SummaryFeedRecord extends SummaryEnumFeedType {
  feedTime: string
  feedTimeStr: string
}
