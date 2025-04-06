<script lang="tsx">
import { navigateBack, useDictList } from '@/use'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  FormInstance,
  IFormItem,
  Image,
  Picker,
  PickerView,
  Tag,
  Textarea
} from '@mid-vue/taro-h5-ui'
import Taro from '@tarojs/taro'
import { defineComponent, PropType, reactive, ref } from 'vue'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import bgMilkVolume from './assets/bg_milk_volume.png'
import { getBabyInfo } from '@/utils'
import { EnumFeedType } from '@/dict'
import { dateFormat } from '@mid-vue/shared'

export default defineComponent({
  name: 'BreastMilkFeed',
  props: {
    data: {
      type: Object as PropType<IFeedRecord<IMilkBottle>>
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    /** 奶瓶喂养 */

    let babyInfo = getBabyInfo()
    let defaultMilk = {
      feedType: EnumFeedType.MILK_BOTTLE,
      remark: '',
      babyId: babyInfo.id,
      content: {
        type: 10,
        volume: 150,
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm:ss')
      } as IMilkBottle
    }
    const state: { form: IFeedRecord<IMilkBottle> } = reactive({
      form: { ...defaultMilk, ...props.data }
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
            component: () => <div class='form-item-volume'></div>
          },
          {
            label: '开始时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
          },
          {
            field: 'type',
            render: () => {
              return (
                <div>
                  <span>左边</span>
                  <span>右边</span>
                </div>
              )
            }
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
