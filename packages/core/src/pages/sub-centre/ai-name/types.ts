/**
 * 智能 取名请求参数
 */
export interface IAiNameReq {
  isBorn: string
  surname: string
  gender: string
  birthDate?: string
  birthTime?: string
  remark?: string
}

/**
 * 智能 取名响应结果
 */
export interface INameResponse {
  name: string
  desc: string
}

export interface NameState {
  form: IAiNameReq
}
