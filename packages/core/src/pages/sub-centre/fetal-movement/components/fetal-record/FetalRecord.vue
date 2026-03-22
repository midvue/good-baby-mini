<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { ScrollView } from '@tarojs/components'
import { useDate } from '@allkit/shared'
import { type FetalMovement } from '../../types'
import { apiGetFetalRecords } from './api'

export default defineComponent({
  name: 'FetalRecord',
  setup() {
    const headers = [
      {
        title: '记录时间',
        className: 'item-start-time'
      },
      {
        title: '胎动次数',
        className: 'item-count'
      },
      {
        title: '结果',
        className: 'item-expect-date'
      }
    ]
    const state = reactive({
      list: [] as FetalMovement[]
    })

    const getList = async () => {
      state.list = await apiGetFetalRecords()
    }

    getList()
    // 获取关系和红包类型字典
    return () => (
      <div class='fetal-records-container'>
        <div class='fetal-records mv-hairline--top'>
          <div class='fetal-item item-title'>
            {headers.map((item, index) => (
              <div class={item.className} key={index}>
                {item.title}
              </div>
            ))}
          </div>
          <ScrollView class='fetal-records-scroll' scroll-y showScrollbar={false} enhanced>
            <div class='fetal-records-content'>
              {state.list.map((item) => (
                <div class='fetal-item mv-hairline--top' key={item.recordTime}>
                  <div class='item-start-time'>
                    {useDate(item.recordTime).format('MM-DD HH:mm:ss')}
                  </div>
                  <div class='item-count'>{item.count}</div>
                  <div
                    class={`item-expect-date ${item.count && item.count >= 3 ? 'normal' : 'less'}`}
                  >
                    {item.count && (item.count > 3 || item.count === 3) ? '胎动正常' : '胎动较少'}
                  </div>
                </div>
              ))}
            </div>
          </ScrollView>
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
