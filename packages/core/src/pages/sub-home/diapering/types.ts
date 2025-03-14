export interface IMilk {
  type: string | number
  feedTime: string
  volume: number
  createTime: number
  updateTime: number
}

export interface IFeedMilkState {
  feedType: number
  remark: string
  form: IMilk
}
