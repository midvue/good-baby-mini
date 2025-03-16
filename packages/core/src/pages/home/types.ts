export interface FeedRecordResp {
  count: number
  list: IFeedRecord[]
}

export interface IHomeState {
  loading: boolean
  feedRecords: IFeedRecord[]
  babyInfo: BabyInfo
  pagination: {
    current: number
    size: number
    total: number
  }
}
