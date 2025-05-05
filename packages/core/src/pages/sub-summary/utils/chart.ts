import Taro from '@tarojs/taro'
import * as util from './chartUtils'
import { ISerie } from './types'
import { isNullOrUnDef } from '@mid-vue/shared'
let canvasId = ''
let chartOpt = {
  chartPieCount: 0,
  hideXYAxis: false,
  axisYMarks: [] as number[],
  barLength: 0,
  barNum: 0,
  // bgColor: "transparent",
  lineColor: '#c2c2c2',
  bgColor: '#ffffff',
  chartWidth: 0,
  chartHeight: 0,
  legendWidth: 0,
  legendHeight: 0,
  chartSpace: 10,
  textSpace: 5,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  axisLeft: 0,
  axisBottom: 0,
  axisTop: 0
}
let dataSet = {
  hideYAxis: false,
  title: {
    color: '#394655',
    size: 16,
    text: ''
  },
  legend: {
    color: '',
    size: 12
  },
  color: [
    '#74DAE5',
    '#394655',
    '#FEE746',
    '#B9A39B',
    '#C18734',
    '#9EC3AD',
    '#6D9BA3',
    '#7E9C82',
    '#DAEE59',
    '#CFDCED'
  ],
  xAxis: {
    color: '#666A73',
    size: 10,
    data: []
  },
  series: [
    {
      name: '',
      category: 'bar',
      data: []
    },
    {
      name: '',
      category: 'line',
      data: []
    }
  ]
}

export function init(canvasId: string, data) {
  canvasId = canvasId
  checkData(data)

  let ctx = initCanvas(canvasId)
  drawChart(ctx)
}
/**
 * 初始化Canvas
 */
function initCanvas(canvasId: string) {
  let ctx = Taro.createCanvasContext(canvasId)
  let Sys = Taro.getSystemInfoSync()

  chartOpt.chartWidth = Sys.windowWidth
  chartOpt.chartHeight = Sys.windowWidth * 1.3 //Canvas组件的宽高比

  chartOpt.legendWidth = dataSet.legend.size * 1.3
  chartOpt.legendHeight = dataSet.legend.size * 0.8

  chartOpt.top = chartOpt.left = chartOpt.chartSpace
  chartOpt.right = chartOpt.chartWidth - chartOpt.chartSpace
  chartOpt.bottom = chartOpt.chartHeight - chartOpt.chartSpace

  //3个数字的文字长度
  let textWidth = util.measureText('100', dataSet.xAxis.size)
  let legendHeight = dataSet.series.length > 1 ? chartOpt.legendHeight + chartOpt.chartSpace * 2 : 0

  chartOpt.axisLeft = chartOpt.left + (dataSet.hideYAxis ? 0 : textWidth + chartOpt.textSpace)
  chartOpt.axisBottom = chartOpt.bottom - dataSet.xAxis.size - chartOpt.textSpace - legendHeight
  chartOpt.axisTop = chartOpt.top + dataSet.title.size + chartOpt.textSpace + dataSet.xAxis.size * 2
  return ctx
}
/**
 * 检查并更新图表数据
 */
function checkData(data) {
  if (data.title != undefined) {
    if (data.title.color != undefined && data.title.color != '') {
      dataSet.title.color = data.title.color
    }
    dataSet.title.text = data.title.text
  }
  if (data.color != undefined && data.color != [] && data.color.length > 0) {
    dataSet.color = data.color
  }
  dataSet.xAxis.data = data.xAxis.data

  dataSet.series = data.series

  let values = new Array()
  for (let i = 0; i < dataSet.series.length; i++) {
    let item = dataSet.series[i]
    let itemLength = item.data.length
    if (itemLength > chartOpt.barLength) {
      chartOpt.barLength = itemLength
    }
    for (let k = 0; k < itemLength; k++) {
      if (item.data[k] != undefined) {
        values.push(item.data[k])
      }
    }
    if (item.category == 'bar') {
      chartOpt.barNum += 1
    }
    if (item.category == 'pie') {
      chartOpt.hideXYAxis = true
      for (let k = 0; k < itemLength; k++) {
        chartOpt.chartPieCount += item.data[k]
      }
    }
  }

  let minNum = Math.min.apply(null, values)
  let maxNum = Math.max.apply(null, values)
  //计算Y轴刻度尺数据
  chartOpt.axisYMarks = util.calculateY(minNum, maxNum, 5)
}
/**
 * 绘制图表
 */
