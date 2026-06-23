<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { Button, Image, Navbar } from '@allkit/taro-h5-ui'
import { apiPointList, apiPointSummary, apiPointToday, apiUpdatePoint } from './api'
import { type Point } from './types'
import { EnumPointStatus, EnumTriggerType, pointStatusStrategy, ruleRouteStrategy } from './dict'
import { switchTab, navigateTo } from '@/use'

export default defineComponent({
  name: 'Credit',
  setup() {
    const state = reactive({
      summary: {
        totalPoints: 0,
        earnedPoints: 0,
        consumedPoints: 0
      },
      todayPoints: 0,
      pointList: [] as Point[]
    })

    function init() {
      apiPointList().then((list) => {
        state.pointList = list || []
      })
      apiPointSummary().then((summary) => {
        state.summary = summary
      })
      apiPointToday().then((res) => {
        state.todayPoints = res?.todayPoints || 0
      })
    }
    init()

    function onPointClick(point: Point) {
      // MANUAL类型且待领取：领取积分
      if (
        point.triggerType === EnumTriggerType.MANUAL &&
        point.status === EnumPointStatus.COMPLETED
      ) {
        apiUpdatePoint(point.code).then(() => {
          init()
        })
        return
      }
      // 未完成状态：跳转到对应页面去完成
      if (point.status === EnumPointStatus.UNCOMPLETED) {
        const route = ruleRouteStrategy[point.code]
        if (route) {
          route.isTab ? switchTab({ path: route.path }) : navigateTo({ path: route.path })
        }
      }
    }

    return () => {
      return (
        <div class='credit'>
          <Navbar position='fixed' clearfix={false} autoTheme></Navbar>
          <div class='credit-contain'>
            <Image src='mine/img_credit_bg.png' class='credit-bg' />
            <div class='credit-content'>
              <div class='credit-content-left'>
                <span class='credit-title'>我的积分</span>
                <span>{state.summary.totalPoints}</span>
              </div>
              <div class='credit-line'></div>
              <div class='credit-content-right'>
                <span class='credit-title'>今日积分</span>
                <span>{state.todayPoints || 0}</span>
              </div>
            </div>
          </div>
          <div class='credit-list'>
            {state.pointList.map((item, index) => {
              const strategy =
                pointStatusStrategy[item.status] || pointStatusStrategy[EnumPointStatus.UNCOMPLETED]

              return (
                <div class='credit-item' key={index}>
                  <div class='item-left'>
                    <div class='item-icon-wrap'>+{item.points}</div>
                    <div class='item-content'>
                      <div class='item-title'>{item.title}</div>
                      <div class='item-text'>{item.description}</div>
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
