import Taro from '@tarojs/taro'
import * as util from './chartUtils'
import { ISerie, DataSet, ChartOpt } from './types'
import { isFunction, isNullOrUnDef } from '@mid-vue/shared'

// 定义线条类型枚举
// 修改枚举名称为 EnumLineType
export enum EnumLineType {
  SOLID = 'solid',
  DASHED = 'dashed'
}

let canvasId: string = ''
let chartOpt: ChartOpt = {
  chartPieCount: 0,
  hideXYAxis: false,
  axisYMarks: [] as number[],
  barLength: 0,
  barNum: 0,
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

let dataSet: DataSet = {
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
      data: [],
      toolTips: {
        show: false,
        formatter: (params) => '',
        offset: [0, 0],
        color: ''
      },
      type: EnumLineType.SOLID
    },
    {
      name: '',
      category: 'line',
      data: [],
      toolTips: {
        show: false,
        formatter: (params) => '',
        offset: [0, 0],
        color: ''
      },
      type: EnumLineType.SOLID
    }
  ]
}

let Sys: Taro.getSystemInfoSync.Result | null = null

/**
 * 初始化图表
 * @param canvasId - 画布的 ID
 * @param data - 图表配置选项
 */
export function init(canvasId: string, data: DataSet): void {
  canvasId = canvasId
  chartOpt = {
    chartPieCount: 0,
    hideXYAxis: false,
    axisYMarks: [] as number[],
    barLength: 0,
    barNum: 0,
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

  dataSet = {
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
    color: [],
    xAxis: {
      color: '#666A73',
      size: 10,
      data: []
    },
    series: [
      {
        name: '',
        category: 'bar',
        data: [],
        toolTips: {
          show: false,
          formatter: (params) => '',
          offset: [0, 0],
          color: ''
        },
        type: EnumLineType.SOLID
      },
      {
        name: '',
        category: 'line',
        data: [],
        toolTips: {
          show: false,
          formatter: (params) => '',
          offset: [0, 0],
          color: ''
        },
        type: EnumLineType.SOLID
      }
    ]
  }
  checkData(data)

  let ctx: Taro.CanvasContext = initCanvas(canvasId)
  drawChart(ctx)
}

/**
 * 初始化 Canvas
 * @param canvasId - 画布的 ID
 * @returns Taro 的 Canvas 上下文对象
 */

function initCanvas(canvasId: string): Taro.CanvasContext {
  let ctx: Taro.CanvasContext = Taro.createCanvasContext(canvasId)
  if (!Sys) {
    Sys = Taro.getSystemInfoSync()
  }

  chartOpt.chartWidth = Sys.windowWidth
  chartOpt.chartHeight = Sys.windowWidth * 1.3 // Canvas 组件的宽高比

  chartOpt.legendWidth = dataSet.legend.size * 1.3
  chartOpt.legendHeight = dataSet.legend.size * 0.8

  chartOpt.top = chartOpt.left = chartOpt.chartSpace
  chartOpt.right = chartOpt.chartWidth - chartOpt.chartSpace
  chartOpt.bottom = chartOpt.chartHeight - chartOpt.chartSpace

  // 3 个数字的文字长度
  let textWidth: number = util.measureText('100', dataSet.xAxis.size)
  let legendHeight: number =
    dataSet.series.length > 1 ? chartOpt.legendHeight + chartOpt.chartSpace * 2 : 0

  chartOpt.axisLeft = chartOpt.left + (dataSet.hideYAxis ? 0 : textWidth + chartOpt.textSpace)
  chartOpt.axisBottom = chartOpt.bottom - dataSet.xAxis.size - chartOpt.textSpace - legendHeight
  chartOpt.axisTop = chartOpt.top + dataSet.title.size + chartOpt.textSpace + dataSet.xAxis.size * 2
  return ctx
}

/**
 * 检查并更新图表数据
 * @param data - 图表配置选项
 */
function checkData(data: DataSet): void {
  // 检查传入的配置中是否有标题信息
  if (data.title != undefined) {
    // 若标题颜色存在且不为空字符串，则更新全局数据集的标题颜色
    if (data.title.color != undefined && data.title.color != '') {
      dataSet.title.color = data.title.color
    }
    // 更新全局数据集的标题文本
    dataSet.title.text = data.title.text
  }
  // 检查传入的配置中颜色数组是否存在且不为空，若满足条件则更新全局数据集的颜色数组
  if (data.color != undefined && data.color.length > 0) {
    dataSet.color = data.color
  }
  // 更新全局数据集的 X 轴数据
  dataSet.xAxis.data = data.xAxis.data

  // 更新全局数据集的系列数据
  dataSet.series = data.series

  // 用于存储所有系列数据中的数值
  let values: number[] = []
  // 遍历全局数据集的系列数据
  for (let i = 0; i < dataSet.series.length; i++) {
    // 获取当前系列数据
    let serie: ISerie = dataSet.series[i]
    // 获取当前系列数据的长度
    let itemLength: number = serie.data.length
    // 若当前系列数据的长度大于之前记录的最大柱状图长度，则更新最大柱状图长度
    if (itemLength > chartOpt.barLength) {
      chartOpt.barLength = itemLength
    }
    // 遍历当前系列数据中的每个元素
    for (let k = 0; k < itemLength; k++) {
      // 若当前元素存在，则将其作为数字添加到 values 数组中
      if (serie.data[k] != undefined) {
        values.push(serie.data[k] as number)
      }
    }
    // 若当前系列为柱状图类型，则增加柱状图数量计数
    if (serie.category === 'bar') {
      chartOpt.barNum += 1
    }
    // 若当前系列为饼图类型，则隐藏 X 轴和 Y 轴，并累加饼图数据的总和
    if (serie.category === 'pie') {
      chartOpt.hideXYAxis = true
      for (let k = 0; k < itemLength; k++) {
        // 累加当前饼图系列中每个数据项的值到饼图数据总和中
        chartOpt.chartPieCount += serie.data[k] as number
      }
    }
  }

  // 计算所有数值中的最小值
  let minNum: number = Math.min(...values)
  // 计算所有数值中的最大值
  let maxNum: number = Math.max(...values)
  // 调用工具函数计算 Y 轴刻度尺数据，将结果存储到全局图表配置中
  chartOpt.axisYMarks = util.calculateY(minNum, maxNum, 5)
}

/**
 * 绘制图表
 * @param ctx - Taro 的 Canvas 上下文对象
 */
function drawChart(ctx: Taro.CanvasContext): void {
  drawBackground(ctx)
  drawTitle(ctx)
  // drawLegend(ctx)
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
 * @param ctx - Taro 的 Canvas 上下文对象
 */
function drawBackground(ctx: Taro.CanvasContext): void {
  if (chartOpt.bgColor != '' && chartOpt.bgColor != 'transparent') {
    ctx.setFillStyle(chartOpt.bgColor)
    ctx.fillRect(0, 0, chartOpt.chartWidth, chartOpt.chartHeight)
  }
}

/**
 * 绘制标题
 * @param ctx - Taro 的 Canvas 上下文对象
 */
function drawTitle(ctx: Taro.CanvasContext): void {
  let title = dataSet.title
  if (title.text !== '') {
    let textWidth = util.measureText(title.text, title.size)
    ctx.setFillStyle(title.color)
    ctx.setFontSize(title.size)
    ctx.setTextAlign('left')
    ctx.fillText(title.text, (chartOpt.chartWidth - textWidth) / 2, chartOpt.top + title.size)
  }
}

/**
 * 绘制 X 轴刻度尺
 * @param ctx - Taro 的 Canvas 上下文对象
 */

function drawXAxis(ctx: Taro.CanvasContext): void {
  // 绘制 X 轴横线
  ctx.setLineWidth(0.5)
  ctx.setLineCap('round')
  ctx.moveTo(chartOpt.axisLeft, chartOpt.axisBottom)
  ctx.lineTo(chartOpt.right, chartOpt.axisBottom)
  ctx.stroke()

  let width = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength
  let data = dataSet.xAxis.data
  // 绘制 X 轴显示文字
  for (let i = 0; i < data.length; i++) {
    let textX = width * (i + 1) - width / 2 + chartOpt.axisLeft
    ctx.setFillStyle(dataSet.xAxis.color)
    ctx.setFontSize(dataSet.xAxis.size)
    ctx.setTextAlign('center')
    ctx.fillText(data[i], textX, chartOpt.axisBottom + dataSet.xAxis.size + chartOpt.textSpace)
  }
}

/**
 * 绘制 Y 轴刻度尺
 * @param ctx - Taro 的 Canvas 上下文对象
 */

function drawYAxis(ctx: Taro.CanvasContext): void {
  // 绘制 Y 轴横线
  ctx.setLineWidth(0.5)
  ctx.setLineCap('round')

  let height = (chartOpt.axisBottom - chartOpt.axisTop) / (chartOpt.axisYMarks.length - 1)

  // 绘制 Y 轴显示数字
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
        chartOpt.axisYMarks[i].toString(),
        chartOpt.axisLeft - chartOpt.textSpace,
        y + chartOpt.textSpace
      )
    }
  }
}

