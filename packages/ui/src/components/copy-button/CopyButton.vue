<script lang="tsx">
import { defineComponent, withModifiers, type PropType } from 'vue'
import Taro from '@tarojs/taro'
import Icon from '../icon/Icon.vue'
import Image from '../image/Image.vue'

export default defineComponent({
  name: 'CopyButton',
  inheritAttrs: false,
  props: {
    text: {
      required: true,
      type: String as PropType<string>,
      default: ''
    },
    icon: {
      type: String as PropType<string>,
      required: false
    },
    color: {
      type: String as PropType<string>,
      default: '#949494'
    },
    successMsg: {
      type: String as PropType<string>,
      default: '复制成功'
    },
    errorMsg: {
      type: String as PropType<string>,
      default: '复制失败'
    },
    duration: {
      type: Number,
      default: 2000
    }
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const copyText = () => {
      const { successMsg, errorMsg } = props
      Taro.setClipboardData({
        data: props.text,
        success() {
          successMsg &&
            Taro.showToast({
              title: successMsg,
              duration: props.duration
            })
          emit('success')
        },
        fail() {
          errorMsg &&
            Taro.showToast({
              title: errorMsg,
              duration: props.duration
            })
          emit('error')
        }
      })
    }

    return () => (
      <span class='copy-button' onClick={withModifiers(copyText, ['stop'])}>
        {props.icon ? (
          <Image src={props.icon} class='copy-button-icon' />
        ) : (
          <Icon name='mv-icon-copy' class='copy-button-icon' />
        )}
      </span>
    )
  }
})
</script>

<style lang="scss">
.copy-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: v-bind(color);
  margin-left: 4px;
  .copy-button-icon {
    cursor: pointer;
    width: 12px;
    height: 12px;
    font-size: 12px;
    object-fit: cover;
  }
}
</style>
