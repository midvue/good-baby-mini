<script lang="tsx">
import { defineComponent, type PropType, type VNode } from 'vue'
import { isFunction } from '@mid-vue/shared'
import { Image } from '@mid-vue/taro-h5-ui'

export default defineComponent({
  props: {
    src: {
      type: String,
      default: ''
    },
    message: {
      type: [String, Object, Function] as PropType<string | VNode | Function>,
      default: '暂无匹配内容'
    }
  },
  setup(props, { slots }) {
    const renderMsg = () => {
      return isFunction(props.message) ? props.message() : props.message
    }
    return () => (
      <div class='mv-mini-zc-empty'>
        <Image src={props.src} class='mv-mini-zc-empty-image' mode='scaleToFill' />
        <span class='mv-mini-zc-empty-message'>
          {slots.default ? slots.default?.() : renderMsg()}
          <div class='mt-[12px]'>{slots.button?.()}</div>
        </span>
      </div>
    )
  }
})
</script>

<style lang="scss">
.mv-mini-zc-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 185px;
  height: 100%;
  .mv-mini-zc-empty-image {
    width: 156px;
    height: 120px;
    object-fit: contain;
  }
  .mv-mini-zc-empty-message {
    position: relative;
    top: -8px;
    font-size: 14px;
    font-weight: normal;
    color: #b5b3be;
    text-align: center;
    max-width: 280px;
  }
}
</style>
