<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { dateFormat } from '@mid-vue/shared'
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
} from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateBack, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiGetLatestFeedRecords, apiUpdateFeedRecord } from './api'
import { type IJaundiceState } from './types'
export default defineComponent({
  name: 'Jaundice',
  setup() {
    const { query } = useRoute<IFeedRecord<IJaundice>>()
    const babyInfo = getBabyInfo()

    const defaultJaundice = {
      feedType: EnumFeedType.JAUNDICE,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        unit: 'μmol/L',
        value: ''
      } as IJaundice
    }

    const state = reactive<IJaundiceState>({
      form: { ...defaultJaundice, ...query }
    })

    const formRef = ref<FormInstance>()

    // 定义黄疸单位列表
    const jaundiceUnits = ['mg/dL', 'μmol/L']
    // 自定义选择单位的函数
    const selectUnit = (value: string) => {
      state.form.content.unit = value
    }

    useDidShow(() => {
      if (query.id) return
      apiGetLatestFeedRecords({
        babyId: getBabyInfo().id,
        feedTypes: [EnumFeedType.JAUNDICE]
      }).then((list) => {
        if (!list[0]) return
        state.form.content = {
          ...list[0]?.content,
          feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      })
    })
    const cells: IFormItem<IJaundice>[] = [
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
            label: '单位',
            field: 'unit',
            attrs: { required: true, border: true },
            component: () => (
              <div class='unit-selector'>
                {jaundiceUnits.map((unit) => {
                  const isSelected = state.form.content.unit === unit
                  return (
                    <div
                      key={unit}
                      onClick={() => selectUnit(unit)}
                      class={`unit-option ${isSelected ? 'selected' : ''}`}
                    >
                      <div class='radio'>{isSelected && <div class='dot' />}</div>
                      <span>{unit}</span>
                    </div>
                  )
                })}
              </div>
            )
          },
          {
            label: '黄疸指数',
            field: 'value',
            attrs: { required: true, border: true },
            component: () => (
              <Input
                type='digit'
                v-model={state.form.content.value}
                placeholder='请输入数值'
                maxlength='5'
              ></Input>
            ),
            slots: { append: () => state.form.content.unit }
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
      // 新增卡片说明
      {
        attrs: {
          class: 'jaundice-reference-card'
        },
        component: () => (
          <div>
            <div class='card-title'>黄疸指数的参考数值</div>
            <ol class='reference-list'>
              <li>1.单位换算,1mg/dL = 17.1μmol/L;</li>
              <li>
                2.足月婴儿的黄疸指数平均不超过12mg/dL(约205μmol/L),一般于出生后2~3天出现,4～5天达高峰,5～7天消退;
              </li>
              <li>
                3.早产婴儿的黄疸指数平均不超过15mg/dL(约255μmol/L),一般于出生后3~5天出现,5～7天达高峰,7~9天消退;
              </li>
            </ol>
          </div>
        )
      }
    ]
    const onSubmit = async () => {
      if (!state.form.content.value) {
        Taro.showToast({
          title: '请输入黄疸数值!',
          icon: 'none'
        })
        return
      }
      const apiFunc = state.form.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const record = { ...state.form, feedTime: state.form.content.feedTime }
      const res = await apiFunc(record).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='jaundice'>
          <Navbar
            title='黄疸记录'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'fff8e5'
            }}
          ></Navbar>
          <Form class='jaundice-form' ref={formRef} cells={cells} v-model={state.form}></Form>
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
