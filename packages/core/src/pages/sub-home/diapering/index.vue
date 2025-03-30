<script lang="tsx">
import { navigateBack, useDictList, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Icon,
  IFormItem,
  Navbar,
  Textarea,
  type FormInstance
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { defineComponent, ref } from 'vue'
import { apiAddFeedRecord, apiUpdateFeedRecord } from './api'
import { EnumDiaperType, type IFeedMilkState } from './types'

export default defineComponent({
  name: 'feed-milk',
  setup() {
    const { query } = useRoute<IFeedRecord<IDiaper>>()
    const [state] = defineCtxState<IFeedMilkState>({
      id: query.id,
      babyId: query.babyId || getBabyInfo().id,
      feedType: query.feedType,
      remark: query.remark,
      form: {
        ...{
          feedTime: dateFormat(Date.now(), `YYYY-MM-DD HH:mm`),
          type: '10',
          poopType: '10',
          poopColor: '10'
        },
        ...query.content
      }
    })

    const formRef = ref<FormInstance>()

    const poopTypeList = useDictList('POOP_TYPE')
    const poopColorList = useDictList('POOP_COLOR')
    const diaperTypeList = useDictList('DIAPER_TYPE')
    const cells: IFormItem<IFeedMilkState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '尿布状态',
            field: 'type',

            attrs: {
              labelAlign: 'top'
            },
            component: () => {
              return (
                <div class='grid grid-cols-4 gap-10 size-full'>
                  {diaperTypeList.map((item) => (
                    <div
                      class={{ 'diaper-type-item': true, active: state.form.type === item.code }}
                      onClick={() => (state.form.type = item.code)}
                    >
                      <div class={'diaper-type-image ' + item.ext}>
                        {state.form.type === item.code && <Icon name='mv-icon-checked'></Icon>}
                      </div>
                      {item.name}
                    </div>
                  ))}
                  {/* <p class='py-8'>尿布重量</p>
                  <div class='flex justify-between size-full'>
                    {['很轻', '正常', '很重'].map((item) => (
                      <Button class='tag-item' size='small' round type='warning'>
                        {item}
                      </Button>
                    ))}
                  </div> */}
                </div>
              )
            }
          },
          {
            label: '臭臭状态',
            field: 'poopType',
            attrs: {
              labelAlign: 'top',
              class: 'py-10'
            },
            show: () => state.form.type !== EnumDiaperType.PEE,
            component: () => (
              <div class='grid grid-cols-3 gap-10 size-full'>
                {poopTypeList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.poopType === item.code }}
                    onClick={() => (state.form.poopType = item.code)}
                  >
                    {state.form.poopType === item.code ? (
                      <Icon name='mv-icon-checked'></Icon>
                    ) : (
                      <></>
                    )}
                    {item.name}
                  </div>
                ))}
              </div>
            )
          },
          {
            label: '臭臭颜色',
            field: 'poopColor',
            attrs: {
              labelAlign: 'top',
              class: 'py-10',
              border: true
            },
            show: () => state.form.type !== EnumDiaperType.PEE,
            component: () => (
              <div class='form-item-color'>
                <ScrollView scrollX class='color-list'>
                  {poopColorList.map((item) => (
                    <div
                      class='color-item'
                      style={{ background: item.ext }}
                      onClick={() => (state.form.poopColor = item.code)}
                    >
                      {state.form.poopColor === item.code ? (
                        <Icon name='mv-icon-checked'></Icon>
                      ) : (
                        <></>
                      )}
                      <p>{item.name}</p>
                    </div>
                  ))}
                </ScrollView>
              </div>
            )
          },
          {
            label: '更换时间',
            field: 'feedTime',
            attrs: { required: true },
            component: () => <DateTimePicker v-model={state.form.feedTime}></DateTimePicker>
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
      let content = { ...state.form }
      if (state.form.type === EnumDiaperType.PEE) {
        content.poopType = ''
        content.poopColor = ''
      }
      let apiFunc = state.id ? apiUpdateFeedRecord : apiAddFeedRecord
      const res = await apiFunc({
        id: state.id,
        babyId: state.babyId,
        feedType: state.feedType,
        remark: state.remark,
        feedTime: content.feedTime,
        content: state.form
      }).catch(() => false)
      if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='diapering'>
          <Navbar
            title='换尿布'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: '#e8e5fa'
            }}
          ></Navbar>
          <Form class='diapering-form' ref={formRef} cells={cells} v-model={state.form}></Form>
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
