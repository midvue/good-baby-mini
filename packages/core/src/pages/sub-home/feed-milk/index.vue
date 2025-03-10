<script lang="tsx">
import { navigateBack, useDictList, useRoute } from '@/use'
import {
  Button,
  FooterBar,
  Form,
  type FormInstance,
  IFormItem,
  Input,
  Navbar,
  Picker,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import Taro from '@tarojs/taro'
import { defineComponent, ref } from 'vue'
import { apiAddFeedRecord } from './api'
import { IMilk, type IFeedMilkState } from './types'
import { dateFormat } from '@mid-vue/shared'
import { getBabyInfo } from '@/utils'

export default defineComponent({
  name: 'feed-milk',
  setup() {
    const { query } = useRoute<{ feedType: number }>()
    const [state] = defineCtxState<IFeedMilkState>({
      feedType: query.feedType,
      remark: '',
      form: {
        feedTime: dateFormat(Date.now(), `HH:mm`)
      } as IMilk
    })

    const formRef = ref<FormInstance>()

    let milkList = useDictList('MILK_TYPE')

    function initVolumeList() {
      let min = 30
      let max = 400
      let curr = min
      let volumeList = []
      while (curr < max) {
        volumeList.push({ code: curr, name: curr + 'ml' })
        curr += 5
      }
      return volumeList
    }
    let volumeList = initVolumeList()

    const cells: IFormItem<IFeedMilkState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '喂养时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.feedTime} mode='time'></Picker>
          },
          {
            label: '喂养类型',
            field: 'type',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.type} range={milkList}></Picker>
          },
          {
            label: '喂养容量',
            field: 'volume',
            attrs: { required: true },
            component: () => <Picker v-model={state.form.volume} range={volumeList}></Picker>
          }
        ]
      },
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '备注',
            attrs: {
              labelAlign: 'top'
            },
            component: () => <Textarea v-model={state.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let feedTime = dateFormat(Date.now(), `YYYY-MM-DD ${state.form.feedTime}`)
      const res = await apiAddFeedRecord({
        babyId: getBabyInfo().id,
        feedType: state.feedType,
        remark: state.remark,
        feedTime,
        content: { ...state.form, feedTime }
      }).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='feed-milk'>
          <Navbar
            title='首页'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <Form ref={formRef} cells={cells} v-model={state.form}></Form>
          <FooterBar>
            <Button type='warning' size='large' onClick={onSubmit}>
              保存
            </Button>
          </FooterBar>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
