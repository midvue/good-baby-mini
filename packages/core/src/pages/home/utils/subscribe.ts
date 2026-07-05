import Taro from '@tarojs/taro'
import { apiReportSubscribe, type SubscribeStatus } from '../api'
import { SUBSCRIBE_TEMPLATE_IDS } from '../dict'

/** 微信回包实际会返回的 4 种 status 值 */
const VALID_STATUSES: SubscribeStatus[] = ['accept', 'reject', 'ban', 'filter']

/**
 * 批量订阅引导与上报
 * 同时携带喂养+周报两个模板，全量上报真实授权结果，后端按 accept 累加配额
 */
export const requestSubscribeAndReport = async () => {
  if (process.env.TARO_ENV !== 'weapp') return

  const res = await Taro.requestSubscribeMessage({
    tmplIds: SUBSCRIBE_TEMPLATE_IDS,
    entityIds: []
  })
  if (res.errMsg !== 'requestSubscribeMessage:ok') return

  const result = res as Taro.requestSubscribeMessage.SuccessCallbackResult
  console.log('[subscribe] 微信回包:', JSON.stringify(result))
  // 只保留微信明确返回了有效 status（accept/reject/ban/filter）的模板
  const list = SUBSCRIBE_TEMPLATE_IDS.filter((tmplId) =>
    VALID_STATUSES.includes(result[tmplId] as SubscribeStatus)
  ).map((tmplId) => ({ templateId: tmplId, status: result[tmplId] as SubscribeStatus }))
  console.log('[subscribe] 上报 list:', JSON.stringify(list))
  if (list.length === 0) return
  apiReportSubscribe(list)
}
