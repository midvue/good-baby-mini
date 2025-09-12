<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { ScrollView } from '@tarojs/components'
import { Navbar, Image, Drag, showPopup, showDialog, Tag, Icon, Empty } from '@mid-vue/taro-h5-ui'
import { dateFormat, formatNumber } from '@mid-vue/shared'
import { useDictMap } from '@/use'
import { getBabyInfo } from '@/utils'
import { type IPacketForm, PacketForm } from './components/packet-form'
import { apiBabyList, apiDeleteRedPacket, apiGetRedPacketList } from './api'
import { type FilterParams } from './components/filter-popup/type'
import { FilterPopup } from './components/filter-popup'

export default defineComponent({
  name: 'RedPacket',
  setup() {
    const state = reactive({
      packetList: [] as IPacketForm[],
      total: 0,
      babyId: getBabyInfo().id || '',
      babyList: [] as { name: string; code: string }[],
      // 添加筛选条件状态
      filter: {
        name: '',
        minAmount: '',
        maxAmount: '',
        callName: '',
        type: ''
      } as FilterParams
    })

    // 提取筛选重置为独立方法
    const resetFilter = () => {
      Object.keys(state.filter).forEach((key) => {
        state.filter[key as keyof FilterParams] = ''
      })
    }

    const getBabyList = async () => {
      const res = await apiBabyList()
      state.babyList = res.map((item: BabyInfo) => ({
        name: item.nickname,
        code: item.id + ''
      }))
      state.babyList.push({ name: '本人', code: '999' })
    }
    getBabyList()
    //获取记录
    const getList = async () => {
      const filterParams: FilterParams = {}
      Object.entries(state.filter).forEach(([key, value]) => {
        if (value !== '') {
          filterParams[key as keyof FilterParams] = value
        }
      })

      const { list, count } = await apiGetRedPacketList({
        ...filterParams,
        ...(state.babyId !== '999' ? { babyId: state.babyId + '' } : {})
      })
      state.packetList = list
      state.total = count
    }
    getList()

    // 添加筛选浮层显示方法
    const showFilterPopup = () => {
      showPopup({
        round: true,
        height: '80%',
        title: '筛选条件',
        render(scoped) {
          return (
            <FilterPopup
              filter={state.filter}
              onConfirm={(filter) => {
                scoped.close()
                state.filter = filter
                getList()
              }}
              onReset={() => {
                resetFilter()
                getList()
                scoped.close()
              }}
            ></FilterPopup>
          )
        }
      })
    }

    const onClickDrag = (item?: IPacketForm) => {
      showPopup({
        round: true,
        height: '70%',
        title: item ? '编辑红包' : '添加红包',
        render(scoped) {
          return (
            <PacketForm
              onClose={() => {
                scoped.close()
                getList()
              }}
              babyList={state.babyList}
              data={item}
            ></PacketForm>
          )
        }
      })
    }

    const onDeleteRecord = async (item: IPacketForm) => {
      showDialog({
        title: '删除红包',
        render: () => '确认删除(\n' + item.name + ')的红包吗？',
        onConfirm: async () => {
          await apiDeleteRedPacket(item.id)
          getList()
        }
      })
    }
    return () => (
      <div class='red-packet'>
        <Navbar
          title='红包记账'
          defaultConfig={{
            frontColor: '#ffffff',
            backgroundColor: 'transparent'
          }}
        />
        <div class='red-packet-content'>
          <div class='packet-filter'>
            {state.babyList.map((item) => {
              return (
                <Tag
                  type={state.babyId === item.code ? 'primary' : 'default'}
                  plain={state.babyId !== item.code}
                  round
                  size='large'
                  class='packet-filter-tag'
                  key={item.code}
                  onClick={() => {
                    state.babyId = item.code
                    getList()
                  }}
                >
                  {item.name}
                </Tag>
              )
            })}
            <div class='filter-more' onClick={showFilterPopup}>
              <span>筛选</span>
              <Icon name='down' />
            </div>
          </div>
          <div class='packet-count'>
            <div class='title'>总收入</div>
            <div class='count'>{formatNumber(state.total)}</div>
          </div>
          <div class='packet-scroll-container'>
            <ScrollView class='packet-scroll' scroll-y showScrollbar={false} enhanced>
              <div class='packet-content'>
                {state.packetList.length > 0 ? (
                  state.packetList.map((item) => (
                    <div
                      class='packet-item'
                      key={item.id}
                      //@ts-ignore
                      onLongpress={() => onDeleteRecord(item)}
                      onClick={() => onClickDrag(item)}
                    >
                      <div class='packet-item_left'>
                        <Image src='centre/icon_centre_packet.png' class='packet-item-icon' />
                        <div class='packet-item-content'>
                          <div class='name'>
                            {item.name}
                            <span class='call-name'>
                              ({useDictMap('FAMILY_CALL')[item.callName].name})
                            </span>
                          </div>
                          <div class='type'>{useDictMap('PACKET_TYPE')[item.type].name}</div>
                          <div class='time'>{dateFormat(item.recordTime, 'YYYY-MM-DD')}</div>
                        </div>
                      </div>
                      <div class='packet-item_right'>{formatNumber(item.amount)}</div>
                    </div>
                  ))
                ) : (
                  <Empty message='暂无红包记录'></Empty>
                )}
              </div>
            </ScrollView>
          </div>
        </div>
        <Drag gap={{ x: 5, y: 60 }} offset={{ x: -1, y: -1 }}>
          <div class='packet-drag-content' onClick={() => onClickDrag()}>
            新增
          </div>
        </Drag>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
