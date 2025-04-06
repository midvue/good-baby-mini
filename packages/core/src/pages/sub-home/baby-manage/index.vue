<script lang="tsx">
import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { BabyInfo, IBaby } from '@/components/baby-info'
import { useAppStore } from '@/stores'
import { useDictMap } from '@/use'
import { getBabyInfo } from '@/utils'
import { durationFormatNoZero, useDate } from '@mid-vue/shared'
import { Button, FooterBar, Image, Navbar, showPopup, Tag } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { apiBabyList } from './api'

export default defineComponent({
  name: 'baby-manage',
  setup() {
    let currState = reactive({
      list: [] as BabyInfo[]
    })
    let appStore = useAppStore()

    let babyInfo = getBabyInfo()

    async function getList() {
      currState.list = await apiBabyList()
    }
    getList()

    let genderMap = useDictMap('GENDER')

    let formatBirthTime = (baby: BabyInfo) => {
      let now = useDate()
      let targetDate = useDate(baby.birthDate)
      let diff = now.diff(targetDate.format('YYYY-MM-DD ' + baby.birthTime), 'millisecond')
      return `${durationFormatNoZero(diff, { format: baby.birthTime ? 'D天H小时' : '第D天' })}`
    }

    let onBabyClick = (baby?: IBaby) => {
      showPopup({
        round: true,
        height: '60%',
        title: (baby ? '修改' : '添加') + '宝宝',
        render(scoped) {
          return (
            <BabyInfo
              data={baby}
              onClose={() => {
                scoped.close()
                getList()
              }}
            ></BabyInfo>
          )
        }
      })
    }

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
            {currState.list.map((baby, index) => {
              return (
                <div class='baby-list-item' key={index} onClick={() => onBabyClick(baby)}>
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
                        当前喂养
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
          <FooterBar>
            <Button size='large' type='primary' onClick={() => onBabyClick()} round>
              添加宝宝
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
