<script lang="tsx">
import { computed, defineComponent } from 'vue'
import { Tag } from '@mid-vue/taro-h5-ui'
import { checkBabyTemperature, HEALTH_STATUS } from './useDegress'

export default defineComponent({
  name: 'DegressBtn',
  props: {
    age: {
      type: Number,
      default: ''
    },
    temperature: {
      type: Number,
      default: ''
    }
  },
  setup(props) {
    const status = checkBabyTemperature(props.age, props.temperature)
    const buttonColor = computed(() => {
      switch (status) {
        case HEALTH_STATUS.NORMAL:
          return 'success'
        case HEALTH_STATUS.FEVER:
          return 'primary'
        case HEALTH_STATUS.HIGH_FEVER:
          return 'danger'
        case HEALTH_STATUS.ABNORMAL:
        case HEALTH_STATUS.INVALID_AGE:
          return 'warning'
        default:
          return 'warning'
      }
    })

    return () => {
      return (
        <Tag type={buttonColor.value} size='small'>
          {status}
        </Tag>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
