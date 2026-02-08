import { EnumYesNoPlus } from '@mid-vue/shared'

/**
 * 智能 取名请求参数
 */
export interface IAiNameReq {
  /** 姓氏 */
  surname: string
  gender: string
  /** 上次查询的名字 */
  lastFindName?: string
  remark?: string
}

/**
 * 智能 取名响应结果
 */
export interface INameResponse {
  name: string
  desc: string
  gender: EnumYesNoPlus
  id: string
  isSelected: boolean
  spell: string
  origin: string
}

export interface NameState {
  form: IAiNameReq
  names: INameResponse[]
  selectedNames: string[]
}
