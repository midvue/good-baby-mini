<script lang="tsx">
import { useNumber } from '@mid-vue/shared'
import { Input } from '@mid-vue/taro-h5-ui'
import { defineComponent, reactive, watch } from 'vue'

export default defineComponent({
  name: 'time-input',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    let state = reactive({
      minute: 0,
      second: 0
    })

    watch(
      () => props.modelValue,
      (value) => {
        let num = useNumber(value)
        state.minute = Number(num.div(60).toFixed(0, 0))
        state.second = num.mod(60).toNumber()
      },
      {
        immediate: true
      }
    )

    watch(
      () => [state.minute, state.second],
      () => {
        let num = Number(state.minute || 0) * 60 + Number(state.second || 0)
        emit('update:modelValue', num)
      }
    )

    return () => {
      return (
        <div class='time-input'>
          <div class='flex items-center'>
            <Input v-model={state.minute} append='分' type='number'></Input>
            <Input
              v-model={state.second}
              append='秒'
              formatter={(value) => {
                return Number(value || 0) > 59 ? 59 : value
              }}
              type='number'
              class='ml-[10px]'
            ></Input>
          </div>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
.time-input {
  width: 100%;
}
</style>
