<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  FooterBar,
  Form,
  type IFormItem,
  Navbar,
  Picker,
  Textarea,
  type FormInstance,
  Image,
  PickerView,
  DateTimePicker
} from '@mid-vue/taro-h5-ui'
import { navigateBack, useDictList, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import { type IFeedMilkState } from './types'
import bgMilkVolume from './assets/bg_milk_volume.png'
import { EnumFeedType } from '@/dict'

export default defineComponent({
  name: 'FeedMilk',
  setup() {
    const { query } = useRoute<IFeedRecord<IMilk>>()
    let babyInfo = getBabyInfo()
    let defaultMilk = {
      feedType: EnumFeedType.MILK,
      remark: '',
      babyId: babyInfo.id,
      content: {
        type: 10,
        volume: 150,
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
      } as IMilk
    }
    const state = reactive<IFeedMilkState>({
      form: { ...defaultMilk, ...query }
    })

    const formRef = ref<FormInstance>()

    const milkList = useDictList('MILK_TYPE')

    function initVolumeList() {
      const min = 30
      const max = 400
      let curr = min
      const volumeList = []
      while (curr < max) {
        volumeList.push({ code: curr, name: curr + 'ml' })
        curr += 5
      }
      return volumeList
    }
    const volumeList = initVolumeList()

    const cells: IFormItem<IMilk>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            field: 'volume',
            attrs: { required: true, border: true },
            component: () => (
              <div class='form-item-volume'>
                <Image src={bgMilkVolume} class='item-volume-bg'></Image>

                <PickerView
                  class='item-volume-picker'
                  maskClass='volume-picker-mask'
                  indicatorClass='volume-picker-indicator'
                  v-model={state.form.content.volume}
                  range={volumeList}
                ></PickerView>
              </div>
            )
          },
          {
            label: '喂养时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
          },
          {
            label: '喂养类型',
            field: 'type',
            attrs: { required: true },
            component: () => <Picker v-model={state.form.content.type} range={milkList}></Picker>
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
            component: () => <Textarea v-model={state.form.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const res = await apiFunc({ ...state.form, feedTime: state.form.content.feedTime }).catch(
        () => false
      )

      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='feed-milk'>
          <Navbar
            title='奶瓶喂养'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <Form class='feed-milk-form' ref={formRef} cells={cells} v-model={state.form}></Form>
          <FooterBar>
            <Button type='primary' size='large' round onClick={onSubmit}>
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
