<script lang="tsx">
import { defineComponent, ref } from 'vue'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import bgCreditHeader from './assets/credit_bg.png'
interface CreditItem {
  name: string
  data: number
  // 0 代表未领取，1 代表已领取，2 代表不可领取
  status: 0 | 1 | 2
}
export default defineComponent({
  name: 'Credit',
  setup() {
    // 使用 ref 定义响应式数据
    const creditList = ref<CreditItem[]>([
      {
        name: '邀请的新用户添加了宝宝信息',
        data: 10,
        status: 0
      },
      {
        name: '添加宝宝信息',
        data: 10,
        status: 1
      },
      {
        name: '关注公众号',
        data: 10,
        status: 2
      }
    ])

    const statusTextMap: Record<0 | 1 | 2, string> = {
      0: '领取奖励',
      1: '已领取',
      2: '已完成'
    }
    return () => {
      return (
        <div class='credit'>
          <Navbar position='fixed' clearfix={false}></Navbar>
          <div class='credit-contain'>
            <Image src={bgCreditHeader} class='credit-bg' />
            <div class='credit-content'>
              <div class='credit-content-left'>
                <span class='credit-title'>我的积分</span>
                <span>1000</span>
              </div>
              <div class='credit-line'></div>
              <div class='credit-content-right'>
                <span class='credit-title'>今日积分</span>
                <span>10</span>
              </div>
            </div>
          </div>
          <div className='credit-list'>
            {creditList.value.map((item, index) => {
              return (
                <div class='credit-item' key={index}>
                  <div class='item-left'>
                    <div class='item-icon-wrap'>+{item.data}</div>
                    <div class='item-content'>
                      <div class='item-title'>{item.name}</div>
                      <div class='item-text'>奖励10积分</div>
                    </div>
                  </div>
                  <div class={`item-right item-right-status-${item.status}`}>
                    {statusTextMap[item.status]}
                  </div>
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
