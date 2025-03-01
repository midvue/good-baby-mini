declare global {
  interface INavOption {
    delta?: number
    event?: {
      type: string
      data?: Record<string, any>
    } & Record<string, any>
    path: string
    query?: Record<string, any>
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: (res: TaroGeneral.CallbackResult) => void
    /** 接口调用失败的回调函数 */
    fail?: (res: TaroGeneral.CallbackResult) => void
    /** 接口调用成功的回调函数 */
    success?: (res: TaroGeneral.CallbackResult) => void
  }
}
export {}
