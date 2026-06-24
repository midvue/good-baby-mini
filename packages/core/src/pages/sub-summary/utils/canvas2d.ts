import Taro from '@tarojs/taro'

export type Canvas2DNode = {
  width: number
  height: number
  getContext: (type: '2d') => CanvasRenderingContext2D | null
}

export type Canvas2DHandle = {
  canvas: Canvas2DNode
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  dpr: number
}

type CanvasQueryResult = {
  node?: Canvas2DNode
  width?: number
  height?: number
}

export const getCanvas2DHandle = (canvasId: string): Promise<Canvas2DHandle | null> => {
  return new Promise((resolve) => {
    Taro.createSelectorQuery()
      .select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        const result = res?.[0] as CanvasQueryResult | undefined
        const canvas = result?.node
        const width = result?.width || 0
        const height = result?.height || 0
        if (!canvas || width <= 0 || height <= 0) {
          resolve(null)
          return
        }

        const dpr = Taro.getSystemInfoSync().pixelRatio || 1
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(null)
          return
        }

        ctx.scale(dpr, dpr)
        resolve({ canvas, ctx, width, height, dpr })
      })
  })
}

export const canvas2DToTempFilePath = (
  canvas: Canvas2DNode
): Promise<Taro.canvasToTempFilePath.SuccessCallbackResult> => {
  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      canvas: canvas as any,
      success: resolve,
      fail: reject
    } as any)
  })
}
