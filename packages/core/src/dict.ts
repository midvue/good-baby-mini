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
  /**奶瓶喂养 */
  MILK_BOTTLE = 10,
  /** 母乳亲喂 */
  BREAST_FEED_DIRECT = 20,
  /** 尿布 */
  DIAPER = 30,
  /** 身高体重 */
  HEIGHT_WEIGHT = 40,
  /** 疫苗 */
  VACCINE = 50,
  /** 补剂 */
  SUPPLEMENT = 60,
  /** 睡眠 */
  SLEEP = 70,
  /** 辅食 */
  BABY_FOOD = 80
}
