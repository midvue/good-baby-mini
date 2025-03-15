<template>
  <view
    class="mv-form-item"
    v-bind="$attrs"
    :class="[
      `mv-form-item__${labelAlign}`,
      {
        'mv-form-item__border': $attrs.border,
        'mv-form-item__clickable': $attrs.clickable
      }
    ]"
    :hover-class="$attrs.clickable ? 'mv-form-item__hover' : ''"
    :hover-start-time="17"
    :hover-stay-time="48"
    @tap="onClick"
  >
    <view
      v-if="(label || $slots.label) && '0px' != labelWidth"
      :class="['mv-form-item-label', labelClass]"
      :style="{ width: labelWidth }"
    >
      <slot name="label">{{ label }}</slot>
      <view v-if="requiredRef" class="required">
        <Tag type="danger" size="mini" plain v-if="requiredType === 'TAG'">必填</Tag>
        <text v-else>*</text>
      </view>
    </view>
    <view class="mv-form-item-value">
      <slot></slot>
      <view class="mv-form-item-error" v-show="state.validateMessage">{{
        state.validateMessage
      }}</view>
    </view>
    <view class="mv-form-item-append" v-if="$slots.append || rightArrow">
      <slot name="append"><mv-icon v-show="rightArrow" name="arrow"></mv-icon></slot>
    </view>
  </view>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed } from 'vue'
import { type CommonEvent } from '@tarojs/components'
import { isFunction, isPromise } from '@mid-vue/shared'
import { FORM_KEY } from '../../constants'
import { useParent } from '../../use/useRelation'
import Icon from '../icon'
import Tag from '../tag'
import { formItemProps } from './props'
import { type IRule, type RuleTrigger } from './types'
import { provideFormItem } from './useFormItem'

export default defineComponent({
  name: 'MvFormItem',
  components: { Tag, mvIcon: Icon },
  inheritAttrs: false,
  props: formItemProps,
  emits: ['click'],
  setup(props, { emit }) {
    enum EnumValidateStatus {
      UN_VALIDATED = 'unValidated',
      FAILED = 'failed',
      PASSED = 'passed'
    }

    const state = reactive({
      status: EnumValidateStatus.UN_VALIDATED,
      validateMessage: ''
    })

    const requiredRef = computed(() => {
      if (isFunction(props.required)) {
        return props.required()
      }
      return props.required
    })

    const { parent: form, expose } = useParent(FORM_KEY)

    const currValue = ref()

    function isEmptyValue(value: unknown) {
      if (Array.isArray(value)) {
        return !value.length
      }
      if (value === 0) {
        return false
      }
      return !value
    }

    function runSyncRule(value: unknown, rule: IRule) {
      if (isEmptyValue(value)) {
        if (rule.required) {
          return false
        }
      }
      if (rule.pattern && !rule.pattern.test(String(value))) {
        return false
      }
      return true
    }

    function getRuleMessage(value: unknown, rule: IRule) {
      const { message } = rule

      if (isFunction(message)) {
        return message(value, rule)
      }
      return message || ''
    }

    function runRuleValidator(value: unknown, rule: IRule) {
      return new Promise((resolve, reject) => {
        const returnVal = rule.validator!(value, rule)
        if (isPromise(returnVal)) {
          returnVal.then(resolve).catch(reject)
          return
        }
        if (!returnVal || returnVal === true) {
          resolve(true)
        } else {
          reject(returnVal)
        }
      })
    }

    const runRules = async (rules: IRule[]) => {
      if (state.status === EnumValidateStatus.FAILED) return false

      for (const rule of rules) {
        const value = currValue.value || props.field ? form!.getData(props.field) : ''

        if (!rule.validator) {
          if (!runSyncRule(value, rule)) {
            state.status = EnumValidateStatus.FAILED
            state.validateMessage = getRuleMessage(value, rule)
            return false
          }
          continue
        }
        return await runRuleValidator(value, rule).catch((msg) => {
          state.status = EnumValidateStatus.FAILED
          state.validateMessage = msg
          return false
        })
      }
      return true
    }

    const validate = async (rules = props.rules) => {
      reset()

      if (!rules?.length) return true
      return await runRules(rules).then(() => {
        if (state.status === EnumValidateStatus.FAILED) {
          return Promise.reject({
            name: props.field,
            message: state.validateMessage
          })
        } else {
          state.status = EnumValidateStatus.PASSED
          state.validateMessage = ''
          return true
        }
      })
    }

    function reset() {
      state.status = EnumValidateStatus.UN_VALIDATED
      state.validateMessage = ''
    }

    expose?.({ validate, reset })

    const validateWithTrigger = (trigger: RuleTrigger, value: unknown) => {
      if (form && props.rules) {
        currValue.value = value
        const rules = props.rules?.filter((rule) => rule.trigger?.includes(trigger))
        if (rules?.length) {
          validate(rules).catch((error) => {
            console.error(error)
          })
        }
      }
    }

    const setValidateValue = (value: unknown) => {
      currValue.value = value
    }

    provideFormItem({
      validateWithTrigger,
      reset,
      setValidateValue
    })

    const onClick = (e: CommonEvent) => {
      emit('click', e)
    }
    return { state, isFunction, onClick, requiredRef }
  }
})
</script>

<style lang="scss">
@import '../styles/hairline';
.mv-form-item {
  font-size: 14px;
  color: var(--mv-black);
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;

  .mv-form-item-label {
    width: 114px;
    color: var(--mv-title-color);
    flex: none;
    min-height: 34px;

    display: flex;
    align-items: center;
    flex: none;
    font-weight: bold;

    .required {
      color: #f95e5a;
      display: inline-flex;
      align-items: center;
    }
  }

  .mv-form-item-value {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    min-height: 44px;
    width: 100%;
    position: relative;
  }

  &.mv-form-item__left {
    flex-direction: row;
    .mv-form-item-label {
      text-align: left;
    }
  }

  &.mv-form-item__right {
    flex-direction: row;
    .mv-form-item-label {
      text-align: right;
    }
  }

  &.mv-form-item__top {
    flex-direction: column;
    align-items: flex-start;
    .mv-form-item-label {
      text-align: right;
    }
  }

  .mv-form-item-append {
    flex: none;
    display: inline-flex;
    align-items: center;
    height: 100%;
  }

  &.mv-form-item__border::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid var(--mv-border-color);
    transform: scaleY(0.5);
    z-index: 2;
    @extend %px-media;
  }
  // 点击反馈交互效果
  &.mv-form-item__clickable {
    background-color: white;
  }
  &.mv-form-item__hover {
    background-color: #f8f9fa;
  }

  .mv-form-item-error {
    position: absolute;
    bottom: -29px;
    background: rgba(77, 77, 77);
    right: 5px;
    color: #ffffff;
    font-size: 14px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 8px 11px;
    z-index: 99;

    &::after {
      content: ' ';
      display: block;
      position: absolute;
      top: -6px;
      right: 30px;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 7px solid rgba(77, 77, 77);
    }
  }
}
</style>
