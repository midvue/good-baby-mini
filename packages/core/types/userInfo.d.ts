import { type EnumPayMode } from '@/dict'

declare global {
  interface IUserInfo {
    /** 用户id */
    id: string
    /** 家庭id */
    familyId: string
    /** '昵称', length: 32 }) */
    nickname: string
    /** '性别- 20:男性,10:女性', default: 10 }) */
    gender: number
    /** '头像', length: 128 }) */
    avatar: string
  }

  type BabyInfo = {
    id: number

    /** '家庭id' }) */
    familyId: number

    /** '昵称', length: 32 }) */
    nickname: string

    /** '年龄', default: 0 }) */
    age: number

    /** '体重', default: 0 }) */
    weight: number

    /** '出生日期', type: 'timestamp' }) */
    birthDate: number

    /** '出生时间' */
    birthTime: string

    /** '头像', length: 128 }) */
    avatar: string

    /** '性别- 20:男性,10:女性', default: 10 }) */
    gender: string
  }
}
export {}
