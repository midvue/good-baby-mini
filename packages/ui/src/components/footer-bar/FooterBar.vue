<script lang="tsx">
import { computed, defineComponent, type PropType, type CSSProperties, ref } from 'vue'
import Taro, { useReady } from '@tarojs/taro'
import { uniqueId } from '@mid-vue/shared'
import SafeBottom from '../safe-bottom'
import { useRect } from '../../use/useRect'
import { type PositionProperty } from './types'

export default defineComponent({
  name: 'MvFooterBar',
  props: {
    /** 背景色 */
    bgColor: {
      type: String
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    /** 显示上边框 */
    border: {
      type: Boolean,
      default: false
    },
    /** 安全边距兼容 */
    safeAreaInsetBottom: {
      type: Boolean,
      default: true
    },
    safeHeight: {
      type: [Number, String]
    },
    /** 布局定位 */
    position: {
      type: String as PropType<PositionProperty>,
      default: 'fixed'
    },
    clearfix: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click'],
  setup(props, { slots, expose }) {
    const heightRef = ref(0)
    const popStyle = computed(() => {
      return {
        background: props.bgColor,
        position: props.position,
        ...props.style
      }
    })

    const divRef = ref()
    useReady(() => {
      Taro.nextTick(() => {
        getRect()
      })
    })

    async function getRect() {
      const rect = await useRect(divRef).catch(() => ({ height: 0 }))
      heightRef.value = rect.height
      return rect
    }

    expose({ getRect })

    const uniId = uniqueId()

    return () => {
      return (
        <>
          <div
            class={['mv-footer-bar', { 'mv-hairline--top': props.border }]}
            style={popStyle.value}
            ref={divRef}
            id={'mv-footer-bar' + uniId}
          >
            <div class='mv-footer-bar-wrapper'>{slots.default?.()}</div>

            {props.safeAreaInsetBottom && <SafeBottom height={props.safeHeight} />}
          </div>
          <div
            v-show={props.position === 'fixed' && props.clearfix}
            style={{ height: heightRef.value + 'px', flex: 'none' }}
          ></div>
        </>
      )
    }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
