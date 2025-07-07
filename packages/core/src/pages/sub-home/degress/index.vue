<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import Taro from '@tarojs/taro'
import { useDate } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Image,
  Input,
  Navbar,
  Textarea,
  type FormInstance,
  type IFormItem
} from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateBack, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import { type IDegressState } from './types'
export default defineComponent({
  name: 'Degress',
  setup() {
    const { query } = useRoute<IFeedRecord<IDegress>>()
    const babyInfo = getBabyInfo()

    const defaultDgress = {
      feedType: EnumFeedType.DEGRESS,
      remark: '',
      babyId: babyInfo.id,
      content: {
        temperature: '',
        feedTime: useDate().format('YYYY-MM-DD HH:mm')
      } as IDegress
    }

    const state = reactive<IDegressState>({
      form: { ...defaultDgress, ...query }
    })

    const formRef = ref<FormInstance>()

    const cells: IFormItem<IDegress>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '',
            field: 'temperature',
            attrs: { required: true, border: true },
            component: () => (
              <Input
                type='digit'
                v-model={state.form.content.temperature}
                placeholder='请输入数值'
                maxlength='4'
                class='center-input large-text'
              ></Input>
            ),
            slots: { append: () => <span class='append-center'>℃</span> }
          },
          {
            label: '记录时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <DateTimePicker v-model={state.form.content.feedTime}></DateTimePicker>
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
      },
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '体温参考(单位:°C)',
            attrs: {
              labelAlign: 'top'
            },
            component: () => (
              <div class='w-full flex flex-col items-center justify-center'>
                <Image
                  onClick={(e) => {
                    Taro.previewImage({
                      urls: [e.detail]
                    })
                  }}
                  mode='widthFix'
                  src='home/img_degress.png'
                />
                <div class='text-[10px] mt-[6px]'>
                  数据仅供参考，若体温异常，建议带宝宝及时就诊，以医生诊断为准。
                </div>
              </div>
            )
          }
        ]
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

    return () => {
      return (
        <div class='degress'>
          <Navbar
            title='体温记录'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: '#e8e5fa'
            }}
          ></Navbar>
          <Form class='degress-form' ref={formRef} cells={cells} v-model={state.form}></Form>
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
