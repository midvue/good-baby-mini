import { EnumFeedType } from '@/dict'

export interface FeedRecordResp {
  count: number
  list: IFeedRecord[]
}

export interface IHomeState {
  loading: boolean
  feedRecords: (IFeedRecord | SummaryFeedRecord)[]
  pagination: {
    current: number
    size: number
    total: number
  }
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
