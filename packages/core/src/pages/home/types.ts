import { type SummaryFeedRecord } from '@/components/feed-record'

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
