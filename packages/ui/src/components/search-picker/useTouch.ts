import { ref } from 'vue'

const MIN_DISTANCE = 10

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal'
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical'
  }
  return ''
}

export function useTouch() {
  const startX = ref(0)
  const startY = ref(0)
  const deltaX = ref(0)
  const deltaY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)
  const direction = ref('')

  const isVertical = () => direction.value === 'vertical'
  const isHorizontal = () => direction.value === 'horizontal'

  const reset = () => {
    deltaX.value = 0
    deltaY.value = 0
    offsetX.value = 0
    offsetY.value = 0
    direction.value = ''
  }

  const start = (event) => {
    reset()
    startX.value = event.touches[0].clientX
    startY.value = event.touches[0].clientY
  }

  const move = (event) => {
    const touch = event.touches[0]
    deltaX.value = touch.clientX - startX.value
    deltaY.value = touch.clientY - startY.value
    offsetX.value = Math.abs(deltaX.value)
    offsetY.value = Math.abs(deltaY.value)
    if (!direction.value) {
      direction.value = getDirection(offsetX.value, offsetY.value)
    }
  }

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  }
}
