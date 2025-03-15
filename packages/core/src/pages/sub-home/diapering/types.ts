export interface IFeedMilkState {
  feedType: number
  remark: string
  form: IDiaper
}

/** 尿布的form */
export interface IDiaper {
  /** 尿布类型 */
  type: string | number
  /** 臭臭状态  */
  poopType: string | number
  /** 臭臭颜色  */
  poopColor: string | number
  /** 喂养时间  */
  feedTime: string
  createTime?: number
  updateTime?: number
}
