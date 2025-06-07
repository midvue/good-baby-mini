import Taro from '@tarojs/taro'
import { ISerie, DataSet, ChartOpt } from './types'
import { isFunction, isNullOrUnDef } from '@mid-vue/shared'

// 定义线条类型枚举
// 修改枚举名称为 EnumLineType
export enum EnumLineType {
  SOLID = 'solid',
  DASHED = 'dashed'
}

let sysInfo: Taro.getSystemInfoSync.Result | null = null

export class Chart {
  private canvasId: string = ''
  private chartOpt: ChartOpt = {
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
  private dataSet: DataSet = {
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
    colors: ['#74DAE5', '#394655', '#FEE746'],
    xAxis: {
      color: '#666A73',
      size: 10,
      data: []
    },
    series: [
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

  /**
   * 初始化图表
   * @param canvasId - 画布的 ID
   * @param data - 图表配置选项
   */
  public init(canvasId: string, data: DataSet): void {
    this.canvasId = canvasId
    this.checkData(data)

    let ctx: Taro.CanvasContext = this.initCanvas(canvasId)
    this.drawChart(ctx)
  }

  /**
   * 初始化 Canvas
   * @param canvasId - 画布的 ID
   * @returns Taro 的 Canvas 上下文对象
   */
  private initCanvas(canvasId: string): Taro.CanvasContext {
    let ctx: Taro.CanvasContext = Taro.createCanvasContext(canvasId)
    if (!sysInfo) {
      sysInfo = Taro.getSystemInfoSync()
    }

    this.chartOpt.chartWidth = sysInfo.windowWidth
    this.chartOpt.chartHeight = sysInfo.windowWidth * 1.3 // Canvas 组件的宽高比

    this.chartOpt.legendWidth = this.dataSet.legend.size * 1.3
    this.chartOpt.legendHeight = this.dataSet.legend.size * 0.8

    this.chartOpt.top = this.chartOpt.left = this.chartOpt.chartSpace
    this.chartOpt.right = this.chartOpt.chartWidth - this.chartOpt.chartSpace
    this.chartOpt.bottom = this.chartOpt.chartHeight - this.chartOpt.chartSpace

    // 3 个数字的文字长度
    let textWidth: number = this.measureText('100', this.dataSet.xAxis.size)
    let legendHeight: number =
      this.dataSet.series.length > 1 ? this.chartOpt.legendHeight + this.chartOpt.chartSpace * 2 : 0

    this.chartOpt.axisLeft =
      this.chartOpt.left + (this.dataSet.hideYAxis ? 0 : textWidth + this.chartOpt.textSpace)
    this.chartOpt.axisBottom =
      this.chartOpt.bottom - this.dataSet.xAxis.size - this.chartOpt.textSpace - legendHeight
    this.chartOpt.axisTop =
      this.chartOpt.top +
      this.dataSet.title.size +
      this.chartOpt.textSpace +
      this.dataSet.xAxis.size * 2
    return ctx
  }

  /**
   * 检查并更新图表数据
   * @param data - 图表配置选项
   */
  private checkData(data: DataSet): void {
    // 检查传入的配置中是否有标题信息
    if (data.title != undefined) {
      // 若标题颜色存在且不为空字符串，则更新全局数据集的标题颜色
      if (data.title.color != undefined && data.title.color != '') {
        this.dataSet.title.color = data.title.color
      }
      // 更新全局数据集的标题文本
      this.dataSet.title.text = data.title.text
    }
    // 检查传入的配置中颜色数组是否存在且不为空，若满足条件则更新全局数据集的颜色数组
    if (data.colors != undefined && data.colors.length > 0) {
      this.dataSet.colors = data.colors
    }
    // 更新全局数据集的 X 轴数据
    this.dataSet.xAxis.data = data.xAxis.data

    // 更新全局数据集的系列数据
    this.dataSet.series = data.series

    // 用于存储所有系列数据中的数值
    let values: number[] = []
    // 遍历全局数据集的系列数据
    for (let i = 0; i < this.dataSet.series.length; i++) {
      // 获取当前系列数据
      let serie: ISerie = this.dataSet.series[i]
      // 获取当前系列数据的长度
      let itemLength: number = serie.data.length
      // 若当前系列数据的长度大于之前记录的最大柱状图长度，则更新最大柱状图长度
      if (itemLength > this.chartOpt.barLength) {
        this.chartOpt.barLength = itemLength
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
        this.chartOpt.barNum += 1
      }
      // 若当前系列为饼图类型，则隐藏 X 轴和 Y 轴，并累加饼图数据的总和
      if (serie.category === 'pie') {
        this.chartOpt.hideXYAxis = true
        for (let k = 0; k < itemLength; k++) {
          // 累加当前饼图系列中每个数据项的值到饼图数据总和中
          this.chartOpt.chartPieCount += serie.data[k] as number
        }
      }
    }

    // 计算所有数值中的最小值
    let minNum: number = Math.min(...values)
    // 计算所有数值中的最大值
    let maxNum: number = Math.max(...values)
    // 调用工具函数计算 Y 轴刻度尺数据，将结果存储到全局图表配置中
    this.chartOpt.axisYMarks = this.calculateY(minNum, maxNum, 5)
  }

  /**
   * 绘制图表
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawChart(ctx: Taro.CanvasContext): void {
    this.drawBackground(ctx)
    this.drawTitle(ctx)
    // this.drawLegend(ctx)
    if (!this.chartOpt.hideXYAxis) {
      this.drawXAxis(ctx)
      this.drawYAxis(ctx)
    }

    // this.drawBarChart(ctx);
    this.drawCharts(ctx)
    ctx.draw()
  }

  /**
   * 绘制图表背景
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawBackground(ctx: Taro.CanvasContext): void {
    if (this.chartOpt.bgColor != '' && this.chartOpt.bgColor != 'transparent') {
      ctx.setFillStyle(this.chartOpt.bgColor)
      ctx.fillRect(0, 0, this.chartOpt.chartWidth, this.chartOpt.chartHeight)
    }
  }

  /**
   * 绘制标题
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawTitle(ctx: Taro.CanvasContext): void {
    let title = this.dataSet.title
    if (title.text !== '') {
      let textWidth = this.measureText(title.text, title.size)
      ctx.setFillStyle(title.color)
      ctx.setFontSize(title.size)
      ctx.setTextAlign('left')
      ctx.fillText(
        title.text,
        (this.chartOpt.chartWidth - textWidth) / 2,
        this.chartOpt.top + title.size
      )
    }
  }

  /**
   * 绘制 X 轴刻度尺
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawXAxis(ctx: Taro.CanvasContext): void {
    // 绘制 X 轴横线
    ctx.setLineWidth(0.5)
    ctx.setLineCap('round')
    ctx.moveTo(this.chartOpt.axisLeft, this.chartOpt.axisBottom)
    ctx.lineTo(this.chartOpt.right, this.chartOpt.axisBottom)
    ctx.stroke()

    let width = (this.chartOpt.right - this.chartOpt.axisLeft) / this.chartOpt.barLength
    let data = this.dataSet.xAxis.data
    // 绘制 X 轴显示文字
    for (let i = 0; i < data.length; i++) {
      let textX = width * (i + 1) - width / 2 + this.chartOpt.axisLeft
      ctx.setFillStyle(this.dataSet.xAxis.color)
      ctx.setFontSize(this.dataSet.xAxis.size)
      ctx.setTextAlign('center')
      ctx.fillText(
        data[i],
        textX,
        this.chartOpt.axisBottom + this.dataSet.xAxis.size + this.chartOpt.textSpace
      )
    }
  }

  /**
   * 绘制 Y 轴刻度尺
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawYAxis(ctx: Taro.CanvasContext): void {
    // 绘制 Y 轴横线
    ctx.setLineWidth(0.5)
    ctx.setLineCap('round')

    let height =
      (this.chartOpt.axisBottom - this.chartOpt.axisTop) / (this.chartOpt.axisYMarks.length - 1)

    // 绘制 Y 轴显示数字
    for (let i = 0; i < this.chartOpt.axisYMarks.length; i++) {
      let y = this.chartOpt.axisBottom - height * i
      if (i > 0) {
        ctx.setStrokeStyle(this.chartOpt.lineColor)
        this.drawDashLine(ctx, this.chartOpt.axisLeft, y, this.chartOpt.right, y)
      }

      if (!this.dataSet.hideYAxis) {
        ctx.setFillStyle(this.dataSet.xAxis.color)
        ctx.setFontSize(this.dataSet.xAxis.size)
        ctx.setTextAlign('right')
        ctx.fillText(
          this.chartOpt.axisYMarks[i].toString(),
          this.chartOpt.axisLeft - this.chartOpt.textSpace,
          y + this.chartOpt.textSpace
        )
      }
    }
  }

  /**
   * 绘制图例
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawLegend(ctx: Taro.CanvasContext): void {
    let series = this.dataSet.series

    for (let i = 0; i < series.length; i++) {
      let names = series[i].name
      let isPie = series[i].category === 'pie'
      let textWidth = this.measureText(isPie ? names[0] : names, this.dataSet.xAxis.size)
      let legendWidth = this.chartOpt.legendWidth + textWidth + this.chartOpt.chartSpace * 2
      let startX =
        this.chartOpt.chartWidth / 2 - (legendWidth * (isPie ? names.length : series.length)) / 2

      if (series[i].category === 'pie') {
        for (let k = 0; k < names.length; k++) {
          let x = startX + legendWidth * k
          let y = this.chartOpt.bottom - this.chartOpt.legendHeight

          ctx.setFillStyle(this.dataSet.xAxis.color)
          ctx.setFontSize(this.dataSet.legend.size)
          ctx.setTextAlign('left')
          ctx.fillText(
            names[k],
            x + this.chartOpt.textSpace + this.chartOpt.legendWidth,
            this.chartOpt.bottom
          )

          let color = this.getColor(k)
          ctx.setFillStyle(color)
          ctx.fillRect(x, y + 1, this.chartOpt.legendWidth, this.chartOpt.legendHeight)
        }
      } else {
        let x = startX + legendWidth * i + this.chartOpt.legendWidth * i
        let y = this.chartOpt.bottom - this.chartOpt.legendHeight

        ctx.setFillStyle(this.dataSet.xAxis.color)
        ctx.setFontSize(this.dataSet.legend.size)
        ctx.setTextAlign('left')
        ctx.fillText(
          series[i].name,
          x + this.chartOpt.chartSpace + this.chartOpt.legendWidth,
          this.chartOpt.bottom
        )

        let color = this.getColor(i)
        ctx.setFillStyle(color)
        ctx.setLineWidth(2)
        ctx.setStrokeStyle(color)
        if (series[i].category === 'bar') {
          ctx.fillRect(x, y + 1, this.chartOpt.legendWidth, this.chartOpt.legendHeight)
        } else if (series[i].category === 'line') {
          let lx = x + this.chartOpt.legendWidth / 2
          let ly = y + this.chartOpt.legendHeight / 2 + 1
          ctx.beginPath()
          ctx.moveTo(x, ly)
          ctx.lineTo(x + this.chartOpt.legendWidth, ly)
          ctx.stroke()
          ctx.closePath()
          this.drawPoint(ctx, lx, ly, this.chartOpt.legendHeight / 2, color)
          this.drawPoint(ctx, lx, ly, this.chartOpt.legendHeight / 4, this.chartOpt.bgColor)
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
  private drawToolTips(
    ctx: Taro.CanvasContext,
    text: string,
    x: number,
    y: number,
    color: string
  ): void {
    ctx.setFillStyle(color)
    ctx.setFontSize(this.dataSet.xAxis.size)
    ctx.setTextAlign('center')
    ctx.fillText(text, x, y)
  }

  /**
   * 画图
   * @param ctx - Taro 的 Canvas 上下文对象
   */
  private drawCharts(ctx: Taro.CanvasContext): void {
    let series = this.dataSet.series
    for (let i = 0; i < series.length; i++) {
      let category = series[i].category
      let barWidth = (this.chartOpt.right - this.chartOpt.axisLeft) / this.chartOpt.barLength
      let barHeight = this.chartOpt.axisBottom - this.chartOpt.axisTop
      let maxMark = this.chartOpt.axisYMarks[this.chartOpt.axisYMarks.length - 1]

      if (category === 'bar') {
        barWidth = barWidth - this.chartOpt.chartSpace
        this.drawBarChart(ctx, i, series, barWidth, barHeight, maxMark)
      } else if (category === 'line') {
        this.drawLineChart(ctx, i, series, barWidth, barHeight)
      } else if (category === 'pie') {
        this.drawPieChart(ctx, i, series)
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
  private drawBarChart(
    ctx: Taro.CanvasContext,
    i: number,
    series: ISerie[],
    barWidth: number,
    barHeight: number,
    maxMark: number
  ): void {
    let item = series[i]
    let itemWidth = barWidth / this.chartOpt.barNum

    for (let k = 0; k < item.data.length; k++) {
      let itemHeight = barHeight * ((item.data[k] as number) / maxMark)
      let x =
        barWidth * k +
        this.chartOpt.axisLeft +
        k * this.chartOpt.chartSpace +
        this.chartOpt.chartSpace / 2 +
        i * itemWidth
      let y = this.chartOpt.axisBottom - itemHeight
      let color = this.getColor(series.length <= 1 ? k : i)
      ctx.setFillStyle(color)
      ctx.fillRect(x, y, itemWidth, itemHeight)

      this.drawToolTips(
        ctx,
        (item.data[k] as number).toString(),
        x + itemWidth / 2,
        y - this.chartOpt.textSpace,
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
  private drawLineChart(
    ctx: Taro.CanvasContext,
    i: number,
    series: ISerie[],
    barWidth: number,
    barHeight: number
  ): void {
    let item = series[i]
    // 更新枚举引用
    const lineType = item.type || EnumLineType.SOLID
    let color = this.getColor(i)
    ctx.setLineWidth(2)
    ctx.setStrokeStyle(color)
    ctx.beginPath()

    let prevPoint: { x: number; y: number } | null = null
    for (let k = 0; k < item.data.length; k++) {
      if (isNullOrUnDef(item.data[k])) continue
      let point = this.getLinePoint(k, item, barWidth, barHeight)
      if (k === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        // 更新枚举引用
        if (lineType === EnumLineType.SOLID) {
          ctx.lineTo(point.x, point.y)
        } else if (lineType === EnumLineType.DASHED && prevPoint) {
          // 绘制虚线
          this.drawDashLine(ctx, prevPoint.x, prevPoint.y, point.x, point.y)
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
        let point = this.getLinePoint(k, item, barWidth, barHeight)
        this.drawPoint(ctx, point.x, point.y, 3, color)
        this.drawPoint(ctx, point.x, point.y, 1, this.chartOpt.bgColor)
        let label = item.toolTips.formatter?.(item.data) || (item.data[k] as number).toString()
        let x = point.x + (item.toolTips.offset?.[0] || 0)
        let y = point.y + (item.toolTips.offset?.[1] || 0)
        this.drawToolTips(ctx, label, x, y - this.chartOpt.chartSpace, color)
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
  private getLinePoint(
    k: number,
    item: ISerie,
    barWidth: number,
    barHeight: number
  ): { x: number; y: number } {
    let maxY = this.chartOpt.axisYMarks[this.chartOpt.axisYMarks.length - 1]
    let minY = this.chartOpt.axisYMarks[0]
    let x = barWidth * k + this.chartOpt.axisLeft + barWidth / 2
    let y =
      this.chartOpt.axisBottom - barHeight * (((item.data[k] as number) - minY) / (maxY - minY))

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
  private drawPoint(
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
  private drawPieChart(ctx: Taro.CanvasContext, i: number, series: ISerie[]): void {
    let item = series[i]

    let x = (this.chartOpt.right - this.chartOpt.left) / 2 + this.chartOpt.left
    let radius = (this.chartOpt.axisBottom - this.chartOpt.axisTop) / 3
    let y = (this.chartOpt.axisBottom - this.chartOpt.axisTop) / 2 + this.chartOpt.axisTop

    let lastAngel = 0
    for (let k = 0; k < item.data.length; k++) {
      let color = this.getColor(k)

      let curAngel = (2 / this.chartOpt.chartPieCount) * (item.data[k] as number)
      let precent = (100 / this.chartOpt.chartPieCount) * (item.data[k] as number)

      this.drawPieToolTips(
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
  private drawPieToolTips(
    ctx: Taro.CanvasContext,
    value: string,
    color: string,
    x: number,
    y: number,
    radius: number,
    lastAngel: number,
    curAngel: number
  ): void {
    let textWidth = this.measureText(value, this.dataSet.xAxis.size)
    let cosc = Math.cos((lastAngel - 0.5 + curAngel / 2) * Math.PI)
    let sinc = Math.sin((lastAngel - 0.5 + curAngel / 2) * Math.PI)
    let x1 = radius * cosc + x
    let y1 = radius * sinc + y

    let x2 = (radius + 20) * cosc + x
    let y2 = (radius + 20) * sinc + y

    ctx.setFillStyle(color)
    ctx.setTextAlign(x2 < x1 ? 'right' : 'left')
    ctx.setFontSize(this.dataSet.xAxis.size)
    ctx.setStrokeStyle(color)
    ctx.setLineWidth(1)
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    if (x1 >= x && y1 < y) {
      ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
      ctx.fillText(value, x2 + 15 + this.chartOpt.textSpace, y2 + this.dataSet.xAxis.size / 2)
    } else if (x1 >= x && y1 >= y) {
      ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
      ctx.fillText(value, x2 + 15 + this.chartOpt.textSpace, y2 + this.dataSet.xAxis.size / 2)
    } else if (x1 < x && y1 >= y) {
      ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
      ctx.fillText(value, x2 - 15 - this.chartOpt.textSpace, y2 + this.dataSet.xAxis.size / 2)
    } else if (x1 < x && y1 < y) {
      ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
      ctx.fillText(value, x2 - 15 - this.chartOpt.textSpace, y2 + this.dataSet.xAxis.size / 2)
    }
    ctx.stroke()
    ctx.closePath()
  }

  /**
   * 获取柱状图颜色值，循环渲染
   * @param index - 颜色的索引
   * @returns 颜色值
   */
  private getColor(index: number): string {
    let cLength = this.dataSet.colors.length
    if (index >= cLength) {
      return this.dataSet.colors[index % cLength]
    } else {
      return this.dataSet.colors[index]
    }
  }

  /**
   * 保存图表为图片
   * @param func - 回调函数
   */
  public saveCanvas(func: () => void): void {
    Taro.canvasToTempFilePath({
      canvasId: this.canvasId,
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

  /**
   * 测量文字宽度，
   * Canvas宽度太大，微信提供的setTextAlign(center)
   * 方法并不能准确居中显示
   */
  private measureText(text: string, textSize: number) {
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
  private calculateY(dMin: number, dMax: number, iMaxAxisNum: number) {
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
  private drawDashLine(
    ctx: Taro.CanvasContext,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLen?: number
  ) {
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
  private drawRoundBar(
    ctx: Taro.CanvasContext,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
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

  private easeOut(t: number, b: number, c: number, d: number) {
    return c * ((t = t / d - 1) * t * t + 1) + b
  }
}
