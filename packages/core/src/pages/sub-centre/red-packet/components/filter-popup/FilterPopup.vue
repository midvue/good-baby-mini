<script lang="tsx">
import { defineComponent, reactive, type PropType } from 'vue'
import { Input, Button, Tag } from '@mid-vue/taro-h5-ui'
import { useDictList } from '@/use'
import { type FilterParams } from './type'

export default defineComponent({
  name: 'FilterPopup',
  props: {
    filter: {
      type: Object as PropType<FilterParams>,
      required: true
    }
  },
  emits: ['reset', 'confirm', 'close'],
  setup(props, { emit }) {
    // 获取关系和红包类型字典
    const callNameList = useDictList('FAMILY_CALL')
    const typeList = useDictList('PACKET_TYPE')
    const state = reactive<FilterParams>({ ...props.filter })
    return () => (
      <div class='filter-popup'>
        {/* 称呼输入框 */}
        <div class='filter-item filter-item_border'>
          <div class='filter-label'>称呼</div>
          <Input v-model={state.name} placeholder='请输入称呼关键词'></Input>
        </div>

        {/* 红包金额范围 */}
        <div class='filter-item filter-item_border'>
          <div class='filter-label'>金额范围</div>
          <div class='amount-range'>
            <Input v-model={state.minAmount} placeholder='最小金额' type='number'></Input>
            <span class='range-separator'>-</span>
            <Input v-model={state.maxAmount} placeholder='最大金额' type='number'></Input>
          </div>
        </div>

        {/* 关系选择 */}
        <div class='filter-item'>
          <div class='filter-label'>关系</div>
          <div class='tag-group'>
            {callNameList.map((item) => (
              <Tag
                size='large'
                key={item.code}
                type={state.callName === item.code ? 'primary' : 'default'}
                plain={state.callName !== item.code}
                onClick={() => (state.callName = item.code)}
                class='tag-item'
              >
                {item.name}
              </Tag>
            ))}
          </div>
        </div>

        {/* 红包类型选择 */}
        <div class='filter-item'>
          <div class='filter-label'>红包类型</div>
          <div class='tag-group'>
            {typeList.map((item) => (
              <Tag
                size='large'
                key={item.code}
                type={state.type === item.code ? 'primary' : 'default'}
                plain={state.type !== item.code}
                onClick={() => (state.type = item.code)}
                class='tag-item'
              >
                {item.name}
              </Tag>
            ))}
          </div>
        </div>

        {/* 底部按钮 */}
        <div class='filter-buttons'>
          <Button
            size='large'
            class='filter-btn filter-btn-reset'
            onClick={() => emit('reset', state)}
          >
            重置
          </Button>
          <Button
            type='primary'
            size='large'
            class='filter-btn'
            onClick={() => emit('confirm', state)}
          >
            确认
          </Button>
        </div>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
