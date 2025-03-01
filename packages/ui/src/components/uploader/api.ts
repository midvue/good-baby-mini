import { useHttp } from '@mid-vue/http-client'
import { type IUploadQuery } from './types'

/**
 * 图片上传
 */
export const apiUploadImg = (data: IUploadQuery) => {
  const option = {
    url: 'mid-vue.cargo.fileManagement.uploadImg',
    data
  }
  return useHttp<Required<IUploadQuery>>(option)
}

/**
 * 图片删除
 */
export const apiDeleteImg = (data: IUploadQuery) => {
  const option = {
    url: 'mid-vue.cargo.fileManagement.deleteImg',
    data
  }
  return useHttp(option)
}
