import { EnumFeedType } from '@/dict'

export interface IWeeklyDetail {
  count: number
  feedType: EnumFeedType
  total: number
}

export interface IWeekly {
  babyId: number
  count: number
  detailMap: Record<EnumFeedType, IWeeklyDetail>
}

export interface IWeeklyState {
  weekly: IWeekly
}
