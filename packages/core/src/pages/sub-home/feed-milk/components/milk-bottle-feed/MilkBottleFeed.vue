<script lang="tsx">
import { defineComponent, type PropType, reactive, ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  type FormInstance,
  type IFormItem,
  Image,
  PickerView,
  Tag,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { dateFormat } from '@mid-vue/shared'
import { navigateBack, useDictList } from '@/use'
import { getBabyInfo } from '@/utils'
import { EnumFeedType } from '@/dict'
import { apiAddFeedRecord, apiGetLatestFeedRecords, apiUpdateFeedRecord } from './api'
import bgMilkVolume from './assets/bg_milk_volume.png'

export default defineComponent({
  name: 'MilkBottleFeed',
  props: {
    data: {
      type: Object as PropType<IFeedRecord<IMilkBottle>>
    }
  },
  emits: ['close'],
  setup(props) {
    /** 奶瓶喂养 */

    const babyInfo = getBabyInfo()
    const defaultMilk = {
      feedType: EnumFeedType.MILK_BOTTLE,
      remark: '',
      babyId: babyInfo.id,
      content: {
        type: '10',
        volume: 90,
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
      } as IMilkBottle
    }

    const state = reactive({
      form: { ...defaultMilk, ...props.data } as IFeedRecord<IMilkBottle>
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

    useDidShow(() => {
      if (!props.data?.id) return
      apiGetLatestFeedRecords({
        babyId: getBabyInfo().id,
        feedTypes: [EnumFeedType.MILK_BOTTLE]
      }).then((list) => {
        if (!list[0]) return
        state.form.content = {
          ...list[0]?.content,
          feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      })
    })

    const cells: IFormItem<IMilkBottle>[] = [
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
            component: () => (
              <div>
                {milkList.map((item) => (
                  <Tag
                    class='mr-[8px]'
                    size='medium'
                    type='primary'
                    plain={state.form.content.type !== item.code}
                    onClick={() => (state.form.content.type = item.code)}
                  >
                    {item.name}
                  </Tag>
                ))}
              </div>
            )
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
      },
      {
        render: () => (
          <Tag plain type='primary' size='small' round class='mt-[8px]'>
            添加完记录,回到记录列表,长按可以删除记录哦!
          </Tag>
        )
      }
    ]
    const onSubmit = async () => {
      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => (
      <>
        <Form class='feed-milk-form' ref={formRef} cells={cells} v-model={state.form}></Form>
        <FooterBar>
          <Button type='primary' size='large' round onClick={onSubmit}>
            保存
          </Button>
        </FooterBar>
      </>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
