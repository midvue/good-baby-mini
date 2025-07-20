<script lang="tsx">
import { defineComponent } from 'vue'
import {
  Button,
  Form,
  type IFormItem,
  Navbar,
  Picker,
  Input,
  DateTimePicker,
  Tag
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { EnumYesNoPlus } from '@mid-vue/shared'
import { useDictList } from '@/use'
import { apiGetAINames } from './api'
import type { AiNameState, IAiNameReq } from './types'

export default defineComponent({
  name: 'AIName',
  setup() {
    const [state] = defineCtxState<AiNameState>({
      form: {
        isBorn: '10',
        lastName: '',
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
      try {
        const response = await apiGetAINames(state.form)
        // 可在此处添加处理返回结果的逻辑，如显示名字列表
        console.log('获取 AI 名字成功:', response.names)
      } catch (err) {
        console.error('获取 AI 名字失败:', err)
      }
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
            field: 'lastName',
            attrs: { border: true },
            component: () => (
              <div>
                <Input v-model={state.form.lastName} placeholder='请输入姓氏' />
              </div>
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
            rules: [],
            component: () => (
              <div>
                <DateTimePicker v-model={state.form.birthDate} />
              </div>
            )
          },
          {
            label: '出生时间',
            field: 'birthTime',
            attrs: { border: true },
            rules: [],
            component: () => (
              <div>
                <DateTimePicker v-model={state.form.birthTime} />
              </div>
            )
          }
        ]
      }
    ]

    return () => (
      <div class='ai-name'>
        <Navbar title='AI取名' />
        <Form cells={cells} v-model={state.form}>
          <div class='ai-name__button-group'>
            <Button onClick={handleSubmit}>生成名字</Button>
          </div>
        </Form>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
