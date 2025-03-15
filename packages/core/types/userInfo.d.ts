import { type EnumPayMode } from '@/dict'

declare global {
  interface IUserInfo {
    /** 用户id */
    id: string
    /** 家庭id */
    familyId: string
  }

  type BabyInfo = {
    id: number

    /** '家庭id' }) */
    familyId: number

    /** '昵称', length: 32 }) */
    nickname: string

    /** '年龄', default: 0 }) */
    age: number

    /** '性别- 1:男性,0:女性', default: 0 }) */
    gender: number

    /** '体重', default: 0 }) */
    weight: number

    /** '出生日期', type: 'timestamp' }) */
    birthDate: number

    /** '出生时间' */
    birthTime: string

    /** '头像', length: 128 }) */
    avatar: string
  }
}
export {}
