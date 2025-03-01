<template>
  <view class="mv-uploader">
    <view v-if="$slots.default" class="mv-uploader__slot">
      <slot></slot>
      <template v-if="Number(maxCount) - fileList.length">
        <mv-button class="mv-uploader__input" @click="chooseImage" />
      </template>
    </view>
    <view
      v-for="(item, index) in fileList"
      :key="item.uid"
      class="mv-uploader__preview"
      :class="[listType]"
    >
      <view
        v-if="listType === EnumListType.PICTURE && !$slots.default"
        class="mv-uploader__preview-img"
      >
        <!-- <view v-if="item.status != 'success'" class="mv-uploader__preview__progress">
          <template v-if="item.status != 'ready'">
            <mv-icon v-if="item.status == 'error'" color="#fff" />
          <Loading v-else name="loading" color="#fff" /> 
          </template>
          <view class="mv-uploader__preview__progress__msg">{{ item.message }}</view>
        </view> -->

        <view v-if="deletable" class="close" @click="onDelete(item, index)">
          <slot name="delete-icon"> <mv-icon name="close-1" /></slot>
        </view>

        <mv-image
          v-if="item.url"
          :src="item.url"
          class="mv-uploader__upload"
          :mode="mode"
          @click="fileItemClick(item)"
        />
        <!-- <view v-else class="mv-uploader__preview-img__file">
          <view class="mv-uploader__preview-img__file__name" @click="fileItemClick(item)">
            <view class="file__name_tips">{{ item.name }}</view>
          </view>
        </view>
        <view class="tips">{{ item.name }}</view> -->
      </view>

      <!-- <view v-else-if="listType === EnumListType.LIST" class="mv-uploader__preview-list">
        <view
          class="mv-uploader__preview-img__file__name"
          :class="[item.status]"
          @click="fileItemClick(item)"
        >
          <view class="file__name_tips">{{ item.name }}</view>
          <mv-icon
            name="delete"
            v-if="deletable"
            color="#808080"
            class="mv-uploader__preview-img__file__del"
            @click.stop="onDelete(item, index)"
          ></mv-icon>
        </view>
      </view> -->
    </view>

    <view
      v-if="listType === EnumListType.PICTURE && Number(maxCount) - fileList.length > 0"
      class="mv-uploader__upload border-dashed"
      :class="[listType]"
      @click="chooseImage"
    >
      <slot name="upload-icon">
        <mv-icon name="mv-icon-upload"></mv-icon>
      </slot>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import Taro, { getFileSystemManager } from '@tarojs/taro'
import Button from '../button'
import Icon from '../icon'
import Image from '../image'
import { apiDeleteImg, apiUploadImg } from './api'
import { EnumListType } from './dict'
import { uploaderProps } from './props'
import { type TFileType, type UploaderFile } from './types'

