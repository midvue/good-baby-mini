<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { EnumYesNoPlus, useDate } from '@allkit/shared'
import { Button, FooterBar, Image, Navbar, showDialog, showPopup, Tag } from '@allkit/taro-h5-ui'
import imgAvatarFemale from '@/assets/images/img_avatar_female.png'
import imgAvatarMale from '@/assets/images/img_avatar_male.png'
import { BabyInfo, type IBaby } from '@/components/baby-info'
import { useAppStore } from '@/stores'
import { navigateBack, useDictMap, useRoute } from '@/use'
import { setBabyInfo } from '@/utils'
import { apiBabyList } from './api'

export default defineComponent({
  name: 'BabyManage',
  setup() {
    // 获取路由参数，判断是否是切换操作
    const query = useRoute<{ isChange: EnumYesNoPlus }>().query
    // 定义响应式状态，存储宝宝列表
    const currState = reactive({
      list: [] as BabyInfo[]
    })
    // 获取应用状态管理实例
    const appStore = useAppStore()

    /**
     * 获取宝宝列表数据
     * 从 API 获取宝宝列表，并更新当前组件状态中的宝宝列表
     */
    async function getList() {
      currState.list = await apiBabyList()
    }
    // 组件初始化时调用获取宝宝列表函数
    getList()

    // 获取性别字典映射
    const genderMap = useDictMap('GENDER')
    const familyRelationMap = useDictMap('FAMILY_RELATION')
    /**
     * 格式化宝宝出生时间，计算从出生到现在的时长
     * @param {BabyInfo} baby - 宝宝信息对象
     * @returns {string} - 格式化后的时长字符串
     */
    const formatBirthTime = (baby: BabyInfo) => {
      const now = useDate()
      const targetDate = useDate(baby.birthDate)
      const totalMonths = now.diff(targetDate, 'month')
      const years = Math.floor(totalMonths / 12)
      const months = totalMonths % 12
      const days = now.diff(useDate(targetDate, 'YYYY-MM-DD').add(totalMonths, 'month'), 'day')
      const baseDate = useDate(targetDate, 'YYYY-MM-DD').add(totalMonths, 'month').add(days, 'day')
      const hours = now.diff(baseDate, 'hour')
      const ageStr = `${years ? years + '岁' : ''}${months}个月${days}天`
      const hourStr = baby.birthTime ? `${hours}小时` : ''
      return `${ageStr}${hourStr}`.trim()
    }

    /**
     * 点击宝宝项时触发的函数，弹出添加或修改宝宝信息的弹窗
     */
    const onBabyClick = (baby?: IBaby) => {
      let relation = ''
      if (!baby) {
        const matchedItem = currState.list.find((item) => item.familyId === appStore.familyId)
        relation = matchedItem?.relation || ''
      }
      showPopup({
        round: true,
        height: '60%',
        title: (baby ? '修改' : '添加') + '宝宝',
        render(scoped) {
          return (
            <BabyInfo
              data={baby}
              relation={relation}
              onClose={() => {
                scoped.close()
                // 关闭弹窗后重新获取宝宝列表
                getList()
              }}
            ></BabyInfo>
          )
        }
      })
    }

    /**
     * 切换宝宝喂养时触发的函数，弹出确认对话框
     * @param {IBaby} baby - 要切换喂养的宝宝信息对象
     */
    const onBabyChange = (baby: IBaby) => {
      showDialog({
        title: '切换宝宝喂养',
        render: () => (
          <div>
            您确认喂养<span class='text-[red]'> {baby.nickname}</span> 宝宝嘛
          </div>
        ),
        onConfirm: () => {
          // 设置宝宝信息
          setBabyInfo(baby)
          // 更新应用状态中的宝宝信息
          appStore.setBabyInfo(baby)
          if (query.isChange === EnumYesNoPlus.YES) {
            // 如果是切换操作，返回上一页
            navigateBack()
            return
          }
          // 重新获取宝宝列表
          getList()
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
                      <span>{familyRelationMap[baby.relation].name}</span>
                      <Tag size='mini' type='success' plain round>
                        {appStore.familyId === baby.familyId ? '我创建' : '受邀人'}
                      </Tag>
                      <Tag
                        size='mini'
                        round
                        type='primary'
                        plain
                        v-show={appStore.babyInfo.id === baby.id}
                      >
                        当前喂养
                      </Tag>
                    </div>
                    <div class='gender'>
                      {genderMap[baby.gender]?.name}宝宝 ·&nbsp;
                      {useDate(baby.birthDate).format('YYYY-MM-DD ' + baby.birthTime)}
                    </div>

                    <Tag
                      type='primary'
                      class='item-tag-selected'
                      round
                      plain
                      onClick={(e) => {
                        e.stopPropagation()

                        onBabyChange(baby)
                      }}
                      v-show={appStore.babyInfo.id !== baby.id}
                    >
                      切换
                    </Tag>
                  </div>
                </div>
              )
            })}
          </div>
          {query.isChange !== EnumYesNoPlus.YES && (
            <FooterBar>
              <Button size='large' type='primary' onClick={() => onBabyClick()} round>
                添加宝宝
              </Button>
            </FooterBar>
          )}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
