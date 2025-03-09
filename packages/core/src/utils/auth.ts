import Taro from '@tarojs/taro'
import { type EnumEnvVersion } from '@/dict'

const USER_INFO_KEY = 'userInfo'
const USER_INFO_ID_KEY = 'userId'
const TOKEN_KEY = 'token'
const ENV_VERSION_KEY = 'envVersion'

export function isLogin() {
  return !!getToken()
}

/* ------------------用户信息--------------------- */

export function setUserInfo(user: IUserInfo) {
  setUserId(user.userId)
  return setStorage(USER_INFO_KEY, user)
}
/**
 * 获取用户信息
 */
export function getUserInfo() {
  return getStorage<IUserInfo>(USER_INFO_KEY) || ({} as IUserInfo)
}
export function clearUserInfo() {
  removeStorage(USER_INFO_KEY)
}

/* ------------------token--------------------- */
export function setUserId(userId: string) {
  setStorage(USER_INFO_ID_KEY, userId)
}

export function getUserId() {
  return getStorage<string>(USER_INFO_ID_KEY) || ''
}

export function clearUserId() {
  removeStorage(USER_INFO_ID_KEY)
}

/* ------------------token--------------------- */
export function setToken(token: string) {
  return setStorage(TOKEN_KEY, token)
}

export function getToken() {
  return getStorage<string>(TOKEN_KEY) || ''
}

export function clearToken() {
  removeStorage(TOKEN_KEY)
}

/* ------------------MetaEnv--------------------- */
let envVersion: EnumEnvVersion
export function setEnvVersion(_envVersion: EnumEnvVersion) {
  envVersion = _envVersion
  return setStorage(ENV_VERSION_KEY, _envVersion)
}

export function getEnvVersion() {
  return envVersion || getStorage<EnumEnvVersion>(ENV_VERSION_KEY)
}

export function getMetaEnv(): MetaEnvType {
  return META_ENV_MAP[getEnvVersion()] || {}
}

export function clearMetaEnv() {
  removeStorage(ENV_VERSION_KEY)
}

/* ****************************** 包装方法 ******************************* */

export function setStorage(key: string, content: Record<string, any> | string | number | boolean) {
  return Taro.setStorage({ key, data: content })
}

export function getStorage<T>(key: string) {
  try {
    return Taro.getStorageSync<T>(key)
  } catch (error) {
    console.log(error)
    return null
  }
}
export function removeStorage(key: string) {
  return Taro.removeStorage({
    key
  })
}
export function clearStorage() {
  return Taro.clearStorageSync()
}
