<script lang="tsx">
import { defineComponent } from 'vue'
import { EnumYesNoPlus } from '@mid-vue/shared'
import { Button, Navbar } from '@mid-vue/taro-h5-ui'
import { defineCtxState } from '@mid-vue/use'
import type { UterineContractionState } from './types'

export default defineComponent({
  name: 'UterineContraction',
  setup() {
    const [state] = defineCtxState<UterineContractionState>({
      form: {
        isBorn: '10',
        surname: '',
        gender: EnumYesNoPlus.YES,
        birthDate: '',
        birthTime: ''
      }
    })

    const handleSubmit = () => {}

    return () => (
      <div class='uterine-contraction'>
        <Navbar title='宫缩计时' />
        <div class='uterine-contraction-header'>
          <div class='header-time'>00:00</div>
          <Button type='primary' round class='header-btn'>
            宫缩开始
          </Button>
        </div>
        <div class='uterine-contraction-list'></div>
      </div>
    )
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
