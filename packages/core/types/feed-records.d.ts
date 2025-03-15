declare global {
  /** 尿布 */
  interface IDiaper {
    /** 尿布类型 */
    type: string | number
    /** 臭臭状态  */
    poopType: number
    /** 臭臭颜色  */
    poopColor: number
    /** 喂养时间  */
    feedTime: string
  }

  /** 奶粉 */
  interface IMilk {
    type: string | number
    feedTime: string
    volume: number
  }

  /** 身高体重 */
  interface IHeightWeight {
    /** 记录时间 */
    feedTime: string
    /** 身高 */
    height: number
    /** 体重 */
    weight: number
    /** 头尾 */
    headCircumference: number
    /** 脚长 */
    footLength: number
  }

  /** 喂养记录 */
  interface IFeedRecord {
    id: number
    /** 宝宝id */
    babyId: number
    feedType: string | number
    feedTime: string
    content: IMilk | IDiaper | IHeightWeight
    remark: string
    createTime: number
    updateTime: number
  }
}
export {}