/**
 * 绘制图例
 * @param ctx - Taro 的 Canvas 上下文对象
 */
function drawLegend(ctx: Taro.CanvasContext): void {
  let series = dataSet.series

  for (let i = 0; i < series.length; i++) {
    let names = series[i].name
    let isPie = series[i].category === 'pie'
    let textWidth = util.measureText(isPie ? names[0] : names, dataSet.xAxis.size)
    let legendWidth = chartOpt.legendWidth + textWidth + chartOpt.chartSpace * 2
    let startX =
      chartOpt.chartWidth / 2 - (legendWidth * (isPie ? names.length : series.length)) / 2

    if (series[i].category === 'pie') {
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
      if (series[i].category === 'bar') {
        ctx.fillRect(x, y + 1, chartOpt.legendWidth, chartOpt.legendHeight)
      } else if (series[i].category === 'line') {
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
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param text - 要绘制的文本
 * @param x - 文本的 X 坐标
 * @param y - 文本的 Y 坐标
 * @param color - 文本的颜色
 */
function drawToolTips(
  ctx: Taro.CanvasContext,
  text: string,
  x: number,
  y: number,
  color: string
): void {
  ctx.setFillStyle(color)
  ctx.setFontSize(dataSet.xAxis.size)
  ctx.setTextAlign('center')
  ctx.fillText(text, x, y)
}

/**
 * 画图
 * @param ctx - Taro 的 Canvas 上下文对象
 */
function drawCharts(ctx: Taro.CanvasContext): void {
  let series = dataSet.series
  for (let i = 0; i < series.length; i++) {
    let category = series[i].category
    let barWidth = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength
    let barHeight = chartOpt.axisBottom - chartOpt.axisTop
    let maxMark = chartOpt.axisYMarks[chartOpt.axisYMarks.length - 1]

    if (category === 'bar') {
      barWidth = barWidth - chartOpt.chartSpace
      drawBarChart(ctx, i, series, barWidth, barHeight, maxMark)
    } else if (category === 'line') {
      drawLineChart(ctx, i, series, barWidth, barHeight)
    } else if (category === 'pie') {
      drawPieChart(ctx, i, series)
    }
  }
}

/**
 * 绘制柱状图
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param i - 系列的索引
 * @param series - 系列数据
 * @param barWidth - 柱状图的宽度
 * @param barHeight - 柱状图的高度
 * @param maxMark - Y 轴最大刻度值
 */
function drawBarChart(
  ctx: Taro.CanvasContext,
  i: number,
  series: ISerie[],
  barWidth: number,
  barHeight: number,
  maxMark: number
): void {
  let item = series[i]
  let itemWidth = barWidth / chartOpt.barNum

  for (let k = 0; k < item.data.length; k++) {
    let itemHeight = barHeight * ((item.data[k] as number) / maxMark)
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

    drawToolTips(
      ctx,
      (item.data[k] as number).toString(),
      x + itemWidth / 2,
      y - chartOpt.textSpace,
      color
    )
  }
}

/**
 * 绘制折线图
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param i - 系列的索引
 * @param series - 系列数据
 * @param barWidth - 柱状图的宽度
 * @param barHeight - 柱状图的高度
 */
function drawLineChart(
  ctx: Taro.CanvasContext,
  i: number,
  series: ISerie[],
  barWidth: number,
  barHeight: number
): void {
  let item = series[i]
  // 更新枚举引用
  const lineType = item.type || EnumLineType.SOLID
  let color = getColor(i)
  ctx.setLineWidth(2)
  ctx.setStrokeStyle(color)
  ctx.beginPath()

  let prevPoint: { x: number; y: number } | null = null
  for (let k = 0; k < item.data.length; k++) {
    if (isNullOrUnDef(item.data[k])) continue
    let point = getLinePoint(k, item, barWidth, barHeight)
    if (k === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      // 更新枚举引用
      if (lineType === EnumLineType.SOLID) {
        ctx.lineTo(point.x, point.y)
      } else if (lineType === EnumLineType.DASHED && prevPoint) {
        // 绘制虚线
        util.drawDashLine(ctx, prevPoint.x, prevPoint.y, point.x, point.y)
      }
    }
    prevPoint = point
  }
  ctx.stroke()
  ctx.closePath()

  if (!item.toolTips?.show) return
  for (let k = 0; k < item.data.length; k++) {
    if (isNullOrUnDef(item.data[k])) continue
    let isShow = isFunction(item.toolTips.show) ? item.toolTips.show(k) : item.toolTips.show
    if (isShow) {
      let point = getLinePoint(k, item, barWidth, barHeight)
      drawPoint(ctx, point.x, point.y, 3, color)
      drawPoint(ctx, point.x, point.y, 1, chartOpt.bgColor)
      let label = item.toolTips.formatter?.(item.data) || (item.data[k] as number).toString()
      let x = point.x + (item.toolTips.offset?.[0] || 0)
      let y = point.y + (item.toolTips.offset?.[1] || 0)
      drawToolTips(ctx, label, x, y - chartOpt.chartSpace, color)
    }
  }
}
/**
 * 获取折线图上点的坐标
 * @param k - 数据点的索引
 * @param item - 系列数据项
 * @param barWidth - 柱状图的宽度
 * @param barHeight - 柱状图的高度
 * @returns 点的坐标对象
 */
function getLinePoint(
  k: number,
  item: ISerie,
  barWidth: number,
  barHeight: number
): { x: number; y: number } {
  let maxY = chartOpt.axisYMarks[chartOpt.axisYMarks.length - 1]
  let minY = chartOpt.axisYMarks[0]
  let x = barWidth * k + chartOpt.axisLeft + barWidth / 2
  let y = chartOpt.axisBottom - barHeight * (((item.data[k] as number) - minY) / (maxY - minY))

  return { x, y }
}

/**
 * 绘制点
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param x - 点的 X 坐标
 * @param y - 点的 Y 坐标
 * @param radius - 点的半径
 * @param color - 点的颜色
 */
function drawPoint(
  ctx: Taro.CanvasContext,
  x: number,
  y: number,
  radius: number,
  color: string
): void {
  ctx.setFillStyle(color)
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
}

/**
 * 绘制饼图
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param i - 系列的索引
 * @param series - 系列数据
 */
function drawPieChart(ctx: Taro.CanvasContext, i: number, series: ISerie[]): void {
  let item = series[i]

  let x = (chartOpt.right - chartOpt.left) / 2 + chartOpt.left
  let radius = (chartOpt.axisBottom - chartOpt.axisTop) / 3
  let y = (chartOpt.axisBottom - chartOpt.axisTop) / 2 + chartOpt.axisTop

  let lastAngel = 0
  for (let k = 0; k < item.data.length; k++) {
    let color = getColor(k)

    let curAngel = (2 / chartOpt.chartPieCount) * (item.data[k] as number)
    let precent = (100 / chartOpt.chartPieCount) * (item.data[k] as number)

    drawPieToolTips(
      ctx,
      (item.data[k] as number) + '(' + Math.round(precent) + '%)',
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
 * @param ctx - Taro 的 Canvas 上下文对象
 * @param value - 要显示的值
 * @param color - 标签的颜色
 * @param x - 圆心的 X 坐标
 * @param y - 圆心的 Y 坐标
 * @param radius - 饼图的半径
 * @param lastAngel - 上一个扇形的角度
 * @param curAngel - 当前扇形的角度
 */
function drawPieToolTips(
  ctx: Taro.CanvasContext,
  value: string,
  color: string,
  x: number,
  y: number,
  radius: number,
  lastAngel: number,
  curAngel: number
): void {
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
 * @param index - 颜色的索引
 * @returns 颜色值
 */
function getColor(index: number): string {
  let cLength = dataSet.color.length
  if (index >= cLength) {
    return dataSet.color[index % cLength]
  } else {
    return dataSet.color[index]
  }
}

/**
 * 保存图表为图片
 * @param func - 回调函数
 */
export function saveCanvas(func: () => void): void {
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
