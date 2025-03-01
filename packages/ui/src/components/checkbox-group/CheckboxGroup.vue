<script lang="tsx">
import { defineComponent, reactive, watch } from 'vue'
import Checkbox from './Checkbox.vue'
import { checkboxGroupProps, type ICheckboxGroupState } from './checkboxGroup'
export default defineComponent({
  name: 'MvCheckboxGroup',
  components: {
    Checkbox
  },
  inheritAttrs: false,
  props: checkboxGroupProps,
  setup(props, { emit }) {
    const state: ICheckboxGroupState = reactive({
      options: props.options,
      values: props.modelValue
    })

    const initOptions = () => {
      // 重置选中状态
      state.options = props.options.map((item) => {
        if (!item[props.valuekey] || !props.modelValue.includes(item[props.valuekey] || '')) {
          item.isChecked = false
        } else {
          item.isChecked = true
        }
        return item
      })
    }

    watch(
      () => props.modelValue,
      () => {
        // 如果值没有变化，不做任何操作
        if (
          props.modelValue.length === state.values.length &&
          props.modelValue.toString() === state.values.toString()
        ) {
          return
        }
        initOptions()
      },
      {
        immediate: true
      }
    )

    watch(
      () => props.options.length,
      () => initOptions(),
      {
        immediate: true
      }
    )

    const handleCheckboxChange = (index: number) => {
      const option = state.options[index]
      const values: any[] = []
      state.options.forEach((item) => {
        if (item.isChecked) {
          values.push(item[props.valuekey])
        }
      })
      state.values = values
      emit('update:modelValue', values)
      props.onChange?.(option)
    }

    return () => (
      <div class={['mv-checkbox-group', 'mv-checkbox-group__' + props.mode]}>
        {state.options.map((item, index) => {
          return (
            <Checkbox
              key={index}
              v-model={item.isChecked}
              readonly={item.readonly || props.readonly}
              disabled={item.disabled || props.disabled}
              onChange={() => handleCheckboxChange(index)}
            >
              {item[props.labelKey]}
            </Checkbox>
          )
        })}
      </div>
    )
  }
})
</script>

<style lang="scss">
.mv-checkbox-group {
  &__horizontal {
    display: flex;
    align-items: center;
    flex-flow: row wrap;

    .mv-checkbox + .mv-checkbox {
      margin-left: 10px;
    }
  }

  &__vertical {
    display: flex;
    flex-direction: column;

    .mv-checkbox {
      margin-bottom: 26px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
