import { type PropType } from 'vue'
import { type ImageProps } from '@tarojs/components'
import { EnumListType } from './dict'
import {
  type CameraType,
  type ListType,
  type MediaType,
  type SourceType,
  type UploaderFile
} from './types'

export const uploaderProps = {
  /** 已上传的文件列表 */
  modelValue: {
    type: Array as PropType<Array<UploaderFile>>,
    default: () => []
  },
  /** 禁用状态 */
  disabled: {
    type: Boolean,
    default: false
  },
  /** 是否显示删除 */
  deletable: {
    type: Boolean,
    default: true
  },
  /** 是否开启预览 */
  preview: {
    type: Boolean,
    default: true
  },
  maxSize: {
    type: Number,
    default: Number.MAX_SAFE_INTEGER
  },
  /** 最大图片数量 */
  maxCount: {
    type: Number,
    default: 5
  },
  url: {
    type: String,
    default: ''
  },
  listType: {
    type: String as PropType<ListType>,
    default: EnumListType.PICTURE
  },

  beforeDelete: {
    type: Function,
    default: () => {
      return true
    }
  },
  bizCode: String,
  bizId: String,
  onChange: { type: Function },

  mode: {
    type: String as PropType<keyof ImageProps.Mode>,
    default: 'aspectFill'
  },

  /** 支持多选 */
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  /** 文件类型 */
  mediaType: {
    type: Array as PropType<MediaType[]>,
    default: () => ['image']
  },
  /** 图片和视频选择的来源 */
  sourceType: {
    type: Array as PropType<SourceType[]>
  },
  /** 图片和视频选择的来源 */
  sizeType: {
    type: Array as PropType<Array<'original' | 'compressed'>>
  },
  camera: {
    type: String as PropType<CameraType>
  },
  maxDuration: {
    type: Number
  }
}