export default defineComponent({
  components: {
    mvButton: Button,
    mvIcon: Icon,
    mvImage: Image
  },
  props: uploaderProps,
  emits: [
    'start',
    'progress',
    'oversize',
    'success',
    'failure',
    'change',
    'delete',
    'fileItemClick'
  ],
  setup(props, { emit }) {
    const fileList = ref(props.modelValue as Array<UploaderFile>)

    watch(
      () => props.modelValue,
      () => {
        fileList.value = props.modelValue
      }
    )
    const disabled = computed(() => {
      return props.disabled
    })

    const chooseImage = () => {
      if (disabled.value) {
        return
      }

      if (Taro.getEnv() == 'WEB') {
        const el = document.getElementById('taroChooseImage')
        if (el) {
          el?.setAttribute('accept', props.accept)
        } else {
          const obj = document.createElement('input')
          obj.setAttribute('type', 'file')
          obj.setAttribute('id', 'taroChooseImage')
          obj.setAttribute('accept', props.accept)
          obj.setAttribute('style', 'position: fixed; top: -4000px; left: -3000px; z-index: -300;')
          document.body.appendChild(obj)
        }
      }
      if (Taro.getEnv() == 'WEAPP') {
        // chooseMedia 目前只支持微信小程序原生，其余端全部使用 chooseImage API
        Taro.chooseMedia({
          /** 最多可以选择的文件个数 */
          count: props.multiple ? Number(props.maxCount) - fileList.value.length : 1,
          /** 文件类型 */
          mediaType: props.mediaType,
          /** 图片和视频选择的来源 */
          sourceType: props.sourceType,
          /** 拍摄视频最长拍摄时间，单位秒。时间范围为 3s 至 30s 之间 */
          maxDuration: props.maxDuration,
          /** 仅对 mediaType 为 image 时有效，是否压缩所选文件 */
          sizeType: props.sizeType,
          /** 仅在 sourceType 为 camera 时生效，使用前置或后置摄像头 */
          camera: props.camera,
          /** 接口调用失败的回调函数 */
          fail: (res: TaroGeneral.CallbackResult) => {
            emit('failure', res)
          },
          /** 接口调用成功的回调函数 */
          success: onChangeMedia
        })
      } else {
        Taro.chooseImage({
          // 选择数量
          count: props.multiple ? Number(props.maxCount) - fileList.value.length : 1,
          // 可以指定是原图还是压缩图，默认二者都有
          sizeType: props.sizeType,
          sourceType: props.sourceType,
          success: onChangeImage,
          fail: (res: any) => {
            emit('failure', res)
          }
        })
      }
    }

    const onChangeMedia = (res: Taro.chooseMedia.SuccessCallbackResult) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const { tempFiles } = res
      const _files = filterFiles<Taro.chooseMedia.ChooseMedia>(tempFiles)
      readFiles(_files)
      emit('change', {
        fileList: fileList.value
      })
    }
    const onChangeImage = (res: Taro.chooseImage.SuccessCallbackResult) => {
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      const { tempFiles } = res
      const _files = filterFiles<Taro.chooseImage.ImageFile>(tempFiles)
      readFiles(_files)
      emit('change', {
        fileList: fileList.value
      })
    }

    const fileItemClick = (fileItem: UploaderFile) => {
      emit('fileItemClick', { fileItem })
      if (props.preview) {
        Taro.previewImage({
          current: fileItem.url, // 当前显示图片的http链接
          urls: fileList.value.map((item) => item.url + '')
        })
      }
    }

    const submit = () => {
      // Promise.all(uploadQueue.value).then((res) => {
      //   res.forEach((i) => i.uploadTaro(Taro.uploadFile, Taro.getEnv()))
      // })
    }

    const readFiles = <T extends TFileType>(files: T[]) => {
      for (const file of files) {
        let fileType = file.type
        const filepath = (file.tempFilePath || file.path) as string
        const fileItem = {} as UploaderFile
        if (file.fileType) {
          fileType = file.fileType
        } else {
          const imgReg = /\.(png|jpeg|jpg|webp|gif)$/i
          if (!fileType && (imgReg.test(filepath) || filepath.includes('data:image'))) {
            fileType = 'image'
          }
        }
        fileItem.path = filepath
        fileItem.name = filepath
        fileItem.type = fileType
        if (props.preview) {
          fileItem.url = fileType == 'video' ? file.thumbTempFilePath : filepath
        }
        fileList.value.push(fileItem)
        fileItem.status = 'ready'
        getFileSystemManager().readFile({
          filePath: fileItem.url!, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: (res) => {
            const imgType = fileItem.url?.includes('.') ? fileItem.url.split('.')?.[1] : 'png'
            apiUploadImg({
              bizId: props.bizId,
              bizCode: props.bizCode,
              base64Code: `data:image/${imgType};base64,` + res.data.toString()
            }).then((res) => {
              Object.assign(fileItem, res)
              fileItem.status = 'success'
              emit('success', fileItem)
            })
          }
        })
      }
    }

    const filterFiles = <T extends TFileType>(files: T[]) => {
      const maxCount = +props.maxCount
      const maxSize = +props.maxSize
      const oversizes: T[] = []
      files = files.filter((file: T) => {
        if (file.size > maxSize) {
          oversizes.push(file)
          return false
        } else {
          return true
        }
      })
      if (oversizes.length) {
        emit('oversize', oversizes)
      }
      const currentFileLength = files.length + fileList.value.length
      if (currentFileLength > maxCount) {
        files.splice(files.length - (currentFileLength - maxCount))
      }
      return files
    }

    const deleted = (file: UploaderFile, index: number) => {
      fileList.value.splice(index, 1)
      emit('delete', {
        file,
        fileList: fileList.value,
        index
      })
      emit('change', {
        fileList: fileList.value
      })
    }

    const onDelete = (file: UploaderFile, index: number) => {
      if (disabled.value) return
      apiDeleteImg({ bizCode: file.bizCode, bizId: file.bizId, fileId: file.fileId }).then(() => {
        deleted(file, index)
      })
    }

    return {
      EnumListType,
      onDelete,
      fileList,
      disabled,
      chooseImage,
      fileItemClick,
      submit
    }
  }
})
</script>

<style lang="scss">
@import './index.scss';
</style>
