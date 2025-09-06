<script lang="tsx">
import { defineComponent, reactive } from 'vue'
import { ScrollView } from '@tarojs/components'
import { Navbar, Image, Drag, showPopup, showDialog } from '@mid-vue/taro-h5-ui'
import { dateFormat } from '@mid-vue/shared'
import { useDictMap } from '@/use'
import { type IPacketForm, PacketForm } from './components/packet-form'
import { apiDeleteRedPacket, apiGetRedPacketList } from './api'

export default defineComponent({
  name: 'RedPacket',
  setup() {
    const state = reactive({
      packetList: [] as IPacketForm[],
      total: 0
    })

    //获取记录
    const getList = async () => {
      const { list, count } = await apiGetRedPacketList()
      state.packetList = list
      state.total = count
    }
    getList()

    const onClickDrag = (item?: IPacketForm) => {
      showPopup({
        round: true,
        height: '60%',
        title: item ? '编辑红包' : '添加红包',
        render(scoped) {
          return (
            <PacketForm
              onClose={() => {
                scoped.close()
                getList()
              }}
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
            <div class='filter-item'></div>
          </div>
          <div class='packet-count'>
            <div class='title'>总收入</div>
            <div class='count'>{state.total}</div>
          </div>
          <div class='packet-scroll-container'>
            <ScrollView class='packet-scroll' scroll-y showScrollbar={false} enhanced>
              <div class='packet-content'>
                {state.packetList.map((item) => (
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
                    <div class='packet-item_right'>{item.amount}</div>
                  </div>
                ))}
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
