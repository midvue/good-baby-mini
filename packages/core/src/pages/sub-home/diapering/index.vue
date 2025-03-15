<script lang="tsx">
import { navigateBack, useDictList, useRoute } from '@/use'
import {
  Button,
  FooterBar,
  Form,
  type FormInstance,
  IFormItem,
  Input,
  Navbar,
  Picker,
  Textarea,
  Switch
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import Taro from '@tarojs/taro'
import { defineComponent, ref } from 'vue'
import { apiAddFeedRecord } from './api'
import { IMilk, type IFeedMilkState } from './types'
import { dateFormat } from '@mid-vue/shared'
import { getBabyInfo } from '@/utils'
import { Icon } from '@mid-vue/taro-h5-ui'

export default defineComponent({
  name: 'feed-milk',
  setup() {
    const { query } = useRoute<{ feedType: number }>()
    const [state] = defineCtxState<IFeedMilkState>({
      feedType: query.feedType,
      remark: '',
      form: {
        feedTime: dateFormat(Date.now(), `HH:mm`),
        diaperingType: ''
      }
    })

    const formRef = ref<FormInstance>()

    let milkList = useDictList('MILK_TYPE')

    function initVolumeList() {
      let min = 30
      let max = 400
      let curr = min
      let volumeList = []
      while (curr < max) {
        volumeList.push({ code: curr, name: curr + 'ml' })
        curr += 5
      }
      return volumeList
    }
    let volumeList = initVolumeList()
    const handlePhoto = () => {
      Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
        }
      })
    }
    const poopColorList = [
      { label: '黄色', value: '#f8d603' },
      { label: '墨绿色', value: '#465611' },
      { label: '棕色', value: '#5d4520' },
      { label: '绿色', value: '#73a615' },
      { label: '红色', value: '#b7372c' },
      { label: '黑色', value: '#3e3232' },
      { label: '灰白色', value: '#cbc3bd' }
    ]
    const diaperingTypeList = [
      {
        label: '嘘嘘',
        value: 'pee'
      },
      {
        label: '便便',
        value: 'poop'
      },
      {
        label: '嘘嘘+便便',
        value: 'both'
      }
    ]
    const cells: IFormItem<IFeedMilkState['form']>[] = [
      {
        attrs: {
          class: 'form-item-card'
        },
        children: [
          //多层级嵌套
          {
            label: '更换时间',
            field: 'feedTime',
            attrs: { required: true, border: true },
            component: () => <Picker v-model={state.form.feedTime} mode='date'></Picker>
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
            label: '选择类型和状态',
            attrs: {
              labelAlign: 'top'
            },
            component: () => {
              return (
                <div class='flex flex-col	size-full'>
                  <div class='flex justify-between size-full'>
                    {diaperingTypeList.map((item) => (
                      <Button
                        size='small'
                        round
                        type={state.form.diaperingType === item.value ? 'warning' : 'default'}
                        onClick={() => (state.form.diaperingType = item.value)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                  <p class='py-8'>尿布重量</p>
                  <div class='flex justify-between size-full'>
                    {['很轻', '正常', '很重'].map((item) => (
                      <Button class='tag-item' size='small' round type='warning'>
                        {item}
                      </Button>
                    ))}
                  </div>
                  <p class='py-8'>便便状态</p>
                  <div class='grid grid-cols-3 gap-10 size-full'>
                    {[
                      '普通软糊状',
                      '较干',
                      '成型',
                      '颗粒状',
                      '水样状',
                      '水便分离',
                      '蛋花汤状',
                      '血便',
                      '油性大便',
                      '豆腐渣样',
                      '泡沫状'
                    ].map((item) => (
                      <Button class='tag-item' size='small' round type='warning'>
                        {item}
                      </Button>
                    ))}
                  </div>
                  <p class='py-8'>便便颜色</p>
                  <div class='color-form'>
                    <Icon name='mv-icon-upload' onClick={handlePhoto}></Icon>
                    <ul class='color-list'>
                      {poopColorList.map((item) => (
                        <div class='color-item' style={{ background: item.value }}>
                          <p>{item.label}</p>
                        </div>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            }
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
            label: '设置提醒',
            component: () => (
              <>
                <Picker v-model={state.form.feedTime} mode='time'></Picker>
                <Switch></Switch>
              </>
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
            component: () => <Textarea v-model={state.remark} placeholder='请输入'></Textarea>
          }
        ]
      }
    ]
    const onSubmit = async () => {
      let feedTime = dateFormat(Date.now(), `YYYY-MM-DD ${state.form.feedTime}`)
      const res = await apiAddFeedRecord({
        babyId: getBabyInfo().id,
        feedType: state.feedType,
        remark: state.remark,
        feedTime,
        content: { ...state.form, feedTime }
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
              backgroundColor: '#fee7dc'
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
