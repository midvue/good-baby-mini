import { getStorage, setStorage } from '@/utils'
import Http from '@mid-vue/http-client'

interface DictItem {
  code: string
  name: string
  sort?: number
  list: DictItem[]
}
type codeType = (typeof codes)[number]
type DictMap = Record<codeType, Omit<DictItem, 'list'>[]>
type DictObjMap = Record<codeType, Record<string, DictItem>>

let codes = ['GENDER', 'OPERATE_TYPE'] as const

let dictListMap = {} as DictMap
let dictObjMap = {} as DictObjMap

let DICT_LIST_KEY = 'dict_list'
let DICT_OBJ_KEY = 'dict_obj'
/**
 * 获取字典
 */
export let initDict = async () => {
  dictListMap = getStorage<DictMap>(DICT_LIST_KEY) || ({} as DictMap)
  dictObjMap = getStorage<DictObjMap>(DICT_OBJ_KEY) || ({} as DictObjMap)
  const option = {
    url: '/dict/batch',
    data: { codes }
  }
  let list = await Http.post<DictItem[]>(option)
  list.forEach((dict) => {
    dictListMap[dict.code as codeType] = dict.list
    dictObjMap[dict.code as codeType] = dict.list.reduce(
      (obj, item) => {
        obj[item.code] = item
        return obj
      },
      {} as Record<string, DictItem>
    )
  })
  setStorage(DICT_LIST_KEY, dictListMap)
  setStorage(DICT_OBJ_KEY, dictObjMap)
}

/**
 * 获取字典数组
 * {'GENDER': [ {code: '20', name: '男'}, {code: '10', name: '女'}]}
 */
export let useDictList = (code: codeType) => {
  return dictListMap[code]
}

/**
 * 获取字典键值对结构
 * {'GENDER': { '20': {code: '20', name: '男'}, '10': {code: '10', name: '女'} } }
 */
export let useDictMap = (code: codeType) => {
  return dictObjMap[code]
}
