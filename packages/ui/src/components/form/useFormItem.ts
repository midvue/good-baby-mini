import { inject, provide, type InjectionKey } from 'vue'
import { type RuleTrigger } from './types'

export type FormItemInjectionOption = {
  reset: () => void
  validateWithTrigger: (trigger: RuleTrigger, value: any) => void
  setValidateValue: (value: unknown) => void
}

export function provideFormItem(option: FormItemInjectionOption) {
  provide(CUSTOM_FIELD_INJECTION_KEY, option)
}

export const CUSTOM_FIELD_INJECTION_KEY: InjectionKey<FormItemInjectionOption> = Symbol('mid-vue-field')

/** 获取表单校验实例, */
export function useFormItem() {
  const formItem = inject<FormItemInjectionOption>(
    CUSTOM_FIELD_INJECTION_KEY,
    {} as FormItemInjectionOption
  )

  return formItem
}
