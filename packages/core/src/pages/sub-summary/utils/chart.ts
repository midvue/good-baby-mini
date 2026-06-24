import Taro from '@tarojs/taro'
import { isFunction, isNullOrUnDef } from '@allkit/shared'
import { type ISerie, type DataSet, type ChartOpt } from './types'
import { canvas2DToTempFilePath, getCanvas2DHandle, type Canvas2DNode } from './canvas2d'

type ChartContext = CanvasRenderingContext2D
declare const wx:
  | {
      createOffscreenCanvas?: (...args: any[]) => unknown
    }
  | undefined

// 瀹氫箟绾挎潯绫诲瀷鏋氫妇
// 淇敼鏋氫妇鍚嶇О涓?EnumLineType
export enum EnumLineType {
  SOLID = 'solid',
  DASHED = 'dashed'
}

let sysInfo: Taro.getSystemInfoSync.Result | null = null

export class Chart {
  private canvasId = ''
  private canvasNode: Canvas2DNode | null = null
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
    chart: {},
    colors: ['#74DAE5', '#394655', '#FEE746'],
    xAxis: {
      color: '#666A73',
      size: 10,
      data: [],
      show: true
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
   * 鍒濆鍖栧浘琛?
   * @param canvasId - 鐢诲竷鐨?ID
   * @param data - 鍥捐〃閰嶇疆閫夐」
   */
  public async init(canvasId: string, data: DataSet): Promise<void> {
    this.canvasId = canvasId
    this.checkData(data)

    const handle = await getCanvas2DHandle(canvasId)
    if (!handle) return

    this.canvasNode = handle.canvas
    this.initCanvas()
    this.drawChart(handle.ctx)
  }

  /**
   * 妫€鏌ュ苟鏇存柊鍥捐〃鏁版嵁
   * @param data - 鍥捐〃閰嶇疆閫夐」
   */
  private checkData(data: DataSet): void {
    // 妫€鏌ヤ紶鍏ョ殑閰嶇疆涓槸鍚︽湁鏍囬淇℃伅
    if (data.title != undefined) {
      // 鑻ユ爣棰橀鑹插瓨鍦ㄤ笖涓嶄负绌哄瓧绗︿覆锛屽垯鏇存柊鍏ㄥ眬鏁版嵁闆嗙殑鏍囬棰滆壊
      if (data.title.color != undefined && data.title.color != '') {
        this.dataSet.title.color = data.title.color
      }
      // 鏇存柊鍏ㄥ眬鏁版嵁闆嗙殑鏍囬鏂囨湰
      this.dataSet.title.text = data.title.text
    }
    // 妫€鏌ヤ紶鍏ョ殑閰嶇疆涓鑹叉暟缁勬槸鍚﹀瓨鍦ㄤ笖涓嶄负绌猴紝鑻ユ弧瓒虫潯浠跺垯鏇存柊鍏ㄥ眬鏁版嵁闆嗙殑棰滆壊鏁扮粍
    if (data.colors != undefined && data.colors.length > 0) {
      this.dataSet.colors = data.colors
    }
    // 鏇存柊鍏ㄥ眬鏁版嵁闆嗙殑 X 杞存暟鎹?
    this.dataSet.xAxis = Object.assign(this.dataSet.xAxis, data.xAxis)
    this.dataSet.chart = Object.assign(this.dataSet.chart || {}, data.chart)

    // 鏇存柊鍏ㄥ眬鏁版嵁闆嗙殑绯诲垪鏁版嵁
    this.dataSet.series = data.series

    // 鐢ㄤ簬瀛樺偍鎵€鏈夌郴鍒楁暟鎹腑鐨勬暟鍊?
    const yValues: number[] = []
    // 閬嶅巻鍏ㄥ眬鏁版嵁闆嗙殑绯诲垪鏁版嵁
    for (let i = 0; i < this.dataSet.series.length; i++) {
      // 鑾峰彇褰撳墠绯诲垪鏁版嵁
      const serie: ISerie = this.dataSet.series[i]
      // 鑾峰彇褰撳墠绯诲垪鏁版嵁鐨勯暱搴?
      const itemLength: number = serie.data.length
      // 鑻ュ綋鍓嶇郴鍒楁暟鎹殑闀垮害澶т簬涔嬪墠璁板綍鐨勬渶澶ф煴鐘跺浘闀垮害锛屽垯鏇存柊鏈€澶ф煴鐘跺浘闀垮害
      if (itemLength > this.chartOpt.barLength) {
        this.chartOpt.barLength = itemLength
      }
      // 閬嶅巻褰撳墠绯诲垪鏁版嵁涓殑姣忎釜鍏冪礌
      for (let k = 0; k < itemLength; k++) {
        if (serie.data[k] != undefined) {
          yValues.push(serie.data[k] as number)
        }
      }
      // 鑻ュ綋鍓嶇郴鍒椾负鏌辩姸鍥剧被鍨嬶紝鍒欏鍔犳煴鐘跺浘鏁伴噺璁℃暟
      if (serie.category === 'bar') {
        this.chartOpt.barNum += 1
      }
      // 鑻ュ綋鍓嶇郴鍒椾负楗煎浘绫诲瀷锛屽垯闅愯棌 X 杞村拰 Y 杞达紝骞剁疮鍔犻ゼ鍥炬暟鎹殑鎬诲拰
      if (serie.category === 'pie') {
        this.chartOpt.hideXYAxis = true
        for (let k = 0; k < itemLength; k++) {
          // 绱姞褰撳墠楗煎浘绯诲垪涓瘡涓暟鎹」鐨勫€煎埌楗煎浘鏁版嵁鎬诲拰涓?
          this.chartOpt.chartPieCount += serie.data[k] as number
        }
      }
    }

    // 璁＄畻鎵€鏈夋暟鍊间腑鐨勬渶灏忓€?
    const minNum: number = Math.min(...yValues)
    // 璁＄畻鎵€鏈夋暟鍊间腑鐨勬渶澶у€?
    const maxNum: number = Math.max(...yValues)
    // 璋冪敤宸ュ叿鍑芥暟璁＄畻 Y 杞村埢搴﹀昂鏁版嵁锛屽皢缁撴灉瀛樺偍鍒板叏灞€鍥捐〃閰嶇疆涓?
    this.chartOpt.axisYMarks = this.calculateY(
      minNum,
      maxNum,
      this.dataSet.chart?.yAxisMarkCount || 6,
      this.dataSet.chart?.yAxisPaddingRatio ?? 0.08,
      this.dataSet.chart?.yAxisMinValue,
      this.dataSet.chart?.yAxisInteger
    )
  }

  /**
   * 鍒濆鍖?Canvas
   * @param canvasId - 鐢诲竷鐨?ID
   * @returns Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private initCanvas(): void {
    if (!sysInfo) {
      sysInfo = Taro.getSystemInfoSync()
    }

    this.chartOpt.chartWidth = this.dataSet.chart?.renderOnlyYAxis || this.dataSet.chart?.respectWidth
      ? this.dataSet.chart?.width || 0
      : Math.max(this.dataSet.chart?.width || 0, sysInfo.windowWidth)
    this.chartOpt.scrollContentWidth = this.dataSet.chart?.scrollContentWidth
    this.chartOpt.scrollLeft = this.getScrollLeft()
    this.chartOpt.chartHeight = this.dataSet.chart?.height || sysInfo.windowWidth * 1.3 // Canvas 缁勪欢鐨勫楂樻瘮

    this.chartOpt.legendWidth = this.dataSet.legend.size * 1.3
    this.chartOpt.legendHeight = this.dataSet.legend.size * 0.8

    this.chartOpt.top = this.chartOpt.left = this.chartOpt.chartSpace
    this.chartOpt.right = this.getLayoutWidth() - this.chartOpt.chartSpace
    this.chartOpt.bottom = this.chartOpt.chartHeight - this.chartOpt.chartSpace

    // 3 涓暟瀛楃殑鏂囧瓧闀垮害
    const textWidth: number =
      this.dataSet.chart?.yAxisLabelWidth || this.measureText('100', this.dataSet.xAxis.size)
    const legendHeight: number =
      this.dataSet.series.length > 1 ? this.chartOpt.legendHeight + this.chartOpt.chartSpace * 2 : 0

    this.chartOpt.axisLeft = this.dataSet.chart?.renderOnlyYAxis
      ? this.dataSet.chart?.yAxisAxisLeft || this.chartOpt.right - this.chartOpt.chartSpace
      : this.dataSet.chart?.axisLeft ??
        this.chartOpt.left + (this.dataSet.hideYAxis ? 0 : textWidth + this.chartOpt.textSpace)
    this.chartOpt.axisBottom =
      this.chartOpt.bottom - this.dataSet.xAxis.size - this.chartOpt.textSpace - legendHeight
    this.chartOpt.axisTop =
      this.chartOpt.top +
      this.dataSet.title.size +
      this.chartOpt.textSpace +
      this.dataSet.xAxis.size * 2
  }

  /**
   * 缁樺埗鍥捐〃
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawChart(ctx: ChartContext): void {
    this.drawBackground(ctx)
    this.drawTitle(ctx)
    // this.drawLegend(ctx)
    if (this.dataSet.chart?.renderOnlyYAxis) {
      this.drawYAxis(ctx)
      return
    }
    if (this.dataSet.chart?.renderOnlyContent) {
      this.drawXAxis(ctx)
      this.drawYAxis(ctx)
      this.drawCharts(ctx)
      return
    }
    if (!this.chartOpt.hideXYAxis) {
      this.drawXAxis(ctx)
      this.drawYAxis(ctx)
    }

    // this.drawBarChart(ctx);
    this.drawCharts(ctx)
    if (this.dataSet.chart?.scrollContentWidth && this.dataSet.chart?.showYAxisLabels !== false) {
      this.drawFixedYAxisOverlay(ctx)
    }
  }

  /**
   * 缁樺埗鍥捐〃鑳屾櫙
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawBackground(ctx: ChartContext): void {
    if (this.chartOpt.bgColor != '' && this.chartOpt.bgColor != 'transparent') {
      ctx.fillStyle = this.chartOpt.bgColor
      ctx.fillRect(0, 0, this.chartOpt.chartWidth, this.chartOpt.chartHeight)
    }
  }

  /**
   * 缁樺埗鏍囬
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawTitle(ctx: ChartContext): void {
    const title = this.dataSet.title
    if (title.text !== '') {
      const textWidth = this.measureText(title.text, title.size)
      ctx.fillStyle = title.color
      this.setFont(ctx, title.size)
      ctx.textAlign = 'left'
      ctx.fillText(
        title.text,
        (this.chartOpt.chartWidth - textWidth) / 2,
        this.chartOpt.top + title.size
      )
    }
  }

  /**
   * 缁樺埗 X 杞村埢搴﹀昂
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawXAxis(ctx: ChartContext): void {
    // 缁樺埗 X 杞存í绾?
    ctx.lineWidth = 0.5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(this.chartOpt.axisLeft, this.chartOpt.axisBottom)
    ctx.lineTo(this.getViewportRight(), this.chartOpt.axisBottom)
    ctx.stroke()
    ctx.closePath()

    const width = this.getPointWidth()
    const data = this.dataSet.xAxis.data
    // 缁樺埗 X 杞存樉绀烘枃瀛?
    for (let i = 0; i < data.length; i++) {
      const show = this.dataSet.xAxis.show
      const isShow = isFunction(show) ? show(i) : show
      if (isShow) {
        const isFirstTick = this.dataSet.chart?.pointOnTick && i === 0
        const pointX = this.toViewportX(this.getPointX(i, width))
        if (!this.isXVisible(pointX, 24)) continue
        const textX = pointX + (isFirstTick ? this.dataSet.chart?.firstXAxisLabelOffset || 0 : 0)
        if (this.dataSet.chart?.showXAxisTickPoints) {
          this.drawPoint(
            ctx,
            pointX,
            this.chartOpt.axisBottom,
            this.dataSet.chart?.xAxisTickPointRadius || 2,
            this.dataSet.xAxis.color
          )
        }
        ctx.fillStyle = this.dataSet.xAxis.color
        this.setFont(ctx, this.dataSet.xAxis.size)
        ctx.textAlign = isFirstTick ? 'left' : 'center'
        ctx.fillText(
          data[i],
          textX,
          this.chartOpt.axisBottom + this.dataSet.xAxis.size + this.chartOpt.textSpace
        )
      }
    }
  }

  /**
   * 缁樺埗 Y 杞村埢搴﹀昂
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawYAxis(ctx: ChartContext): void {
    // 缁樺埗 Y 杞存í绾?
    if (this.dataSet.chart?.showYAxisLine !== false) {
      ctx.lineWidth = 0.5
      ctx.lineCap = 'round'
      ctx.strokeStyle = this.chartOpt.lineColor
      ctx.beginPath()
      ctx.moveTo(this.chartOpt.axisLeft, this.chartOpt.axisTop)
      ctx.lineTo(this.chartOpt.axisLeft, this.chartOpt.axisBottom)
      ctx.stroke()
      ctx.closePath()
    }

    const height =
      (this.chartOpt.axisBottom - this.chartOpt.axisTop) / (this.chartOpt.axisYMarks.length - 1)

    // 缁樺埗 Y 杞存樉绀烘暟瀛?
    for (let i = 0; i < this.chartOpt.axisYMarks.length; i++) {
      const y = this.chartOpt.axisBottom - height * i
      if (i > 0 && this.dataSet.chart?.showYAxisGridLines !== false) {
        ctx.strokeStyle = this.chartOpt.lineColor
        this.drawDashLine(ctx, this.chartOpt.axisLeft, y, this.getViewportRight(), y)
      }

      if (!this.dataSet.hideYAxis && this.dataSet.chart?.showYAxisLabels !== false) {
        ctx.fillStyle = this.dataSet.xAxis.color
        this.setFont(ctx, this.dataSet.xAxis.size)
        ctx.textAlign = 'right'
        ctx.fillText(
          this.chartOpt.axisYMarks[i].toString(),
          this.chartOpt.axisLeft -
            (this.dataSet.chart?.yAxisTextSpace ?? this.chartOpt.textSpace),
          y + this.chartOpt.textSpace
        )
      }
    }
  }

  /**
   * 缁樺埗鍥句緥
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawLegend(ctx: ChartContext): void {
    const series = this.dataSet.series

    for (let i = 0; i < series.length; i++) {
      const names = series[i].name
      const isPie = series[i].category === 'pie'
      const textWidth = this.measureText(isPie ? names[0] : names, this.dataSet.xAxis.size)
      const legendWidth = this.chartOpt.legendWidth + textWidth + this.chartOpt.chartSpace * 2
      const startX =
        this.chartOpt.chartWidth / 2 - (legendWidth * (isPie ? names.length : series.length)) / 2

      if (series[i].category === 'pie') {
        for (let k = 0; k < names.length; k++) {
          const x = startX + legendWidth * k
          const y = this.chartOpt.bottom - this.chartOpt.legendHeight

          ctx.fillStyle = this.dataSet.xAxis.color
          this.setFont(ctx, this.dataSet.legend.size)
          ctx.textAlign = 'left'
          ctx.fillText(
            names[k],
            x + this.chartOpt.textSpace + this.chartOpt.legendWidth,
            this.chartOpt.bottom
          )

          const color = this.getColor(k)
          ctx.fillStyle = color
          ctx.fillRect(x, y + 1, this.chartOpt.legendWidth, this.chartOpt.legendHeight)
        }
      } else {
        const x = startX + legendWidth * i + this.chartOpt.legendWidth * i
        const y = this.chartOpt.bottom - this.chartOpt.legendHeight

        ctx.fillStyle = this.dataSet.xAxis.color
        this.setFont(ctx, this.dataSet.legend.size)
        ctx.textAlign = 'left'
        ctx.fillText(
          series[i].name,
          x + this.chartOpt.chartSpace + this.chartOpt.legendWidth,
          this.chartOpt.bottom
        )

        const color = this.getColor(i)
        ctx.fillStyle = color
        ctx.lineWidth = 2
        ctx.strokeStyle = color
        if (series[i].category === 'bar') {
          ctx.fillRect(x, y + 1, this.chartOpt.legendWidth, this.chartOpt.legendHeight)
        } else if (series[i].category === 'line') {
          const lx = x + this.chartOpt.legendWidth / 2
          const ly = y + this.chartOpt.legendHeight / 2 + 1
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
   * 缁樺埗鏁版嵁鏍囩
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param text - 瑕佺粯鍒剁殑鏂囨湰
   * @param x - 鏂囨湰鐨?X 鍧愭爣
   * @param y - 鏂囨湰鐨?Y 鍧愭爣
   * @param color - 鏂囨湰鐨勯鑹?
   */
  private drawToolTips(
    ctx: ChartContext,
    text: string,
    x: number,
    y: number,
    color: string
  ): void {
    ctx.fillStyle = color
    this.setFont(ctx, this.dataSet.xAxis.size)
    ctx.textAlign = 'center'
    ctx.fillText(text, x, y)
  }

  /**
   * 鐢诲浘
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   */
  private drawCharts(ctx: ChartContext): void {
    const series = this.dataSet.series
    for (let i = 0; i < series.length; i++) {
      const category = series[i].category
      let barWidth = this.getPointWidth()
      const barHeight = this.chartOpt.axisBottom - this.chartOpt.axisTop
      const maxMark = this.chartOpt.axisYMarks[this.chartOpt.axisYMarks.length - 1]

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
   * 缁樺埗鏌辩姸鍥?
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param i - 绯诲垪鐨勭储寮?
   * @param series - 绯诲垪鏁版嵁
   * @param barWidth - 鏌辩姸鍥剧殑瀹藉害
   * @param barHeight - 鏌辩姸鍥剧殑楂樺害
   * @param maxMark - Y 杞存渶澶у埢搴﹀€?
   */
  private drawBarChart(
    ctx: ChartContext,
    i: number,
    series: ISerie[],
    barWidth: number,
    barHeight: number,
    maxMark: number
  ): void {
    const item = series[i]
    const itemWidth = barWidth / this.chartOpt.barNum

    for (let k = 0; k < item.data.length; k++) {
      const itemHeight = barHeight * ((item.data[k] as number) / maxMark)
      const x = this.toViewportX(
        barWidth * k +
          this.chartOpt.axisLeft +
          k * this.chartOpt.chartSpace +
          this.chartOpt.chartSpace / 2 +
          i * itemWidth
      )
      const y = this.chartOpt.axisBottom - itemHeight
      if (!this.isXVisible(x, itemWidth)) continue
      const color = this.getColor(series.length <= 1 ? k : i)
      ctx.fillStyle = color
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
   * 缁樺埗鎶樼嚎鍥?
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param i - 绯诲垪鐨勭储寮?
   * @param series - 绯诲垪鏁版嵁
   * @param barWidth - 鏌辩姸鍥剧殑瀹藉害
   * @param barHeight - 鏌辩姸鍥剧殑楂樺害
   */
  private drawLineChart(
    ctx: ChartContext,
    i: number,
    series: ISerie[],
    barWidth: number,
    barHeight: number
  ): void {
    const item = series[i]
    // 鏇存柊鏋氫妇寮曠敤
    const lineType = item.type || EnumLineType.SOLID
    const color = this.getColor(i)
    ctx.lineWidth = item.type === EnumLineType.DASHED ? 1.5 : this.dataSet.chart?.lineWidth || 2
    ctx.strokeStyle = color
    ctx.beginPath()

    let prevPoint: { x: number; y: number } | null = null
    for (let k = 0; k < item.data.length; k++) {
      if (isNullOrUnDef(item.data[k])) continue
      const point = this.getLinePoint(k, item, barWidth, barHeight)
      const segmentVisible =
        this.isXVisible(point.x, barWidth * 1.5) || (prevPoint && this.isXVisible(prevPoint.x, barWidth * 1.5))
      if (!segmentVisible) {
        prevPoint = point
        continue
      }
      if (k === 0 || !prevPoint) {
        ctx.moveTo(point.x, point.y)
      } else {
        // 鏇存柊鏋氫妇寮曠敤
        if (lineType === EnumLineType.SOLID) {
          ctx.lineTo(point.x, point.y)
        } else if (lineType === EnumLineType.DASHED && prevPoint) {
          // 缁樺埗铏氱嚎
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
      const isShow = isFunction(item.toolTips.show) ? item.toolTips.show(k) : item.toolTips.show
      if (isShow) {
        const point = this.getLinePoint(k, item, barWidth, barHeight)
        if (!this.isXVisible(point.x, 24)) continue
        this.drawPoint(ctx, point.x, point.y, 3, color)
        this.drawPoint(ctx, point.x, point.y, 1, this.chartOpt.bgColor)
        const label = item.toolTips.formatter?.(item.data) || (item.data[k] as number).toString()
        const x = point.x + (item.toolTips.offset?.[0] || 0)
        const y = point.y + (item.toolTips.offset?.[1] || 0)
        this.drawToolTips(ctx, label, x, y - this.chartOpt.chartSpace, color)
      }
    }
  }

  /**
   * 鑾峰彇鎶樼嚎鍥句笂鐐圭殑鍧愭爣
   * @param k - 鏁版嵁鐐圭殑绱㈠紩
   * @param item - 绯诲垪鏁版嵁椤?
   * @param barWidth - 鏌辩姸鍥剧殑瀹藉害
   * @param barHeight - 鏌辩姸鍥剧殑楂樺害
   * @returns 鐐圭殑鍧愭爣瀵硅薄
   */
  private getLinePoint(
    k: number,
    item: ISerie,
    barWidth: number,
    barHeight: number
  ): { x: number; y: number } {
    const maxY = this.chartOpt.axisYMarks[this.chartOpt.axisYMarks.length - 1]
    const minY = this.chartOpt.axisYMarks[0]
    const x = this.toViewportX(this.getPointX(k, barWidth))
    const y =
      this.chartOpt.axisBottom - barHeight * (((item.data[k] as number) - minY) / (maxY - minY))

    return { x, y }
  }

  private getPointWidth(): number {
    const divisor = this.dataSet.chart?.pointOnTick
      ? Math.max(this.chartOpt.barLength - 1, 1)
      : this.chartOpt.barLength
    const pointLeft = this.getPointLeft()
    const pointRight = this.getPointRight()
    return (pointRight - pointLeft) / divisor
  }

  private getPointX(index: number, pointWidth: number): number {
    const pointLeft = this.getPointLeft()
    if (this.dataSet.chart?.pointOnTick) {
      return pointWidth * index + pointLeft
    }
    return pointWidth * index + pointLeft + pointWidth / 2
  }

  private getPointLeft(): number {
    return this.chartOpt.axisLeft + (this.dataSet.chart?.pointStartPadding || 0)
  }

  private getPointRight(): number {
    return this.chartOpt.right - (this.dataSet.chart?.pointEndPadding || 0)
  }

  private getLayoutWidth(): number {
    return Math.max(this.dataSet.chart?.scrollContentWidth || 0, this.chartOpt.chartWidth)
  }

  private getScrollLeft(): number {
    const viewportWidth = this.dataSet.chart?.width || 0
    const contentWidth = this.dataSet.chart?.scrollContentWidth || 0
    const maxScrollLeft = Math.max(0, contentWidth - viewportWidth)
    const scrollLeft = this.dataSet.chart?.scrollLeft || 0
    return Math.min(Math.max(scrollLeft, 0), maxScrollLeft)
  }

  private toViewportX(x: number): number {
    if (this.dataSet.chart?.renderOnlyContent) return x
    if (!this.dataSet.chart?.scrollContentWidth) return x
    if (x <= this.chartOpt.axisLeft) return x
    return x - (this.chartOpt.scrollLeft || 0)
  }

  private getViewportRight(): number {
    if (this.dataSet.chart?.renderOnlyContent) return this.chartOpt.right
    return this.chartOpt.chartWidth - this.chartOpt.chartSpace
  }

  private isXVisible(x: number, buffer = 0): boolean {
    if (this.dataSet.chart?.renderOnlyContent) return true
    if (!this.dataSet.chart?.scrollContentWidth) return true
    return x >= this.chartOpt.axisLeft - buffer && x <= this.chartOpt.chartWidth + buffer
  }

  /**
   * 缁樺埗鐐?
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param x - 鐐圭殑 X 鍧愭爣
   * @param y - 鐐圭殑 Y 鍧愭爣
   * @param radius - 鐐圭殑鍗婂緞
   * @param color - 鐐圭殑棰滆壊
   */
  private drawPoint(
    ctx: ChartContext,
    x: number,
    y: number,
    radius: number,
    color: string
  ): void {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
    ctx.closePath()
  }

  /**
   * 缁樺埗楗煎浘
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param i - 绯诲垪鐨勭储寮?
   * @param series - 绯诲垪鏁版嵁
   */
  private drawPieChart(ctx: ChartContext, i: number, series: ISerie[]): void {
    const item = series[i]

    const x = (this.chartOpt.right - this.chartOpt.left) / 2 + this.chartOpt.left
    const radius = (this.chartOpt.axisBottom - this.chartOpt.axisTop) / 3
    const y = (this.chartOpt.axisBottom - this.chartOpt.axisTop) / 2 + this.chartOpt.axisTop

    let lastAngel = 0
    for (let k = 0; k < item.data.length; k++) {
      const color = this.getColor(k)

      const curAngel = (2 / this.chartOpt.chartPieCount) * (item.data[k] as number)
      const precent = (100 / this.chartOpt.chartPieCount) * (item.data[k] as number)

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

      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x, y, radius, (lastAngel - 0.5) * Math.PI, (lastAngel + curAngel - 0.5) * Math.PI)
      ctx.fill()
      ctx.closePath()
      lastAngel += curAngel
    }
  }

  /**
   * 缁樺埗楗煎浘鏁版嵁鏍囩
   * @param ctx - Taro 鐨?Canvas 涓婁笅鏂囧璞?
   * @param value - 瑕佹樉绀虹殑鍊?
   * @param color - 鏍囩鐨勯鑹?
   * @param x - 鍦嗗績鐨?X 鍧愭爣
   * @param y - 鍦嗗績鐨?Y 鍧愭爣
   * @param radius - 楗煎浘鐨勫崐寰?
   * @param lastAngel - 涓婁竴涓墖褰㈢殑瑙掑害
   * @param curAngel - 褰撳墠鎵囧舰鐨勮搴?
   */
  private drawPieToolTips(
    ctx: ChartContext,
    value: string,
    color: string,
    x: number,
    y: number,
    radius: number,
    lastAngel: number,
    curAngel: number
  ): void {
    const textWidth = this.measureText(value, this.dataSet.xAxis.size)
    const cosc = Math.cos((lastAngel - 0.5 + curAngel / 2) * Math.PI)
    const sinc = Math.sin((lastAngel - 0.5 + curAngel / 2) * Math.PI)
    const x1 = radius * cosc + x
    const y1 = radius * sinc + y

    const x2 = (radius + 20) * cosc + x
    const y2 = (radius + 20) * sinc + y

    ctx.fillStyle = color
    ctx.textAlign = x2 < x1 ? 'right' : 'left'
    this.setFont(ctx, this.dataSet.xAxis.size)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
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
   * 鑾峰彇鏌辩姸鍥鹃鑹插€硷紝寰幆娓叉煋
   * @param index - 棰滆壊鐨勭储寮?
   * @returns 棰滆壊鍊?
   */
  private getColor(index: number): string {
    const cLength = this.dataSet.colors.length
    if (index >= cLength) {
      return this.dataSet.colors[index % cLength]
    } else {
      return this.dataSet.colors[index]
    }
  }

  /**
   * 淇濆瓨鍥捐〃涓哄浘鐗?
   * @param func - 鍥炶皟鍑芥暟
   */
  public saveCanvas(func: () => void): void {
    if (!this.canvasNode) return

    canvas2DToTempFilePath(this.canvasNode).then((res) => {
      // Taro.previewImage({
      //   urls: [res.tempFilePath],
      // })
      Taro.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(ress) {
          console.log(ress)
          func?.()
        }
      })
    })
  }

  public async saveCanvasWithOffscreenFallback(func: () => void): Promise<void> {
    if (this.canvasNode) {
      const res = await canvas2DToTempFilePath(this.canvasNode)
      await Taro.saveImageToPhotosAlbum({ filePath: res.tempFilePath })
      func?.()
      return
    }

    if (typeof wx !== 'undefined' && wx.createOffscreenCanvas) {
      // 预留离屏合成入口；当前展示路径不依赖离屏 canvas。
      return
    }
  }

  private setFont(ctx: ChartContext, size: number): void {
    ctx.font = `${size}px sans-serif`
    ctx.textBaseline = 'alphabetic'
  }

  /**
   * 娴嬮噺鏂囧瓧瀹藉害锛?
   * Canvas瀹藉害澶ぇ锛屽井淇℃彁渚涚殑setTextAlign(center)
   * 鏂规硶骞朵笉鑳藉噯纭眳涓樉绀?
   */
  private measureText(text: string, textSize: number) {
    const ratio = textSize / 20
    const texts = text.split('')
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
   * 璁＄畻Y杞存樉绀哄埢搴?
   */
  private calculateY(
    dMin: number,
    dMax: number,
    iMaxAxisNum: number,
    paddingRatio = 0.08,
    minValue?: number,
    integerOnly = false
  ) {
    if (!Number.isFinite(dMin) || !Number.isFinite(dMax)) {
      const min = minValue ?? 0
      return [min, min + 1]
    }
    if (iMaxAxisNum < 1 || dMax < dMin) return [] as number[]

    if (integerOnly) {
      const min = minValue ?? Math.floor(dMin)
      const padding = Math.max(1, dMax - min) * paddingRatio
      const max = Math.max(Math.ceil(dMax + padding), min + 1)
      const interval = Math.max(1, Math.ceil((max - min) / Math.max(iMaxAxisNum - 1, 1)))
      const yIndex = [] as number[]

      for (let value = min; value <= max; value += interval) {
        yIndex.push(value)
      }
      if (yIndex[yIndex.length - 1] < max) {
        yIndex.push(max)
      }

      return yIndex.length < 2 ? [min, min + 1] : yIndex
    }

    let dDelta = dMax - dMin
    if (dDelta < 1.0) {
      dMax += (1.0 - dDelta) / 2.0
      dMin -= (1.0 - dDelta) / 2.0
    }
    const padding = (dMax - dMin) * paddingRatio
    dMax += padding
    dMin -= padding
    dDelta = dMax - dMin

    const iExp = Math.floor(Math.log(dDelta) / Math.log(10.0)) - 1
    const dMultiplier = Math.pow(10, iExp)
    const dSolutions = [1, 2, 2.5, 5, 10, 20, 25, 50, 100, 200, 250, 500]
    let i
    for (i = 0; i < dSolutions.length; i++) {
      const dMultiCal = dMultiplier * dSolutions[i]
      if (Math.floor(dDelta / dMultiCal) + 1 <= iMaxAxisNum) {
        break
      }
    }

    const dInterval = dMultiplier * (dSolutions[i] || dSolutions[dSolutions.length - 1])
    if (!Number.isFinite(dInterval) || dInterval <= 0) {
      const min = minValue ?? 0
      return [min, Math.max(min + 1, dMax)]
    }

    const dStartPoint =
      minValue === undefined
        ? Math.floor(dMin / dInterval) * dInterval
        : Math.max(minValue, Math.floor(dMin / dInterval) * dInterval)
    const yIndex = [] as number[]
    for (let iAxisIndex = 0; iAxisIndex < 100; iAxisIndex++) {
      const y = dStartPoint + dInterval * iAxisIndex
      yIndex.push(Number(y.toFixed(2)))
      if (y > dMax) break
    }

    if (minValue !== undefined && yIndex[0] !== minValue) {
      yIndex.unshift(minValue)
    }

    if (yIndex.length < 2) {
      const min = minValue ?? yIndex[0] ?? 0
      return [min, min + 1]
    }

    return yIndex
  }

  /**
   * 缁樺埗铏氱嚎
   */
  private drawDashLine(
    ctx: ChartContext,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLen?: number
  ) {
    dashLen = dashLen === undefined ? 4 : dashLen
    const beveling = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    const num = Math.floor(beveling / dashLen)

    for (let i = 0; i < num; i++) {
      const x = x1 + ((x2 - x1) / num) * i
      const y = y1 + ((y2 - y1) / num) * i
      if (i % 2 == 0) {
        ctx.beginPath()
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.closePath()
      }
    }
  }

  private drawFixedYAxisOverlay(ctx: ChartContext): void {
    ctx.fillStyle = this.chartOpt.bgColor
    ctx.fillRect(0, 0, this.chartOpt.axisLeft + 1, this.chartOpt.chartHeight)

    if (this.dataSet.chart?.showYAxisLine !== false) {
      ctx.lineWidth = 0.5
      ctx.lineCap = 'round'
      ctx.strokeStyle = this.chartOpt.lineColor
      ctx.beginPath()
      ctx.moveTo(this.chartOpt.axisLeft, this.chartOpt.axisTop)
      ctx.lineTo(this.chartOpt.axisLeft, this.chartOpt.axisBottom)
      ctx.stroke()
      ctx.closePath()
    }

    const height =
      (this.chartOpt.axisBottom - this.chartOpt.axisTop) / (this.chartOpt.axisYMarks.length - 1)

    for (let i = 0; i < this.chartOpt.axisYMarks.length; i++) {
      const y = this.chartOpt.axisBottom - height * i
      ctx.fillStyle = this.dataSet.xAxis.color
      this.setFont(ctx, this.dataSet.xAxis.size)
      ctx.textAlign = 'right'
      ctx.fillText(
        this.chartOpt.axisYMarks[i].toString(),
        this.chartOpt.axisLeft - (this.dataSet.chart?.yAxisTextSpace ?? this.chartOpt.textSpace),
        y + this.chartOpt.textSpace
      )
    }
  }

  /**
   * 缁樺埗鍦嗚鐭╁舰
   */
  private drawRoundBar(
    ctx: ChartContext,
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
