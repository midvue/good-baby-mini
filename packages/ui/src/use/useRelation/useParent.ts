import {
  ref,
  inject,
  computed,
  onUnmounted,
  type InjectionKey,
  getCurrentInstance,
  type ComponentPublicInstance,
  type ComponentInternalInstance
} from 'vue'

type ParentProvide<T> = T & {
  link(child: ComponentInternalInstance): void
  unlink(child: ComponentInternalInstance): void
  children: ComponentPublicInstance[]
  internalChildren: ComponentInternalInstance[]
  getData: (field?: string) => Record<string, any>
}

export function useParent<T>(key: InjectionKey<ParentProvide<T>>) {
  const parent = inject(key, null)

  if (parent) {
    const instance = getCurrentInstance()!

    const expose = (expose: Record<string, any>) => {
      Object.assign(instance.proxy || {}, expose)
    }

    const { link, unlink, internalChildren } = parent
    link(instance)
    onUnmounted(() => unlink(instance))

    const index = computed(() => internalChildren.indexOf(instance))

    return {
      expose,
      parent,
      index
    }
  }

  return {
    expose: null,
    parent: null,
    index: ref(-1)
  }
}
