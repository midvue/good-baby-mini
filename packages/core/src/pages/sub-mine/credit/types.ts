import { EnumPointStatus } from './dict'

export interface Point {
  code: string
  description: string
  id: string
  /** 积分分数 */
  points: number
  status: EnumPointStatus
}
