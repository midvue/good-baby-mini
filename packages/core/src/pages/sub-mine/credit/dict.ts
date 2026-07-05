import { type RuleRoute } from './types'

/**
 * 积分状态
 * 10 代表去完成，20 已完成 30 已领取
 */
export enum EnumPointStatus {
  /**
   * 未完成
   */
  UNCOMPLETED = '10',

  /**
   * 已完成未领取（待领取）
   */
  COMPLETED = '20',
  /**
   * 已领取/已完成
   */
  RECEIVED = '30'
}

/**
 * 触发方式
 */
export enum EnumTriggerType {
  /** 手动领取 */
  MANUAL = '10',
  /** 自动到账 */
  AUTO = '20'
}

/**
 * EnumPointStatus 写一个策略
 *
 */

export const pointStatusStrategy = {
  [EnumPointStatus.UNCOMPLETED]: {
    text: '去完成',
    type: 'warning',
    disabled: false
  },
  [EnumPointStatus.COMPLETED]: {
    text: '领取奖励',
    color: '#74DAE5',
    type: 'primary',
    disabled: false
  },
  [EnumPointStatus.RECEIVED]: {
    text: '已领取',
    type: 'info',
    disabled: true
  }
} as const

/**
 * 规则code到目标页面的跳转策略
 * key 为规则 code，value 为跳转配置
 */
export const ruleRouteStrategy: Record<string, RuleRoute> = {
  daily_feed: { path: '/pages/home/index', isTab: true },
  complete_profile: { path: '/pages/sub-mine/edit-me/index' }
}
