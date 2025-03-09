export type IBaby = {
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
  birthTime: number

  /** '头像', length: 128 }) */
  avatar: string
}

export interface IBabyState {
  form: IBaby
}
