<script lang="tsx">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  type CSSProperties,
  type ExtractPropTypes,
  type PropType
} from 'vue'
import { View, type CommonEvent, type ITouchEvent } from '@tarojs/components'

import Taro from '@tarojs/taro'
import { useRect } from '../../use/useRect'

// Types
import {
  type FloatingBubbleAxis,
  type FloatingBubbleBoundary,
  type FloatingBubbleMagnetic,
  type FloatingBubbleOffset
} from './types'

export const floatingBubbleProps = {
  gap: {
    type: Object as PropType<{ x: number; y: number }>,
    default: () => ({ x: 24, y: 24 })
  },
  icon: String,
  axis: {
    type: String as PropType<FloatingBubbleAxis>,
    default: 'y'
  },
  magnetic: String as PropType<FloatingBubbleMagnetic>,
  offset: {
    type: Object as unknown as PropType<FloatingBubbleOffset>,
    default: () => ({ x: -1, y: -1 })
  }
}

export type FloatingBubbleProps = ExtractPropTypes<typeof floatingBubbleProps>

type Direction = '' | 'vertical' | 'horizontal'
function getDirection(x: number, y: number) {
  if (x > y) {
    return 'horizontal'
  }
  if (y > x) {
    return 'vertical'
  }
  return ''
}
export const TAP_OFFSET = 5
export function useTouch() {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const direction = ref<Direction>('')
  const isTap = ref(true)

  const isVertical = () => direction.value === 'vertical'
  const isHorizontal = () => direction.value === 'horizontal'

  const reset = () => {
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0
    direction.value = ''
    isTap.value = true
  }

  const start = (event: CommonEvent) => {
    reset()
    //@ts-ignore
    startX.value = event.touches[0].clientX
    //@ts-ignore
    startY.value = event.touches[0].clientY
  }

  const move = (event: CommonEvent) => {
    //@ts-ignore
    const touch = event.touches[0]
    // safari back will set clientX to negative number
    deltaX.value = (touch.clientX < 0 ? 0 : touch.clientX) - startX.value
    deltaY.value = touch.clientY - startY.value
    offsetX.value = Math.abs(deltaX.value)
    offsetY.value = Math.abs(deltaY.value)

    // lock direction when distance is greater than a certain value
    const LOCK_DIRECTION_DISTANCE = 10
    if (
      !direction.value ||
      (offsetX.value < LOCK_DIRECTION_DISTANCE && offsetY.value < LOCK_DIRECTION_DISTANCE)
    ) {
      direction.value = getDirection(offsetX.value, offsetY.value)
    }

    if (isTap.value && (offsetX.value > TAP_OFFSET || offsetY.value > TAP_OFFSET)) {
      isTap.value = false
    }
  }

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal,
    isTap
  }
}

function closest(arr: number[], target: number) {
  return arr.reduce((pre, cur) => (Math.abs(pre - target) < Math.abs(cur - target) ? pre : cur))
}

export default defineComponent({
  inheritAttrs: false,

  props: floatingBubbleProps,

  emits: ['click', 'update:offset', 'offsetChange'],

  setup(props, { slots, emit, attrs }) {
    const rootRef = ref<HTMLDivElement>()
    const refRandomId = Math.random().toString(36).slice(-8)

    const domElem = Taro.getSystemInfoSync()
    const state = ref({
      x: domElem.screenWidth - props.gap.x,
      y: domElem.screenHeight - props.gap.y,
      width: 0,
      height: 0
    })
    const boundary = computed<FloatingBubbleBoundary>(() => ({
      top: props.gap.y,
      right: domElem.screenWidth - state.value.width - props.gap.x,
      bottom: domElem.screenHeight - state.value.height - props.gap.y,
      left: props.gap.x
    }))

    const dragging = ref(false)
    let initialized = false

    const rootStyle = computed(() => {
      const style: CSSProperties = {}

      const x = state.value.x + 'px'
      const y = state.value.y + 'px'
      style.transform = `translate3d(${x}, ${y}, 0)`

      if (dragging.value || !initialized) {
        style.transition = 'none'
      }

      return style
    })
    // 图片过大可能会导致拿不到高度，最多加载3次
    let times = 0
    const updateState = () => {
      // onDeactivated with window size change will cause this
      useRect(rootRef.value!).then(({ width, height }) => {
        if (!height && times <= 3) {
          updateState()
          times++
        }
        const { offset } = props
        state.value = {
          x: offset.x > -1 ? offset.x : domElem.screenWidth - width - props.gap.x,
          y: offset.y > -1 ? offset.y : domElem.screenHeight - height - props.gap.y,
          width,
          height
        }
      })
    }

    const touch = useTouch()
    let prevX = 0
    let prevY = 0

    const onTouchStart = (e: CommonEvent) => {
      Taro.stopPullDownRefresh()
      touch.start(e)
      dragging.value = true

      prevX = state.value.x
      prevY = state.value.y
    }

    const onTouchMove = (e: CommonEvent) => {
      Taro.stopPullDownRefresh()
      e.preventDefault()

      touch.move(e)

      if (props.axis === 'lock') return

      if (!touch.isTap.value) {
        if (props.axis === 'x' || props.axis === 'xy') {
          let nextX = prevX + touch.deltaX.value
          if (nextX < boundary.value.left) nextX = boundary.value.left
          if (nextX > boundary.value.right) nextX = boundary.value.right
          state.value.x = nextX
        }

        if (props.axis === 'y' || props.axis === 'xy') {
          let nextY = prevY + touch.deltaY.value
          if (nextY < boundary.value.top) nextY = boundary.value.top
          if (nextY > boundary.value.bottom) nextY = boundary.value.bottom
          state.value.y = nextY
        }

        const offset = { x: state.value.x, y: state.value.y }
        emit('update:offset', offset)
      }
    }

    const onTouchEnd = () => {
      Taro.stopPullDownRefresh()
      dragging.value = false

      nextTick(() => {
        if (props.magnetic === 'x') {
          const nextX = closest([boundary.value.left, boundary.value.right], state.value.x)
          state.value.x = nextX
        }
        if (props.magnetic === 'y') {
          const nextY = closest([boundary.value.top, boundary.value.bottom], state.value.y)
          state.value.y = nextY
        }

        if (!touch.isTap.value) {
          const offset = { x: state.value.x, y: state.value.y }
          emit('update:offset', offset)
          if (prevX !== offset.x || prevY !== offset.y) {
            emit('offsetChange', offset)
          }
        }
      })
    }

    const onClick = (e: ITouchEvent) => {
      if (touch.isTap.value) emit('click', e)
      else e.stopPropagation()
    }

    onMounted(() => {
      setTimeout(() => {
        updateState()
        setTimeout(() => {
          initialized = true
        }, 200)
      }, 200)
    })

    return () => (
      <View
        catchMove={true}
        ref={rootRef}
        id={'mv-drag' + refRandomId}
        class='mv-drag'
        onTouchmove={onTouchMove}
        onTouchstart={onTouchStart}
        onTouchend={onTouchEnd}
        onTouchcancel={onTouchEnd}
        onClick={onClick}
        style={rootStyle.value}
        {...attrs}
      >
        {slots.default?.()}
      </View>
    )
  }
})
</script>
<style lang="scss">
.mv-drag {
  top: 0;
  left: 0;
  right: 24;
  bottom: 24;
  width: fit-content;
  height: fit-content;
  box-sizing: border-box;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  touch-action: none;
  border-radius: 9999;
  z-index: 999;
  transition: transform 0.3s;
  justify-content: center;
  align-items: center;
  display: flex;
  position: fixed;
  overflow: hidden;
}
</style>
