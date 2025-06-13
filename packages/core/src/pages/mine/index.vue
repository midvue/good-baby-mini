<script lang="tsx">
import { defineComponent } from 'vue'

import { SafeBottom } from '@mid-vue/taro-h5-ui'
import { useList, useProfile } from './hooks'

export default defineComponent({
  name: 'Mine',
  setup() {
    const { render: renderProfile } = useProfile()
    const { render: renderList } = useList()

    return () => {
      return (
        <div class='mine'>
          {renderProfile()}
          {renderList()}
          <SafeBottom></SafeBottom>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
