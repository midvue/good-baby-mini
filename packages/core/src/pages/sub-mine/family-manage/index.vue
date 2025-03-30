<script lang="tsx">
import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { useAppStore } from '@/stores'
import { useDictMap } from '@/use'
import { durationFormatNoZero, useDate } from '@mid-vue/shared'
import { Image, Navbar, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { apiFamilyList } from './api'
import { FamilyInfo } from './types'

export default defineComponent({
  name: 'family-manage',
  setup() {
    let state = reactive({
      list: [] as FamilyInfo[]
    })
    let appStore = useAppStore()

    async function getList() {
      state.list = await apiFamilyList()
    }
    getList()

    let genderMap = useDictMap('GENDER')

    let onFamilyClick = (baby?: IFamily) => {}

    return () => {
      return (
        <div class='baby-manager'>
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
          <div class='baby-list'>
            {state.list.map((baby, index) => {
              return (
                <div class='baby-list-item' key={index} onClick={() => onFamilyClick(baby)}>
                  <div class='baby-info'>
                    <div class='baby-name'></div>
                    <div class='tags'>
                      <Tag size='mini' type='success' plain round></Tag>
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
