export interface IFeedRecord {
  id: number
  type: string | number
  feedTime: string
  content: string
  remark: string
  createTime: number
  updateTime: number
}

export interface FeedRecordResp {
  count: number
  list: IFeedRecord[]
}

export interface IFeedMilkState {
  form: IFeedRecord & {
    milk: {
      amount: number
      type: number
    }
  }
}
