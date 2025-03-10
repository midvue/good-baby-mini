declare global {
  /** 喂养记录 */
  interface IFeedRecord {
    id: number
    /** 宝宝id */
    babyId: number
    feedType: string | number
    feedTime: string
    content: Record<string, any>
    remark: string
    createTime: number
    updateTime: number
  }
}
export {}
