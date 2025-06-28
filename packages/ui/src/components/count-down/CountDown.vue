<script lang="tsx">
import { defineComponent, ref, computed, watch, onBeforeUnmount } from 'vue'
import { isSameSecond, parseTimeData, parseFormat } from './utils'

export default defineComponent({
  name: 'MvCountDown',
  props: {
    time: {
      type: [Number, String],
      default: 0
    },
    format: {
      type: String,
      default: 'HH:mm:ss'
    }
  },
  emits: ['change', 'finish'],
  setup(props, { emit, slots }) {
    const remain = ref(Number(props.time))
    let endTime = 0
    let rafId: number | null = null

    const timeData = computed(() => parseTimeData(remain.value))
    const formattedTime = computed(() => parseFormat(props.format, timeData.value))

    const pause = () => {
      if (rafId !== null) {
        clearTimeout(rafId)
        rafId = null
      }
    }

    const setRemain = (newRemain: number) => {
      remain.value = newRemain
      emit('change', timeData.value)
      if (newRemain === 0) {
        pause()
        emit('finish')
      }
    }

    const getRemain = () => {
      return Math.max(endTime - Date.now(), 0)
    }

    const macroTick = () => {
      rafId = window.setTimeout(() => {
        const newRemain = getRemain()
        if (!isSameSecond(newRemain, remain.value) || newRemain === 0) {
          setRemain(newRemain)
        }
        if (remain.value > 0) {
          macroTick()
        }
      }, 1000)
    }

    const start = () => {
      endTime = Date.now() + remain.value
      macroTick()
    }

    const reset = () => {
      pause()
      remain.value = Math.max(Number(props.time), 0)
      start()
    }

    watch(() => props.time, reset, { immediate: true })

    onBeforeUnmount(() => {
      pause()
    })

    return () => (
      <span>
        {slots.default ? slots.default({ timeData: timeData.value }) : formattedTime.value}
      </span>
    )
  }
})
</script>