function drawChart(ctx: Taro.CanvasContext) {
  drawBackground(ctx)
  drawTitle(ctx)
  drawLegend(ctx)
  if (!chartOpt.hideXYAxis) {
    drawXAxis(ctx)
    drawYAxis(ctx)
  }

  // drawBarChart(ctx);
  drawCharts(ctx)
  ctx.draw()
}
/**
 * 绘制图表背景
 */
function drawBackground(ctx: Taro.CanvasContext) {
  if (chartOpt.bgColor != '' && chartOpt.bgColor != 'transparent') {
    ctx.setFillStyle(chartOpt.bgColor)
    ctx.fillRect(0, 0, chartOpt.chartWidth, chartOpt.chartHeight)
  }
}
/**
 * 绘制标题
 */
function drawTitle(ctx: Taro.CanvasContext) {
  let title = dataSet.title
  if (title.text != '') {
    let textWidth = util.measureText(title.text, title.size)
    ctx.setFillStyle(title.color)
    ctx.setFontSize(title.size)
    ctx.setTextAlign('left')
    ctx.fillText(title.text, (chartOpt.chartWidth - textWidth) / 2, chartOpt.top + title.size)
  }
}
/**
 * 绘制X轴刻度尺
 */
function drawXAxis(ctx: Taro.CanvasContext) {
  //绘制X轴横线
  ctx.setLineWidth(0.5)
  ctx.setLineCap('round')
  ctx.moveTo(chartOpt.axisLeft, chartOpt.axisBottom)
  ctx.lineTo(chartOpt.right, chartOpt.axisBottom)
  ctx.stroke()

  let width = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength
  let data = dataSet.xAxis.data
  //绘制X轴显示文字
  for (let i = 0; i < data.length; i++) {
    let textX = width * (i + 1) - width / 2 + chartOpt.axisLeft
    ctx.setFillStyle(dataSet.xAxis.color)
    ctx.setFontSize(dataSet.xAxis.size)
    ctx.setTextAlign('center')
    ctx.fillText(data[i], textX, chartOpt.axisBottom + dataSet.xAxis.size + chartOpt.textSpace)
  }
}
/**
 * 绘制Y轴刻度尺
 */
function drawYAxis(ctx: Taro.CanvasContext) {
  //绘制Y轴横线
  ctx.setLineWidth(0.5)
  ctx.setLineCap('round')

  let height = (chartOpt.axisBottom - chartOpt.axisTop) / (chartOpt.axisYMarks.length - 1)

  //绘制Y轴显示数字
  for (let i = 0; i < chartOpt.axisYMarks.length; i++) {
    let y = chartOpt.axisBottom - height * i
    if (i > 0) {
      ctx.setStrokeStyle(chartOpt.lineColor)
      util.drawDashLine(ctx, chartOpt.axisLeft, y, chartOpt.right, y)
    }

    if (!dataSet.hideYAxis) {
      ctx.setFillStyle(dataSet.xAxis.color)
      ctx.setFontSize(dataSet.xAxis.size)
      ctx.setTextAlign('right')
      ctx.fillText(
        chartOpt.axisYMarks[i],
        chartOpt.axisLeft - chartOpt.textSpace,
        y + chartOpt.textSpace
      )
    }
  }
}

/**
 * 绘制图例
 */
