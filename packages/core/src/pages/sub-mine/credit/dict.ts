/**
 * 积分状态
 * 10 代表去完成，20 已完成 30 已领取 40 已过期
 */
export enum EnumPointStatus {
  /**
   * 未完成
   */
  UNCOMPLETED = '10',

  /**
   * 已完成未领取
   */
  COMPLETED = '20',
  /**
   * 已领取
   */
  RECEIVED = '30',
  /**
   * 已过期
   */
  EXPIRED = '40'
}

/**
 * EnumPointStatus 写一个策略
 *
 */

export let pointStatusStrategy = {
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
  },
  [EnumPointStatus.EXPIRED]: {
    text: '已过期',
    color: '#ED7672',
    type: 'info',
    disabled: true
  }
} as const
