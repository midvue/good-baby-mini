<script lang="tsx">
import { computed, defineComponent, h, type HtmlHTMLAttributes } from 'vue'
import Taro from '@tarojs/taro'
import { isFunction, isString, get } from '@mid-vue/shared'
import { FORM_KEY } from '../../constants'
import * as UI from '../../index'
import { useChildren } from '../../use/useRelation'
import FormItem from './FormItem.vue'
import { formProps } from './props'
import { type ItemClickEvent, type IFormItem, type ValidateError } from './types'

export default defineComponent({
  name: 'MvForm',
  components: {},
  inheritAttrs: false,
  props: formProps,
  emits: ['update:modelValue'],
  setup(props, { expose, attrs }) {
    const readonly = computed(() => props.readonly)
    const formProvider = {
      readonly,
      getData: (field?: string) => (field ? get(props.data, field) : props.data)
    }
    const { children, linkChildren } = useChildren(FORM_KEY)

    const getFieldsByNames = (names?: string[]) => {
      if (names) {
        return children.filter((child) => names.includes(child.field))
      }
      return children
    }

    const validateSeq = async (names?: string[]) => {
      const fields = getFieldsByNames(names)
      reset(fields)
      const errors: ValidateError[] = []
      for (const field of fields) {
        const res = await field.validate().catch((error: ValidateError) => {
          errors.push(error)
          return false
        })
        if (!res) {
          return Promise.reject(errors)
        }
      }

      return true
    }

    const validateAll = (names?: string[]) =>
      new Promise<void>((resolve, reject) => {
        const fields = getFieldsByNames(names)
        const errors: ValidateError[] = []
        Promise.all(
          fields.map((item) =>
            item.validate().catch((error: ValidateError) => {
              errors.push(error)
              return false
            })
          )
        ).then(() => {
          if (errors.length) {
            reject(errors)
          } else {
            resolve()
          }
        })
      })

    const validate = async (fields?: string | string[]) => {
      if (isString(fields)) {
        return validateField(fields)
      }
      return props.validateFirst ? validateSeq(fields) : validateAll(fields)
    }

    const validateField = (field: string) => {
      const matched = children.find((item) => item.field === field)

      if (matched) {
        return matched.validate()
      }
      return Promise.resolve(true)
    }

    /** 重置校验 */
    const reset = (names = children) => {
      names.forEach((field) => field.reset())
    }

    linkChildren(formProvider)
    expose({ validate, reset })

    //渲染子组件
    const renderChild = (cell: IFormItem) => {
      if (!cell.component) return null
      if (isFunction(cell.component)) {
        return cell.component(cell.field!)
      }

      let model = props.data
      let field = cell.field!
      // 处理v-model,支持多层级 a.b.c
      if (field.includes('.')) {
        const keys = field.split('.')
        field = keys[keys.length - 1]
        for (let i = 0, length = keys.length - 1; i < length; i++) {
          model = model[keys[i]]
        }
      }
      return h((UI as Record<string, any>)[cell.component.name!], {
        ...cell.component.attrs,
        modelValue: model[field],
        'onUpdate:modelValue': (value: string) => {
          model[field] = value
        }
      })
    }
    /** 渲染formItem */
    const renderFormItem = (cell: IFormItem, index: number) => {
      const isShow = isFunction(cell.show) ? cell.show() : (cell.show ?? true)
      if (!isShow) return null
      if (isFunction(cell.render)) {
        return cell.render(cell.field!, index)
      }
      const requiredType = props.requiredType || cell.attrs?.requiredType
      const labelAlign = props.labelAlign || cell.attrs?.labelAlign

      const onClick = (event: ItemClickEvent) => {
        const click = cell.attrs?.onClick || props.onItemClick
        //兼容h5
        if (Taro.getEnv() === Taro.ENV_TYPE.WEB) {
          click?.({ ...event, detail: { $index: index, value: event.detail } })
          return
        }
        event.detail.$index = index
        click?.(event)
      }

      //插槽
      const slots = { default: () => renderChild(cell) } as Record<string, Function>
      if (cell.slots?.append) {
        slots.append = () => cell.slots!.append()
      }
      if (cell.label) {
        slots.label = () => (isFunction(cell.label) ? cell.label() : cell.label || '')
      }

      return (
        <FormItem
          requiredType={requiredType}
          labelAlign={labelAlign}
          field={cell.field}
          key={index + '' + cell.field!}
          rules={cell.rules}
          {...{ ...cell.attrs, onClick }}
        >
          {slots}
        </FormItem>
      )
    }

    return () => {
      return (
        <form class='mv-form' {...attrs}>
          {props.cells.map((cell, index) => {
            if (cell.children?.length) {
              return (
                <view class='mv-form-item-group' {...(cell.attrs as HtmlHTMLAttributes)}>
                  {cell.children.map((child, index) => {
                    return renderFormItem(child, index)
                  })}
                </view>
              )
            }
            return renderFormItem(cell, index)
          })}
        </form>
      )
    }
  }
})
</script>

<style lang="scss">
.mv-form {
  width: 100%;
  display: flex;
  flex-direction: column;

  .mv-form-item-group {
    width: 100%;
    display: inline-flex;
    flex-direction: column;
  }
}
</style>
