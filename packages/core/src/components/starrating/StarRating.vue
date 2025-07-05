<script lang="tsx">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StarRating',
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value: string) => {
        return ['small', 'medium', 'large'].includes(value)
      }
    }
  },
  emits: ['update:modelValue'], // 触发 update:modelValue 事件
  setup(props, { emit }) {
    const handleStarClick = (index: number) => {
      emit('update:modelValue', index + 1) // 触发更新事件
    }

    // 根据 size 属性获取对应的字体大小
    const getStarSize = () => {
      switch (props.size) {
        case 'small':
          return '16px'
        case 'medium':
          return '24px'
        case 'large':
          return '32px'
        default:
          return '24px'
      }
    }

    // 根据 size 属性获取对应的星星间距
    const getStarGap = () => {
      switch (props.size) {
        case 'small':
          return '1px'
        case 'medium':
          return '5px'
        case 'large':
          return '7px'
        default:
          return '5px'
      }
    }

    return () => (
      <div class='star-rating' style={{ gap: getStarGap() }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            class={{
              star: true,
              active: index < props.modelValue
            }}
            style={{ fontSize: getStarSize() }}
            onClick={() => handleStarClick(index)}
          >
            ★
          </span>
        ))}
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';

.star-rating {
  display: flex;
}

.star {
  color: #ddd;
  cursor: pointer;
}

.star.active {
  color: #ffd700;
}
</style>
