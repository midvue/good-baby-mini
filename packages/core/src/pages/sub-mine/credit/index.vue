<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import { Button, Image, Navbar } from '@mid-vue/taro-h5-ui'
import bgCreditHeader from './assets/credit_bg.png'
import { apiPointList, apiPointSummary, apiUpdatePoint } from './api'
import { Point } from './types'
import { EnumPointStatus, pointStatusStrategy } from './dict'

export default defineComponent({
  name: 'Credit',
  setup() {
    let state = reactive({
      summary: {
        totalPoints: 0,
        todayPoints: 0
      },
      pointList: [] as Point[]
    })

    function init() {
      apiPointSummary().then((summary) => {
        state.summary = summary
      })
      apiPointList().then((list) => {
        state.pointList = list || []
      })
    }
    init()

    function onPointClick(point: Point) {
      if (point.status === EnumPointStatus.COMPLETED) {
        apiUpdatePoint(point.code).then(() => {
          init()
        })
      }
    }

    return () => {
      return (
        <div class='credit'>
          <Navbar position='fixed' clearfix={false} autoTheme></Navbar>
          <div class='credit-contain'>
            <Image src={bgCreditHeader} class='credit-bg' />
            <div class='credit-content'>
              <div class='credit-content-left'>
                <span class='credit-title'>我的积分</span>
                <span>{state.summary.totalPoints}</span>
              </div>
              <div class='credit-line'></div>
              <div class='credit-content-right'>
                <span class='credit-title'>今日积分</span>
                <span>{state.summary.todayPoints || 0}</span>
              </div>
            </div>
          </div>
          <div class='credit-list'>
            {state.pointList.map((item, index) => {
              let strategy = pointStatusStrategy[item.status]

              return (
                <div class='credit-item' key={index}>
                  <div class='item-left'>
                    <div class='item-icon-wrap'>+{item.points}</div>
                    <div class='item-content'>
                      <div class='item-title'>{item.description}</div>
                      <div class='item-text'>奖励{item.points}积分</div>
                    </div>
                  </div>
                  <Button
                    class='item-right'
                    size='small'
                    type={strategy.type}
                    round
                    disabled={strategy.disabled}
                    onClick={() => onPointClick(item)}
                  >
                    {strategy.text}
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
