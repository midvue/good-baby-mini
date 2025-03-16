import DateTimePicker from './DateTimePicker.vue'

export type MultiPickerInstance = InstanceType<typeof DateTimePicker>

export { DateTimePicker }

export default DateTimePicker

declare module 'vue' {
  interface GlobalComponents {
    MvDateTimePicker: typeof DateTimePicker
  }
}
