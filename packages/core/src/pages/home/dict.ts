/**
 * 微信订阅消息模板 ID
 */
export enum EnumSubscribeTemplate {
  /** 喂养提醒（宝宝喂养消息提醒） */
  FEED_REMINDER = 'XoM2-Px0cYR6Jp8Rps37ChU3E6fI74H_2JC8-ot57Oo',
  /** 周报（宝宝喂养记录周报） */
  WEEKLY_REPORT = 'eqv7oJX9-J_rLHRa090RMYdYownIdWLaPGO1EjH8h58'
}

/** 批量订阅时同时携带的模板列表 */
export const SUBSCRIBE_TEMPLATE_IDS = [
  EnumSubscribeTemplate.FEED_REMINDER,
  EnumSubscribeTemplate.WEEKLY_REPORT
]