function drawLegend(ctx: Taro.CanvasContext) {
  let series = dataSet.series

  for (let i = 0; i < series.length; i++) {
    let names = series[i].name
    let isPie = series[i].category == 'pie'
    let textWidth = util.measureText(isPie ? names[0] : names, dataSet.xAxis.size)
    let legendWidth = chartOpt.legendWidth + textWidth + chartOpt.chartSpace * 2
    let startX =
      chartOpt.chartWidth / 2 - (legendWidth * (isPie ? names.length : series.length)) / 2

    if (series[i].category == 'pie') {
      for (let k = 0; k < names.length; k++) {
        let x = startX + legendWidth * k
        let y = chartOpt.bottom - chartOpt.legendHeight

        ctx.setFillStyle(dataSet.xAxis.color)
        ctx.setFontSize(dataSet.legend.size)
        ctx.setTextAlign('left')
        ctx.fillText(names[k], x + chartOpt.textSpace + chartOpt.legendWidth, chartOpt.bottom)

        let color = getColor(k)
        ctx.setFillStyle(color)
        ctx.fillRect(x, y + 1, chartOpt.legendWidth, chartOpt.legendHeight)
      }
    } else {
      let x = startX + legendWidth * i + chartOpt.legendWidth * i
      let y = chartOpt.bottom - chartOpt.legendHeight

      ctx.setFillStyle(dataSet.xAxis.color)
      ctx.setFontSize(dataSet.legend.size)
      ctx.setTextAlign('left')
      ctx.fillText(series[i].name, x + chartOpt.chartSpace + chartOpt.legendWidth, chartOpt.bottom)

      let color = getColor(i)
      ctx.setFillStyle(color)
      ctx.setLineWidth(2)
      ctx.setStrokeStyle(color)
      if (series[i].category == 'bar') {
        ctx.fillRect(x, y + 1, chartOpt.legendWidth, chartOpt.legendHeight)
      } else if (series[i].category == 'line') {
        let lx = x + chartOpt.legendWidth / 2
        let ly = y + chartOpt.legendHeight / 2 + 1
        ctx.beginPath()
        ctx.moveTo(x, ly)
        ctx.lineTo(x + chartOpt.legendWidth, ly)
        ctx.stroke()
        ctx.closePath()
        drawPoint(ctx, lx, ly, chartOpt.legendHeight / 2, color)
        drawPoint(ctx, lx, ly, chartOpt.legendHeight / 4, chartOpt.bgColor)
      }
    }
  }
}
/**
 * 绘制数据标签
 */
function drawToolTips(ctx: Taro.CanvasContext, text: string, x, y, color) {
  ctx.setFillStyle(color)
  ctx.setFontSize(dataSet.xAxis.size)
  ctx.setTextAlign('center')
  ctx.fillText(text, x, y)
}
/**
 * 画图
 */
function drawCharts(ctx: Taro.CanvasContext) {
  let series = dataSet.series
  for (let i = 0; i < series.length; i++) {
    let category = series[i].category
    let barWidth = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength
    let barHeight = chartOpt.axisBottom - chartOpt.axisTop
    let maxMark = chartOpt.axisYMarks[chartOpt.axisYMarks.length - 1]

    if (category == 'bar') {
      barWidth = barWidth - chartOpt.chartSpace
      drawBarChart(ctx, i, series, barWidth, barHeight, maxMark)
    } else if (category == 'line') {
      drawLineChart(ctx, i, series, barWidth, barHeight)
    } else if (category == 'pie') {
      drawPieChart(ctx, i, series)
    }
  }
}
/**
 * 绘制柱状图
 */
function drawBarChart(ctx, i, series, barWidth, barHeight, maxMark) {
  let item = series[i]
  let itemWidth = barWidth / chartOpt.barNum

  for (let k = 0; k < item.data.length; k++) {
    let itemHeight = barHeight * (item.data[k] / maxMark)
    let x =
      barWidth * k +
      chartOpt.axisLeft +
      k * chartOpt.chartSpace +
      chartOpt.chartSpace / 2 +
      i * itemWidth
    let y = chartOpt.axisBottom - itemHeight
    let color = getColor(series.length <= 1 ? k : i)
    ctx.setFillStyle(color)
    ctx.fillRect(x, y, itemWidth, itemHeight)

    drawToolTips(ctx, item.data[k], x + itemWidth / 2, y - chartOpt.textSpace, color)
  }
}
/**
 * 绘制折线图
 */
