/**
 * 测量文字宽度，
 * Canvas宽度太大，微信提供的setTextAlign(center)
 * 方法并不能准确居中显示
 */
export function measureText(text: string, textSize: number) {
  let ratio = textSize / 20
  let texts = text.split('')
  let width = 0
  texts.forEach(function (item) {
    if (/[a-zA-Z]/.test(item)) {
      width += 14 * ratio
    } else if (/[0-9]/.test(item)) {
      width += 11 * ratio
    } else if (/\./.test(item)) {
      width += 5.4 * ratio
    } else if (/-/.test(item)) {
      width += 6.5 * ratio
    } else if (/[\u4e00-\u9fa5]/.test(item)) {
      width += 20 * ratio
    }
  })
  return width
}
/**
 * 计算Y轴显示刻度
 */
export function calculateY(dMin: number, dMax: number, iMaxAxisNum: number) {
  if (iMaxAxisNum < 1 || dMax < dMin) return [] as number[]

  let dDelta = dMax - dMin
  if (dDelta < 1.0) {
    dMax += (1.0 - dDelta) / 2.0
    dMin -= (1.0 - dDelta) / 2.0
  }
  dDelta = dMax - dMin

  let iExp = parseInt((Math.log(dDelta) / Math.log(10.0)).toString()) - 2
  let dMultiplier = Math.pow(10, iExp)
  let dSolutions = [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500]
  let i
  for (i = 0; i < dSolutions.length; i++) {
    let dMultiCal = dMultiplier * dSolutions[i]
    if (parseInt((dDelta / dMultiCal).toString()) + 1 <= iMaxAxisNum) {
      break
    }
  }

  let dInterval = dMultiplier * dSolutions[i]

  let dStartPoint = (parseInt((dMin / dInterval).toString()) - 1) * dInterval
  let yIndex = [] as number[]
  let iAxisIndex
  for (iAxisIndex = 1; true; iAxisIndex++) {
    let y = dStartPoint + dInterval * iAxisIndex
    yIndex.push(y)
    if (y > dMax) break
  }
  return yIndex
}
/**
 * 绘制虚线
 */
export function drawDashLine(ctx, x1, y1, x2, y2, dashLen) {
  dashLen = dashLen === undefined ? 4 : dashLen
  let beveling = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  let num = Math.floor(beveling / dashLen)

  ctx.beginPath()
  for (let i = 0; i < num; i++) {
    let x = x1 + ((x2 - x1) / num) * i
    let y = y1 + ((y2 - y1) / num) * i
    if (i % 2 == 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()
  ctx.closePath()
}
/**
 * 绘制圆角矩形
 */
export function drawRoundBar(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2)
  ctx.lineTo(width - radius + x, y)
  ctx.arc(width - radius + x, radius + y, radius, (Math.PI * 3) / 2, Math.PI * 2)
  ctx.lineTo(width + x, height + y - radius)
  ctx.arc(width - radius + x, height - radius + y, radius, 0, (Math.PI * 1) / 2)
  ctx.lineTo(radius + x, height + y)
  ctx.arc(radius + x, height - radius + y, radius, (Math.PI * 1) / 2, Math.PI)
  ctx.closePath()
  ctx.fill()
}

function requestAnimation(callback) {
  let that = this
  // 保证如果重复执行callback的话，callback的执行起始时间相隔16ms
  let currTime = new Date().getTime()
  let timeToCall = Math.max(0, 16 - (currTime - lastTime))
  let id = setTimeout(function () {
    callback(currTime + timeToCall)
  }, timeToCall)
  lastTime = currTime + timeToCall
  return id
}

function easeOut(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b
}
