<script lang="tsx">
import { useAppStore } from '@/stores'
import { useDictMap } from '@/use'
import { Navbar, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { apiFamilyList } from './api'
import { IFamily } from './types'

export default defineComponent({
  name: 'family-manage',
  setup() {
    let state = reactive({
      list: [] as IFamily[]
    })
    let appStore = useAppStore()

    async function getList() {
      let list = await apiFamilyList()
      state.list = list || []
    }
    getList()

    let genderMap = useDictMap('GENDER')

    let onFamilyClick = (family?: IFamily) => {}

    return () => {
      return (
        <div class='family-manager'>
          <Navbar
            title='家庭管理'
            autoTheme
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
            scrolledConfig={{
              frontColor: '#000000',
              backgroundColor: '#ffffff'
            }}
          ></Navbar>
          <div class='family-list'>
            {state.list.map((family, index) => {
              return (
                <div class='family-list-item' key={index} onClick={() => onFamilyClick(family)}>
                  <div class='family-info'>
                    <div class='family-name'>{family.name}</div>
                    <div class='tags'>
                      <Tag size='mini' type='success' plain round>
                        {family.id === appStore.familyId ? '我创建' : '我加入的'}
                      </Tag>
                      <Tag size='mini' round type='primary' plain>
                        当前家庭
                      </Tag>
                    </div>
                    <div class='gender'></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