function drawLineChart(
  ctx: Taro.CanvasContext,
  i: number,
  series: ISerie[],
  barWidth: number,
  barHeight: number
) {
  let item = series[i]
  let color = getColor(i)
  ctx.setLineWidth(2)
  ctx.setStrokeStyle(color)
  ctx.beginPath()
  for (let k = 0; k < item.data.length; k++) {
    if (isNullOrUnDef(item.data[k])) continue
    let point = getLinePoint(k, item, barWidth, barHeight)
    if (k == 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }
  ctx.stroke()
  ctx.closePath()
  if (!item.toolTips?.show) return
  for (let k = 0; k < item.data.length; k++) {
    if (isNullOrUnDef(item.data[k])) continue
    let point = getLinePoint(k, item, barWidth, barHeight)
    drawPoint(ctx, point.x, point.y, 3, color)
    drawPoint(ctx, point.x, point.y, 1, chartOpt.bgColor)
    drawToolTips(ctx, item.data[k]!.toString(), point.x, point.y - chartOpt.chartSpace, color)
  }
}

function getLinePoint(k: number, item: ISerie, barWidth: number, barHeight: number) {
  let maxY = chartOpt.axisYMarks[chartOpt.axisYMarks.length - 1]
  let minY = chartOpt.axisYMarks[0]
  let x = barWidth * k + chartOpt.axisLeft + barWidth / 2
  let y = chartOpt.axisBottom - barHeight * ((item.data[k]! - minY) / (maxY - minY))

  return { x, y }
}
function drawPoint(ctx: Taro.CanvasContext, x: number, y: number, radius: number, color: string) {
  ctx.setFillStyle(color)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}
/**
 * 绘制饼图
 */
function drawPieChart(ctx, i, series) {
  let item = series[i]

  let x = (chartOpt.right - chartOpt.left) / 2 + chartOpt.left
  let radius = (chartOpt.axisBottom - chartOpt.axisTop) / 3
  let y = (chartOpt.axisBottom - chartOpt.axisTop) / 2 + chartOpt.axisTop

  let lastAngel = 0
  for (let k = 0; k < item.data.length; k++) {
    let color = getColor(k)
    let curAngel = (2 / chartOpt.chartPieCount) * item.data[k]
    let precent = (100 / chartOpt.chartPieCount) * item.data[k]

    drawPieToolTips(
      ctx,
      item.data[k] + '(' + Math.round(precent) + '%)',
      color,
      x,
      y,
      radius,
      lastAngel,
      curAngel
    )

    ctx.setFillStyle(color)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, radius, (lastAngel - 0.5) * Math.PI, (lastAngel + curAngel - 0.5) * Math.PI)
    ctx.fill()
    ctx.closePath()
    lastAngel += curAngel
  }
}
/**
 * 绘制饼图数据标签
 */
function drawPieToolTips(ctx, value, color, x, y, radius, lastAngel, curAngel) {
  let textWidth = util.measureText(value, dataSet.xAxis.size)
  let cosc = Math.cos((lastAngel - 0.5 + curAngel / 2) * Math.PI)
  let sinc = Math.sin((lastAngel - 0.5 + curAngel / 2) * Math.PI)
  let x1 = radius * cosc + x
  let y1 = radius * sinc + y

  let x2 = (radius + 20) * cosc + x
  let y2 = (radius + 20) * sinc + y

  ctx.setFillStyle(color)
  ctx.setTextAlign(x2 < x1 ? 'right' : 'left')
  ctx.setFontSize(dataSet.xAxis.size)
  ctx.setStrokeStyle(color)
  ctx.setLineWidth(1)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  if (x1 >= x && y1 < y) {
    ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
    ctx.fillText(value, x2 + 15 + chartOpt.textSpace, y2 + dataSet.xAxis.size / 2)
  } else if (x1 >= x && y1 >= y) {
    ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
    ctx.fillText(value, x2 + 15 + chartOpt.textSpace, y2 + dataSet.xAxis.size / 2)
  } else if (x1 < x && y1 >= y) {
    ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
    ctx.fillText(value, x2 - 15 - chartOpt.textSpace, y2 + dataSet.xAxis.size / 2)
  } else if (x1 < x && y1 < y) {
    ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
    ctx.fillText(value, x2 - 15 - chartOpt.textSpace, y2 + dataSet.xAxis.size / 2)
  }
  ctx.stroke()
  ctx.closePath()
}
/**
 * 获取柱状图颜色值，循环渲染
 */
function getColor(index: number) {
  let cLength = dataSet.color.length
  if (index >= cLength) {
    return dataSet.color[index % cLength]
  } else {
    return dataSet.color[index]
  }
}
/**
 * 保存图表为图片
 */
export function saveCanvas(func) {
  Taro.canvasToTempFilePath({
    canvasId: canvasId,
    success: function (res) {
      console.log(res.tempFilePath)
      // Taro.previewImage({
      //   urls: [res.tempFilePath],
      // })
      Taro.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(ress) {
          console.log(ress)
        }
      })
    }
  })
}
