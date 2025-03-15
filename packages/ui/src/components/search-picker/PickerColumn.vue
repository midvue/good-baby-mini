<template>
  <view
    class="mv-search-picker-list"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @transitionend="stopMomentum"
  >
    <custom-wrapper>
      <view
        ref="wrapperRef"
        class="mv-search-picker-list__wrap"
        :style="{
          transform: `translate3d(0, ${state.offset + baseOffset()}px, 0)`,
          transitionDuration: `${state.duration}ms`,
          transitionProperty: state.duration ? 'all' : 'none'
        }"
      >
        <template v-if="$attrs.hasRender">
          <view
            v-for="(item, index) in state.options"
            :key="index"
            class="mv-search-picker-list__item"
          >
            <text>{{ item?.[state.contentKey] || item }}</text>
          </view>
        </template>
      </view>
    </custom-wrapper>
    <view class="mv-search-picker-list__indicator"></view>
    <view class="mv-search-picker-list__mask"></view>
  </view>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useTouch } from './useTouch'

const MOMENTUM_LIMIT_DISTANCE = 15
const MOMENTUM_LIMIT_TIME = 300
const DEFAULT_DURATION = 200

function range(num, min, max) {
  return Math.min(Math.max(num, min), max)
}
function stopPropagation(event) {
  event.stopPropagation()
}
function preventDefault(event, isStopPropagation) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    itemHeight: {
      type: Number,
      default: 44
    },
    visibleItemCount: {
      type: Number,
      default: 5
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    readonly: {
      type: Boolean,
      default: false
    },
    rangeKey: {
      type: String,
      default: 'para_name'
    },
    valueKey: {
      type: String,
      default: 'para_value'
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const touch = useTouch()
    const wrapperRef = ref(null)
    const state = reactive({
      index: props.defaultIndex,
      duration: 0,
      offset: 0,
      options: [],
      transitionEndTrigger: null,
      contentKey: props.rangeKey || props.valueKey
    })

    //默认偏移量
    const baseOffset = () => {
      return (+props.itemHeight * (+props.visibleItemCount - 1)) / 2
    }

    const getElementTranslateY = (element) => {
      const { transform } = window.getComputedStyle(element.$el || element)
      //h5
      if (element.$el) {
        const translateY = transform.slice(7, transform.length - 1).split(', ')[5]
        return Number(translateY)
      }
      const translateY = transform.split(', ')[1].replace(/px/, '')
      return Number(translateY)
    }

    let moving = false
    let startOffset = 0
    let touchStartTime = 0
    let momentumOffset = 0
    let durationTime = null
    let optLength = 0

    watch(
      () => props.defaultIndex,
      (value) => {
        if (value !== state.index) {
          state.index = value
          state.offset = -(props.itemHeight * value)
        }
      },
      { immediate: true }
    )

    watch(
      () => props.options,
      () => {
        //截取前50条
        optLength = props.options.length
        state.options = props.options
        state.offset = -(props.itemHeight * props.defaultIndex)
        state.index = props.defaultIndex
        startOffset = 0
      },
      { immediate: true }
    )

    const getIndexByOffset = (offset) => {
      return range(Math.round(-offset / +props.itemHeight), 0, optLength - 1)
    }

    const adjustIndex = (index) => {
      index = range(index, 0, optLength)
      return index
    }

    const setIndex = (index, emitChange = false) => {
      index = adjustIndex(index) || 0
      const offset = -index * +props.itemHeight
      const trigger = () => {
        if (index !== state.index) {
          state.index = index
          if (emitChange) {
            emit('change', index)
          }
        }
      }
      if (moving && offset !== state.offset) {
        state.transitionEndTrigger = trigger
      } else {
        trigger()
      }

      state.offset = offset
    }

    //缓冲区计算
    const momentum = (distance, duration) => {
      const speed = Math.abs(distance / duration)

      distance = state.offset + (speed / 0.03) * (distance < 0 ? -1 : 1)

      const index = getIndexByOffset(distance)
      moving = false
      setIndex(index, true)
    }

    //touch start
    const onTouchStart = (event) => {
      if (props.readonly) {
        return
      }

      touch.start(event)

      if (moving) {
        const translateY = getElementTranslateY(wrapperRef?.value)
        state.offset = Math.min(0, translateY - baseOffset())
        startOffset = state.offset
      } else {
        startOffset = state.offset
      }

      state.duration = 0
      touchStartTime = Date.now()
      momentumOffset = startOffset
      state.transitionEndTrigger = null
    }

    const onTouchMove = (event) => {
      if (props.readonly) {
        return
      }

      touch.move(event)

      if (touch.isVertical()) {
        moving = true
        preventDefault(event, true)
      }

      const moveOffset = startOffset + touch.deltaY.value
      if (moveOffset > props.itemHeight) {
        state.offset = props.itemHeight
      } else {
        state.offset = startOffset + touch.deltaY.value
      }

      const now = Date.now()
      if (now - touchStartTime > MOMENTUM_LIMIT_TIME) {
        touchStartTime = now
        momentumOffset = state.offset
      }
    }

    const onTouchEnd = () => {
      if (props.readonly) {
        return
      }

      const distance = state.offset - momentumOffset
      const duration = Date.now() - touchStartTime
      const allowMomentum =
        duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE

      //如果缓慢移动
      if (allowMomentum) {
        momentum(distance, duration)
        return
      }

      const index = getIndexByOffset(state.offset)
      state.duration = DEFAULT_DURATION
      setIndex(index, true)

      // compatible with desktop scenario
      // use setTimeout to skip the click event Emitted after touchstart

      setTimeout(() => {
        moving = false
      }, 0)

      //微信小程序不会自动触发stopMomentum回调
      //手动处理
      if (!wrapperRef?.value.$el) {
        if (durationTime) {
          clearTimeout(durationTime)
        }
        durationTime = setTimeout(() => {
          stopMomentum()
          clearTimeout(durationTime)
        }, DEFAULT_DURATION)
      }
    }

    const stopMomentum = () => {
      moving = false
      state.duration = 0
      if (state.transitionEndTrigger) {
        state.transitionEndTrigger()
        state.transitionEndTrigger = null
      }
    }

    return {
      state,
      wrapperRef,
      baseOffset,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      stopMomentum
    }
  }
}
</script>

