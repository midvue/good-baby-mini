import Http from '@mid-vue/http-client'
import { type IPacketForm } from './components/packet-form/types'

/**
 * 红包记录接口
 * @param params 请求参数
 */
export const apiGetRedPacketList = (data = {}) => {
  return Http.post<{ list: IPacketForm[]; count: number }>({
    url: '/centre/redPacket/list',
    data
  })
}

/**
 * 删除红包
 */
export const apiDeleteRedPacket = (id: number) => {
  const option = {
    url: `/centre/redPacket/delete/?id=${id}`
  }
  return Http.delete(option)
}
