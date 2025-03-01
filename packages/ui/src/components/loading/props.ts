export const toastProps = {
  id: String,
  msg: String,
  duration: {
    type: Number,
    default: 2000
  },
  center: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'text'
  },
  customClass: String,
  bottom: {
    type: String,
    default: '30px'
  },
  size: {
    type: [String, Number],
    default: 'base'
  },
  icon: {
    type: String
  },
  textAlignCenter: {
    type: Boolean,
    default: true
  },
  loadingRotate: {
    type: Boolean,
    default: true
  },
  bgColor: {
    type: String,
    default: ''
  },

  onClose: Function,
  unmount: Function,
  cover: {
    type: Boolean,
    default: false
  },
  coverColor: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  closeOnClickOverlay: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: false
  }
}
