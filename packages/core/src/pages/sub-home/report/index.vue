<script lang="tsx">
import { defineComponent } from 'vue'
import { Image, Navbar } from '@mid-vue/taro-h5-ui'
import itemIcon from '@/assets/images/img_baby_avatar.png'
import bgReportHeader from './assets/bg_report.png'

export default defineComponent({
  name: 'Report',
  setup() {
    const reportList = [
      {
        title: '喂养',
        bgColor: '#FFF3F3',
        icon: itemIcon,
        items: [
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          }
        ]
      },
      {
        title: '喂养',
        bgColor: '#F9F2E7',
        icon: itemIcon,
        items: [
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          },
          {
            title: '总量',
            value: '1000',
            unit: 'ml'
          }
        ]
      }
    ]
    const summaryList = ['本周宝宝的喂养情况良好', '体重增长明显', '精神状态活泼']
    return () => {
      return (
        <div class='report'>
          <Navbar position='fixed' clearfix={false}></Navbar>
          <div class='baby-report'>
            <Image src={bgReportHeader} class='baby-report-bg'></Image>
            <div class='baby-report-title'>宝宝周报 </div>
            <div class='baby-report-date'>2023.3.5-3.15</div>
          </div>
          {reportList.map((item, index) => {
            return (
              <div class='report-item' key={index}>
                <div class='title-content'>
                  <div
                    class='icon-container'
                    style={{
                      backgroundColor: item.bgColor
                    }}
                  >
                    <Image src={item.icon} class='icon' />
                  </div>
                  <div class='title'>{item.title}</div>
                </div>
                <div class='content'>
                  {item.items.map((item, index) => {
                    return (
                      <div class='content-item' key={index}>
                        <div class='item-title'>{item.title}</div>
                        <div class='item-value'>
                          {item.value}
                          <span class='unit'>{item.unit}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <div class='summary'>
            <div class='summary-title'>总结</div>
            <ul class='summary-list'>
              {summaryList.map((item, index) => (
                <li class='summary-item' key={index}>
                  {item}
                </li>
              ))}
            </ul>
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
