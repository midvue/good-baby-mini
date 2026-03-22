<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { dateFormat } from '@allkit/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Input,
  Navbar,
  Textarea,
  type FormInstance,
  type IFormItem
} from '@allkit/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateBack, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiGetLatestFeedRecords, apiUpdateFeedRecord } from './api'
import { type IMedicineState } from './types'
export default defineComponent({
  name: 'Medicine',
  setup() {
    const { query } = useRoute<IFeedRecord<IMedicine>>()
    const babyInfo = getBabyInfo()

    const defaultMedicine = {
      feedType: EnumFeedType.MEDICINE,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        name: ''
      } as IMedicine
    }

    const state = reactive<IMedicineState>({
      form: { ...defaultMedicine, ...query }
    })

    const formRef = ref<FormInstance>()

    useDidShow(() => {
      if (query.id) return
      apiGetLatestFeedRecords({
        babyId: getBabyInfo().id,
        feedTypes: [EnumFeedType.MEDICINE]
      }).then((list) => {
        if (!list[0]) return
        state.form.content = {
          ...list[0]?.content,
          feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      })
    })
    const cells: IFormItem<IMedicine>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '记录时间',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
          },
          {
            label: '药品名称',
            field: 'name',
            attrs: { required: true, border: true },
            component: () => (
              <Input
                v-model={state.form.content.name}
                placeholder='请输入药品名称'
                maxlength='20'
              ></Input>
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
            component: () => (
              <Textarea
                v-model={state.form.remark}
                placeholder='(可选) 请输入备注'
                maxLength={100}
              ></Textarea>
            )
          }
        ]
      }
    ]
    const onSubmit = async () => {
      if (!state.form.content.name) {
        Taro.showToast({
          title: '请输入药品名称!',
          icon: 'none'
        })
        return
      }
      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '保存成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='medicine'>
          <Navbar
            title='用药记录'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'fff8e5'
            }}
          ></Navbar>
          <Form class='medicine-form' ref={formRef} cells={cells} v-model={state.form}></Form>
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
