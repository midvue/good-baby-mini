<script lang="tsx">
import { defineComponent, ref } from 'vue'
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
  type FormInstance
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { navigateBack } from '@/use'
// import { getBabyInfo } from '@/utils'
import { type IBMIState } from './types'
export default defineComponent({
  name: 'HeightWeight',
  setup() {
    const [state] = defineCtxState<IBMIState>({
      remark: '',
      form: {
        feedTime: dateFormat(Date.now(), 'YYYY-MM-DD HH:mm'),
        height: 50,
        weight: 50,
        headCircumference: 60,
        footLength: 70
      } as IHeightWeight
    })

    const formRef = ref<FormInstance>()


    function initHeightList() {
      const min = 50
      const max = 140
      let curr = min
      const heightList = []
      while (curr < max) {
        heightList.push({ code: curr, name: curr + 'cm' })
        curr += 1
      }
      return heightList
    }
    const heightList = initHeightList()
    const multiDates = ref([
      [
        { code: 1, name: '2025-01-01' },
        { code: 2, name: '2025-02-01' },
        { code: 3, name: '2025-03-01' }
      ],
      [
        { code: 11, name: '10' },
        { code: 12, name: '11' },
        { code: 13, name: '12' }
      ],
      [
        { code: 1101, name: '10' },
        { code: 1102, name: '20' },
        { code: 1103, name: '30' }
      ]
    ])
    const multiIndex = ref([0, 0, 0])
    const handleMultiChange = (e: { detail: { value: any } }) => {
    const { value } = e.detail
    multiIndex.value = value
  
    const selected = {
      date: multiDates.value[0][value[0]],
      hour: multiDates.value[1][value[0]],
      minute: multiDates.value[2][value[0]]
    }
  
    state.form.feedTime = [
      selected.date.name,
      selected.hour.name,
      selected.minute.name
    ].join(' ')
}

    const cells: IFormItem<IBMIState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          {
            label: '记录时间',
            component: () => <Picker v-model={state.form.feedTime} mode='multiSelector' range={multiDates.value}  rangeKey="name"
            valueKey="code" onChange={handleMultiChange}/>
          },
          {
            label: '身高',
            field: 'height',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.height} range={heightList}></Picker>
          },
          {
            label: '体重',
            field: 'weight',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.weight}  range={heightList}></Picker>
          },
          {
            label: '头围',
            field: 'headCircumference',
            attrs: { required: true, border: true  },
            component: () => <Picker v-model={state.form.headCircumference}  range={heightList}></Picker>
          },
          {
            label: '脚长',
            field: 'footLength',
            attrs: { required: true },
            component: () => <Picker v-model={state.form.footLength}  range={heightList}></Picker>
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
      // const feedTime = dateFormat(Date.now(), `YYYY-MM-DD ${state.form.feedTime}`)
      // const res = await apiAddFeedRecord({
      //   babyId: getBabyInfo().id,
      //   feedType: state.feedType,
      //   remark: state.remark,
      //   feedTime,
      //   content: { ...state.form, feedTime }
      // }).catch(() => false)
      // if (!res) return
      Taro.showToast({ title: '添加成功' })
      navigateBack()
    }

    return () => {
      return (
        <div class='height-weight'>
          <Navbar
            title='身高体重记录'
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <Form ref={formRef} cells={cells} v-model={state.form}></Form>
          <FooterBar>
            <Button type='warning' size='large' onClick={onSubmit}>
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
