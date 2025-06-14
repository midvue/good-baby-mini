<script lang="tsx">
import { defineComponent } from 'vue'
import Taro from '@tarojs/taro'
import { SafeBottom, Image, CopyButton } from '@mid-vue/taro-h5-ui'
import imgWeChat from './assets/img_we_chat.png'

export default defineComponent({
  name: 'Home',
  setup() {
    const toMiniApp = () => {
      Taro.navigateToMiniProgram({
        appId: 'wx45c4433ce635c795',
        path: 'pages/home/index',
        extraData: {
          extra: 'fromOldMiniApp'
        },
        envVersion: 'release',
        success(res: any) {
          // 打开成功
          console.log(res)
        }
      })
    }

    return () => {
      return (
        <div class='home'>
          <div class='mt-[100px] text-center' onClick={toMiniApp}>
            <div>该小程序已迁移到</div>
            <div class='text-[24px] font-normal mt-[30px]'> 奶娃星球-小飞燕</div>
          </div>
          <div
            class='text-[#fff] mt-[30px] text-[36px] bg-[#FF5D9E] rounded-[12px] px-12'
            onClick={toMiniApp}
          >
            跳转奶娃星球
          </div>
          <div class='flex flex-col items-center'>
            <div class='mt-[30px] text-[14px]'>小程序在持续迭代!数据会一直保留</div>
            <div class='text-[14px]'>如需转移数据,可以截图扫码,群里反馈</div>
            <div class='text-[14px]'>
              或者添加微信: goodbaby_66 <CopyButton text='wxid_xsy2vqbkqjoh22'></CopyButton>
            </div>
            <Image class='w-[160px] h-[280px]' src={imgWeChat}></Image>
          </div>
          <div
            class='text-[#fff] mt-[30px] text-[36px] bg-[#FF5D9E] rounded-[12px] px-12'
            onClick={toMiniApp}
          >
            跳转奶娃星球
          </div>
          <SafeBottom></SafeBottom>
        </div>
      )
    }
  }
})
</script>
<style lang="scss">
@import './index.scss';
</style>
