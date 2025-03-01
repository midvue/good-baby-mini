/// <reference types="@tarojs/taro" />
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production'
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd'
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string
  }
}

declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3'
}

declare module '@umengfe/mini-apm' {
  export * from '@umengfe/mini-apm/build/wx.d.ts'
}

/** home主页地址 */
declare const ENV_HOME_URL: string
/** webview的地址 */
declare const ENV_WEBVIEW_URL: string

const META_ENV: {
  /** baseApi */
  BASE_URL: string
}
declare type MetaEnvType = typeof META_ENV

declare const META_ENV_MAP: {
  uat: MetaEnvType
  uat_option: MetaEnvType
  stg: MetaEnvType
  release: MetaEnvType
}
