<script lang="tsx">
import { defineComponent } from 'vue'
import { EnumYesNoPlus, useDate } from '@mid-vue/shared'
import {
  Button,
  FooterBar,
  Form,
  hideLoading,
  type IFormItem,
  Input,
  Navbar,
  Picker,
  showLoading,
  showPopup,
  Tag,
  Textarea
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useDictList } from '@/use'
import { apiGetAINames } from './api'
import type { AiNameState, IAiNameReq } from './types'

export default defineComponent({
  name: 'AIName',
  setup() {
    const [state] = defineCtxState<AiNameState>({
      form: {
        isBorn: '10',
        surname: '',
        gender: EnumYesNoPlus.YES,
        birthDate: '',
        birthTime: ''
      }
    })
    const yesNoList = [
      { label: '是', value: '10' },
      { label: '否', value: '20' }
    ]
    const genderList = useDictList('GENDER')

    /**
     * 获取 AI 生成的名字
     * @param params 请求参数
     */
    const fetchNames = async () => {
      showLoading({
        title: 'AI 大模型处理中...'
      })
      const multiNames = await apiGetAINames(state.form).finally(() => hideLoading())
      showPopup({
        title: 'AI 生成的名字',
        height: '85%',
        render: () => {
          return (
            <div>
              {multiNames.map((names) => {
                return (
                  <div class='flex flex-col items-center'>
                    {names.map((aIName) => {
                      return (
                        <div key={aIName.name} class='flex w-[100%] items-center'>
                          <div class='w-[100px] font-bold'>{aIName.name}</div>
                          <div class='flex-1'>{aIName.desc}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )
        }
      })
    }

    const handleSubmit = () => {
      fetchNames()
    }

    const cells: IFormItem<IAiNameReq>[] = [
      {
        attrs: { class: 'form-item-card' },
        children: [
          {
            label: '姓氏',
            field: 'surname',
            attrs: { border: true },
            component: () => (
              <Input maxlength={2} v-model={state.form.surname} placeholder='请输入姓氏' />
            )
          },
          {
            label: '性别',
            field: 'gender',
            attrs: { border: true },
            rules: [],
            component: () => (
              <>
                {genderList.map((gender) => {
                  return (
                    <Tag
                      class='w-[60px] mr-[8px]'
                      round
                      type='primary'
                      plain={state.form.gender !== gender.code}
                      onClick={() => {
                        state.form.gender = gender.code
                      }}
                    >
                      {gender.name}宝宝
                    </Tag>
                  )
                })}
              </>
            )
          },
          {
            label: '是否出生',
            field: 'isBorn',
            attrs: { border: true },
            component: () => (
              <>
                {yesNoList.map((item) => {
                  return (
                    <Tag
                      class='w-[60px] mr-[8px]'
                      round
                      type='primary'
                      plain={state.form.isBorn !== item.value}
                      onClick={() => {
                        state.form.isBorn = item.value
                      }}
                    >
                      {item.label}
                    </Tag>
                  )
                })}
              </>
            )
          },
          {
            label: '出生年月',
            field: 'birthDate',
            attrs: { border: true },
            show: () => state.form.isBorn === EnumYesNoPlus.YES,
            component: () => (
              <Picker
                v-model={state.form.birthDate}
                mode='date'
                end={useDate().format('YYYY-MM-DD')}
              ></Picker>
            )
          },
          {
            label: '出生时间',
            field: 'birthTime',
            show: () => state.form.isBorn === EnumYesNoPlus.YES,
            component: () => <Picker v-model={state.form.birthTime} mode='time'></Picker>
          }
        ]
      },
      {
        label: '备注',
        field: 'remark',
        attrs: { class: 'form-item-card', labelAlign: 'top' },
        component: () => (
          <Textarea
            v-model={state.form.remark}
            placeholder='请输入备注(比如对宝宝期望,寓意)'
            maxLength={25}
          ></Textarea>
        )
      }
    ]

    return () => (
      <div class='ai-name'>
        <Navbar title='AI取名' />
        <Form cells={cells} v-model={state.form} class='ai-name-form'></Form>
        <FooterBar>
          <Button type='primary' size='large' onClick={handleSubmit}>
            一键取名
          </Button>
        </FooterBar>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
