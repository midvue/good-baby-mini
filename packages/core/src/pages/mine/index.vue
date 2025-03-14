<script lang="tsx">
import { defineComponent } from 'vue'

import { useList, useProfile } from './hooks'

export default defineComponent({
  name: 'Mine',
  setup() {
    let { render: renderProfile } = useProfile()
    let { render: renderList } = useList()

    return () => {
      return (
        <div class='mine'>
          {renderProfile()}
          {renderList()}
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
