import { type EnumListType } from './dict'
import type Taro from '@tarojs/taro'

export interface TFileType {
  size: number
  type?: string
  fileType?: string
  originalFileObj?: any
  tempFilePath?: string
  thumbTempFilePath?: string
  path?: string
}

export interface IUploadQuery {
  base64Code?: string
  bizCode?: string
  bizId?: string
  fileUrl?: string
  fileId?: string
}
export interface UploaderFile extends IUploadQuery {
  name: string
  url: string | undefined
  type: string | undefined
  [key: string]: any
}

export type MediaType = keyof Taro.chooseMedia.mediaType
export type SourceType = keyof Taro.chooseMedia.sourceType
export type CameraType = keyof Taro.chooseMedia.camera

export type ListType = `${EnumListType}`
