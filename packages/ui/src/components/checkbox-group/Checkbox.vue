<script lang="tsx">
import { defineComponent, type PropType, reactive, watch } from 'vue'
import { type TCheckboxSize } from './types'
export default defineComponent({
  name: 'MvCheckbox',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    size: {
      type: String as PropType<TCheckboxSize>,
      default: 'large'
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    const state = reactive({
      isChecked: props.modelValue
    })

    watch(
      () => props.modelValue,
      (val) => {
        state.isChecked = val
      }
    )

    const handleCheckbox = (e: MouseEvent) => {
      e.stopPropagation()
      if (props.disabled || props.readonly) return
      state.isChecked = !state.isChecked
      emit('update:modelValue', state.isChecked)
      emit('change', state.isChecked)
    }
    return () => (
      <div
        class={['mv-checkbox', { 'is-checked': state.isChecked, 'is-disabled': props.disabled }]}
        onClick={(e: MouseEvent) => handleCheckbox(e)}
      >
        <span
          class={[
            'mv-checkbox__inner',
            `mv-checkbox__inner--${props.size}`,
            { checked: state.isChecked }
          ]}
        ></span>
        <span class='mv-checkbox__label'>{!slots.default ? props.label : slots.default()}</span>
      </div>
    )
  }
})
</script>

<style lang="scss">
.mv-checkbox {
  display: flex;
  align-items: center;

  .mv-checkbox__label {
    font-size: 16px;
    color: #333;
  }
  $sizes:
    (
      size: 'large',
      wh: 20px,
      checkScale: 1
    ),
    (
      size: 'medium',
      wh: 16px,
      checkScale: 0.9
    ),
    (
      size: 'small',
      wh: 12px,
      checkScale: 0.75
    );
  .mv-checkbox__inner {
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-right: 5px;
    position: relative;
    &:after {
      box-sizing: content-box;
      content: '';
      border: 2px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 8px;
      width: 4px;
      position: absolute;
      transform: rotate(45deg) scaleY(0);
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
      left: 50%;
      top: 50%;
    }
    @each $size in $sizes {
      $class: map-get($size, size);
      $wh: map-get($size, wh);
      $cS: map-get($size, checkScale);
      &--#{$class} {
        width: $wh;
        height: $wh;
        &.checked {
          &::after {
            transform: translate(-50%, -50%) rotate(45deg) scale($cS) !important;
            margin-top: -1px;
          }
        }
      }
    }
  }

  &.is-checked {
    .mv-checkbox__inner {
      border-color: var(--mv-primary-color);
      background-color: var(--mv-primary-color);
      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
  }

  &.is-disabled {
    .mv-checkbox__inner {
      border-color: var(--mv-disable-color);
      background-color: var(--mv-disable-color);
    }
  }
}
</style>
