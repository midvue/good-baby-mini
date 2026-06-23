import { EnumPointStatus, EnumTriggerType } from './dict'

export interface Point {
  code: string
  title: string
  description: string
  id: string
  /** 积分分数 */
  points: number
  status: EnumPointStatus
  /** 触发方式 10:手动领取 20:自动到账 */
  triggerType: EnumTriggerType
  /** 任务类型 10:每日 20:一次性 30:行为触发 */
  taskType: string
}

/** 积分汇总 */
export interface PointSummary {
  /** 当前可用余额 */
  totalPoints: number
  /** 累计获得积分 */
  earnedPoints: number
  /** 累计消耗积分 */
  consumedPoints: number
}

/** 规则跳转配置 */
export interface RuleRoute {
  /** 跳转路径 */
  path: string
  /** 是否为 tabBar 页面 */
  isTab?: boolean
}