<style lang="scss">
@import '../styles/hairline';
.mv-search-picker-list {
  width: 100%;
  flex: 1;
  position: relative;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  &__mask {
    position: absolute;
    left: 0;
    width: 100%;
    top: 0;
    bottom: 0;
    transform: translateZ(0);

    &::before {
      position: absolute;
      content: ' ';
      top: 0;
      left: 0;
      width: 100%;
      /* prettier-ignore */
      height: 87PX;
      background-repeat: no-repeat;
      background: linear-gradient(180deg, hsla(0, 0%, 100%, 0.95), hsla(0, 0%, 100%, 0.6));
    }
    &::after {
      position: absolute;
      content: ' ';
      bottom: 0;
      left: 0;
      width: 100%;
      /* prettier-ignore */
      height: calc(100% - 133PX);
      background-repeat: no-repeat;
      background: linear-gradient(0deg, hsla(0, 0%, 100%, 0.95), hsla(0, 0%, 100%, 0.6));
    }
  }

  &__indicator {
    position: absolute;
    /* prettier-ignore */
    top: 88PX;
    left: 0;
    width: 100%;
    /* prettier-ignore */
    height: 44PX;

    &::before {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      top: 0;
      left: 0;
      border-top: 1px solid var(--mv-border-color);
      transform: scaleY(0.5);
      transform-origin: top;
      @extend %px-media;
    }
    &::after {
      position: absolute;
      box-sizing: border-box;
      content: ' ';
      pointer-events: none;
      right: 0;
      bottom: 0;
      left: 0;
      border-bottom: 1px solid var(--mv-border-color);
      transform: scaleY(0.5);
      @extend %px-media;
    }
  }

  &__wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    -webkit-overflow-scrolling: touch;
  }
  &__item {
    /* prettier-ignore */
    height: 44PX;
    /* prettier-ignore */
    line-height: 44PX;
    flex: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    max-width: 86%;
  }
}
</style>
