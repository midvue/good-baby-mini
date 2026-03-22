import Http from '@allkit/http-client'
import { getStorage, setStorage } from '@/utils'

export interface DictItem {
  code: string
  name: string
  sort?: number
  ext?: string
  list: DictItem[]
}
type codeType = (typeof codes)[number]
type DictMap = Record<codeType, Omit<DictItem, 'list'>[]>
type DictObjMap = Record<codeType, Record<string, DictItem>>

let codes = [
  'GENDER',
  'FEED_TYPE',
  'MILK_TYPE',
  'DIAPER_TYPE',
  'POOP_COLOR',
  'POOP_TYPE',
  'SLEEP_TYPE',
  'SLEEP_QUALITY',
  'FOOD_TYPE',
  'FOOD_SHAPE',
  'FOOD_UNIT',
  'FOOD_DURATION',
  'FOOD_FEEDBACK',
  'FAMILY_RELATION',
  'PACKET_TYPE',
  'FAMILY_CALL'
] as const

let dictListMap = {} as DictMap
let dictObjMap = {} as DictObjMap

const DICT_LIST_KEY = 'dict_list'
const DICT_OBJ_KEY = 'dict_obj'
/**
 * 获取字典
 */
export const initDict = async () => {
  dictListMap = getStorage<DictMap>(DICT_LIST_KEY) || ({} as DictMap)
  dictObjMap = getStorage<DictObjMap>(DICT_OBJ_KEY) || ({} as DictObjMap)
  const option = {
    url: '/dict/batch',
    data: { codes }
  }
  const list = await Http.post<DictItem[]>(option)
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
export const useDictList = (code: codeType) => {
  return dictListMap[code]
}

/**
 * 获取字典键值对结构
 * {'GENDER': { '20': {code: '20', name: '男'}, '10': {code: '10', name: '女'} } }
 */
export const useDictMap = (code: codeType) => {
  return dictObjMap[code] || {}
}
