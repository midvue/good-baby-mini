<script lang="tsx">
import { useDictMap, useRoute } from '@/use'
import { Button, FooterBar, Image, Navbar, showPopup } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive } from 'vue'
import { apiBabyList } from './api'
import imgBabyAvatar from '@/assets/images/img_baby_avatar.png'
import { dateDiff, durationFormatNoZero, useDate } from '@mid-vue/shared'
import { BabyInfo, IBaby } from '@/components/baby-info'

export default defineComponent({
  name: 'baby-manage',
  setup() {
    const { query } = useRoute<{ feedType: number }>()
    let currState = reactive({
      list: [] as BabyInfo[]
    })

    async function getList() {
      currState.list = await apiBabyList()
    }
    getList()

    let genderMap = useDictMap('GENDER')

    let formatBirthTime = (baby: BabyInfo) => {
      let diffTime = dateDiff(
        Date.now(),
        useDate(baby.birthDate)
          .format('YYYY-MM-DD ' + baby.birthTime)
          .valueOf()
      )
      return durationFormatNoZero(diffTime, { format: 'Y岁M月D天H小时m分钟' })
    }

    let onBabyClick = (baby?: IBaby) => {
      showPopup({
        round: true,
        height: '60%',
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
            defaultConfig={{
              frontColor: '#000000',
              backgroundColor: 'transparent'
            }}
          ></Navbar>
          <div class='baby-list'>
            {currState.list.map((baby, index) => {
              return (
                <div class='baby-list-item' key={index} onClick={() => onBabyClick(baby)}>
                  <Image class='baby-avatar' src={imgBabyAvatar}></Image>
                  <div class='baby-info'>
                    <div class='baby-name'>{baby.nickname}</div>
                    <div class='gender'>{genderMap[baby.gender]?.name}</div>
                    <div class='age'>{formatBirthTime(baby)}</div>
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
