export interface IPacketForm {
  id: number
  babyId?: number | string
  name: string
  callName: string
  recordTime: string
  amount: number
  type: string
}
export interface IPacketFormState {
  form: IPacketForm
}
