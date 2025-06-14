<script lang="tsx">
import { defineComponent } from 'vue'
import Taro from '@tarojs/taro'
import { SafeBottom, Image, CopyButton, Button } from '@mid-vue/taro-h5-ui'
import imgWeChat from './assets/img_chat.jpg'

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
            <div class='text-[18px]'>该小程序已迁移至</div>
            <div class='text-[24px] font-normal mt-[30px] mb-[10px]'> 奶娃星球-小飞燕</div>
          </div>
          <Button
            type='primary'
            size='medium'
            round
            class='text-[#fff]  text-[36px] bg-[#FF5D9E] rounded-[12px] px-12'
            onClick={toMiniApp}
          >
            点击跳转奶娃星球
          </Button>
          <div class='flex flex-col items-center'>
            <div class='text-[14px] mt-[20px]'>如需转移数据,可以长按添加企业微信</div>
            <div class='text-[18px] mt-[20px]'>
              或者添加微信: goodbaby_66 <CopyButton text='goodbaby_66'></CopyButton>
            </div>
            <Image
              class='w-[240px] h-[240px] mt-[30px] mb-[50px]'
              src={imgWeChat}
              show-menu-by-longpress
            ></Image>
          </div>
          <Button
            type='primary'
            size='medium'
            round
            class='text-[#fff]  text-[36px] bg-[#FF5D9E] rounded-[12px] px-12'
            onClick={toMiniApp}
          >
            点击跳转奶娃星球
          </Button>
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
