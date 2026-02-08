<script lang="tsx">
import { defineComponent } from 'vue'
import { debounce, EnumYesNoPlus } from '@mid-vue/shared'
import {
  Button,
  FooterBar,
  Form,
  hideLoading,
  type IFormItem,
  Input,
  Navbar,
  showLoading,
  showPopup,
  showToast,
  Tag
} from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import { useDictList } from '@/use'
import { apiGetAINames, apiInterpretNamesNames } from './api'
import type { IAiNameReq, NameState } from './types'

export default defineComponent({
  name: 'Name',
  setup() {
    const [state, setState] = defineCtxState<NameState>({
      form: {
        surname: '',
        gender: EnumYesNoPlus.YES
      },
      names: [],
      selectedNames: []
    })

    const genderList = useDictList('GENDER')

    const clear = () => {
      setState((state) => {
        state.form.lastFindName = undefined
        state.selectedNames = []
        state.names = []
      })
    }

    /**
     * 获取生成的名字
     * @param params 请求参数
     */
    const fetchNames = async () => {
      if (!state.form.surname || !state.form.gender) {
        showToast('请输入姓氏')
        return
      }
      showLoading({
        title: '处理中...'
      })
      setState((state) => (state.form.lastFindName = state.names?.[state.names.length - 1]?.name))
      const multiNames = await apiGetAINames(state.form).finally(() => hideLoading())
      setState((state) => (state.names = multiNames))
    }

    const handleSubmit = debounce(() => {
      fetchNames()
    }, 300)

    const cells: IFormItem<IAiNameReq>[] = [
      {
        attrs: { class: 'form-item-card' },
        children: [
          {
            label: '姓氏',
            field: 'surname',
            attrs: { border: true },
            component: () => (
              <Input
                maxlength={2}
                v-model={state.form.surname}
                placeholder='请输入姓氏'
                onInput={() => {
                  clear()
                  handleSubmit()
                }}
              />
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
                        clear()
                        handleSubmit()
                      }}
                    >
                      {gender.name}宝宝
                    </Tag>
                  )
                })}
              </>
            )
          }
        ]
      }
    ]

    /**
     * 选择或取消选择一个名字
     * @param index 名字在列表中的索引
     */
    const onSelectName = (index: number) => {
      const item = state.names[index]
      if (state.selectedNames.includes(item.name)) {
        state.selectedNames.splice(state.selectedNames.indexOf(item.name), 1)
      } else {
        state.selectedNames.push(item.name)
      }
      item.isSelected = !item.isSelected
    }

    /**
     * 解读选中的名字
     */
    const onInterpretNames = () => {
      if (state.selectedNames.length === 0) {
        showToast('请选择要解读的名字')
        return
      }
      showLoading({
        title: '解读中...'
      })
      apiInterpretNamesNames({ names: state.selectedNames, gender: state.form.gender })
        .then((names) => {
          showPopup({
            title: '名字解读',
            height: '90%',
            render: () => {
              return (
                <div class='flex flex-col items-center px-[12px] '>
                  {names.map((aIName) => {
                    return (
                      <div
                        key={aIName.name}
                        class='flex w-[100%] items-center mv-hairline--bottom py-[10px] '
                      >
                        <div class='w-[80px] font-bold self-start text-[16px]'>{aIName.name}</div>
                        <div class='flex-1 flex flex-col text-[14px]  text-[#333333] leading-[24px]'>
                          <div>
                            <span class='font-bold'>读音</span>:{' '}
                            <span class='text-[#ff4a4a]'>{aIName.spell}</span>
                          </div>
                          <div>
                            <span class='font-bold'>出自</span>: {aIName.origin}
                          </div>
                          <div>
                            <span class='font-bold'>释义</span>:{' '}
                            <span class='text-[#675d78]'>{aIName.desc}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          })
        })
        .finally(() => hideLoading())
    }

    return () => (
      <div class='ai-name'>
        <Navbar title='取名' />
        <Form cells={cells} v-model={state.form} class='ai-name-form'></Form>
        <div class='ai-name-list' v-show={state.names.length > 0}>
          {state.names.map((item, index) => {
            return (
              <Tag
                class='name-tag'
                key={index}
                round
                type='primary'
                plain={!item.isSelected}
                onClick={() => onSelectName(index)}
              >
                {item.name}
              </Tag>
            )
          })}
        </div>
        <FooterBar class='justify-around'>
          <Button type='success' size='medium' onClick={onInterpretNames}>
            解读
          </Button>
          <Button type='primary' size='medium' onClick={handleSubmit}>
            换一批
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
