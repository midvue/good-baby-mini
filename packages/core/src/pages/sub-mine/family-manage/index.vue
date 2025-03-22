<script lang="tsx">
import { useDictMap } from '@/use'
import { Button, FooterBar, Image, Navbar, showPopup, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { apiFamilyList } from './api'
import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { useAppStore } from '@/stores'
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

    let formatBirthTime = (baby: FamilyInfo) => {
      let now = useDate()
      let targetDate = useDate(baby.birthDate)
      let diff = now.diff(targetDate.format('YYYY-MM-DD ' + baby.birthTime), 'millisecond')
      return `${durationFormatNoZero(diff, { format: baby.birthTime ? 'D天H小时' : '第D天' })}`
    }

    let onFamilyClick = (baby?: IFamily) => {}

    return () => {
      return (
        <div class='baby-manager'>
          <Navbar
            title='宝宝管理'
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
                  <Image
                    class='baby-avatar'
                    src={baby.gender === '10' ? imgAvatarFemale : imgAvatarMale}
                  ></Image>
                  <div class='baby-info'>
                    <div class='baby-name'>
                      {baby.nickname}
                      <Tag class='ml-[5px]' size='small' round type='primary'>
                        {formatBirthTime(baby)}
                      </Tag>
                    </div>
                    <div class='tags'>
                      <Tag size='mini' type='success' plain round>
                        {appStore.familyId === baby.familyId ? '我创建' : '受邀人'}
                      </Tag>
                      <Tag size='mini' round type='primary' plain v-show={babyInfo.id === baby.id}>
                        当前家庭
                      </Tag>
                    </div>
                    <div class='gender'>
                      {genderMap[baby.gender]?.name}宝宝 ·&nbsp;
                      {useDate(baby.birthDate).format('YYYY-MM-DD ' + baby.birthTime)}
                    </div>
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
