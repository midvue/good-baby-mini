<script lang="tsx">
import { defineComponent, reactive, ref } from 'vue'
import { ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { dateFormat } from '@mid-vue/shared'
import {
  Button,
  DateTimePicker,
  FooterBar,
  Form,
  Icon,
  type IFormItem,
  Navbar,
  Textarea,
  type FormInstance
} from '@mid-vue/taro-h5-ui'
import { EnumFeedType } from '@/dict'
import { navigateBack, useDictList, useRoute } from '@/use'
import { getBabyInfo } from '@/utils'
import { apiAddFeedRecord, apiGetLatestFeedRecords, apiUpdateFeedRecord } from './api'
import { EnumDiaperType, type IDiaperState } from './types'

export default defineComponent({
  name: 'FeedMilk',
  setup() {
    const { query } = useRoute<IFeedRecord<IDiaper>>()
    const babyInfo = getBabyInfo()

    const defaultDiaper = {
      feedType: EnumFeedType.DIAPER,
      remark: '',
      babyId: babyInfo.id,
      content: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        type: '10',
        poopType: '10',
        poopColor: '10'
      } as IDiaper
    }
    const state = reactive<IDiaperState>({
      form: { ...defaultDiaper, ...query }
    })

    useDidShow(() => {
      if (query.id) return
      apiGetLatestFeedRecords({
        babyId: getBabyInfo().id,
        feedTypes: [EnumFeedType.DIAPER]
      }).then((list) => {
        if (!list[0]) return
        state.form.content = {
          ...list[0]?.content,
          feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm')
        }
      })
    })

    const formRef = ref<FormInstance>()

    const poopTypeList = useDictList('POOP_TYPE')
    const poopColorList = useDictList('POOP_COLOR')
    const diaperTypeList = useDictList('DIAPER_TYPE')
    const cells: IFormItem<IDiaper>[] = [
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
              labelAlign: 'top',
              border: true,
              class: 'pb-[10px]'
            },
            component: () => {
              return (
                <div class='grid grid-cols-4 gap-10 size-full'>
                  {diaperTypeList.map((item) => (
                    <div
                      class={{
                        'diaper-type-item': true,
                        active: state.form.content.type === item.code
                      }}
                      onClick={() => (state.form.content.type = item.code)}
                    >
                      <div class={'diaper-type-image ' + item.ext}>
                        {state.form.content.type === item.code && (
                          <Icon name='mv-icon-checked'></Icon>
                        )}
                      </div>
                      {item.name}
                    </div>
                  ))}
                </div>
              )
            }
          },
          {
            label: '臭臭状态',
            field: 'poopType',
            attrs: {
              labelAlign: 'top',
              class: 'pb-[10px]'
            },
            show: () => state.form.type !== EnumDiaperType.PEE,
            component: () => (
              <div class='grid grid-cols-3 gap-10 size-full'>
                {poopTypeList.map((item) => (
                  <div
                    class={{ 'tag-item': true, active: state.form.content.poopType === item.code }}
                    onClick={() => (state.form.content.poopType = item.code)}
                  >
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
              class: 'pb-[10px]',
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
                      onClick={() => (state.form.content.poopColor = item.code)}
                    >
                      {state.form.content.poopColor === item.code ? (
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
            component: () => <Textarea v-model={state.form.remark} placeholder='请输入'></Textarea>
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
