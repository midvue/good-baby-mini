import { EnumFeedType } from '@/dict'

export interface IWeeklyDetail {
  /** 总次数 */
  count: number
  feedType: EnumFeedType
  /** 总喂养量 */
  total: number
  /** 日均喂养量 */
  avg?: number
  /** 日最大次数 */
  dailyMaxCount?: number
  /** 每日最大总喂养量 */
  dailyMaxTotal?: number
  /** 喂养时长(母乳) */
  duration?: number
  /** 每日最大母乳喂养时间 */
  dailyMaxDuration?: number
  /** 记录的天数 */
  days?: number
  /** 最大次数日期 */
  maxCountDate?: string
  /** 最大喂养量日期 */
  maxTotalDate?: string
  /** 最大喂养时长日期 */
  maxDurationDate?: string
}

export interface IWeekly {
  babyId: number
  count: number
  detailMap: Record<EnumFeedType, IWeeklyDetail>
}

export interface IWeeklyState {
  weekly: IWeekly
}
