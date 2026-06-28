import Taro from '@tarojs/taro'
import { apiReportSubscribe } from '../api'
import { SUBSCRIBE_TEMPLATE_IDS } from '../dict'

/**
 * 批量订阅引导与上报
 * 同时携带喂养+周报两个模板，accept 的上报后端累加配额
 */
export const requestSubscribeAndReport = async () => {
  if (process.env.TARO_ENV !== 'weapp') return

  const res = (await Taro.requestSubscribeMessage({
    tmplIds: SUBSCRIBE_TEMPLATE_IDS,
    entityIds: []
  } as any)) as Record<string, string>
  console.log('[subscribe] requestSubscribeMessage 回调:', res, '入参 tmplIds:', SUBSCRIBE_TEMPLATE_IDS)
  const accepted = SUBSCRIBE_TEMPLATE_IDS.filter(
    (tmplId) => res[tmplId] === 'accept'
  ).map((tmplId) => ({ templateId: tmplId, status: 'accept' as const }))
  if (accepted.length === 0) return
  await apiReportSubscribe(accepted)
}
