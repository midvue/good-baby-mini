import http from '@allkit/http-client'
import { type IPacketForm } from './types'

/**
 * 添加红包
 */
export const apiPacketCreate = (data: Partial<IPacketForm>) => {
  const option = {
    url: '/centre/redPacket/create',
    data
  }
  return http.post<IPacketForm>(option)
}

/**
 * 更新红包
 */
export const apiPacketUpdate = (data: Partial<IPacketForm>) => {
  const option = {
    url: '/centre/redPacket/update',
    data
  }
  return http.put(option)
}
