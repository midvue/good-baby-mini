/** 页面类型 */
export enum EnumEnvVersion {
  /** stg环境 */
  STG = 'stg',
  /** uat 环境 (开发版,体验版默认uat) */
  UAT = 'uat',
  /** 生产环境 */
  RELEASE = 'release'
}

/** 页面类型 */
export enum EnumPageType {
  /**列表 */
  LIST = '10',
  /** 详情页 */
  DETAIL = '20'
}

/** 事件类型 */
export enum EnumEventType {
  /**刷新页面 */
  REFRESH = 'Refresh'
}

/** 喂养类型 */
export enum EnumFeedType {
  /**奶粉 */
  MILK = 10,
  /** 尿布 */
  DIAPER = 30,
  /** 身高体重 */
  HEIGHT_WEIGHT = 40
}
