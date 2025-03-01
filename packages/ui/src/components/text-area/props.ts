export const textAreaProps = {
  modelValue: {
    type: [String, Number],
    required: true,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showWordLimit: {
    type: Boolean,
    default: false
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number,
    default: -1
  },
  placeholder: {
    type: String,
    default: ''
  },
  autoHeight: {
    type: Boolean,
    default: false
  },
  resize: String
}
