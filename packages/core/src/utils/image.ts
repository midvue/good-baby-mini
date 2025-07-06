/**
 * 根据传入的图片名称生成完整的图片 URL
 * @param imageName - 图片名称，例如 'share.jpg'
 * @returns 完整的图片 URL
 */

const baseUrl = 'https://app-1359622524.cos.ap-guangzhou.myqcloud.com/good-baby-mini/image/'

export function getFullImageUrl(imageName: string): string {
  return `${baseUrl}${imageName}`
}
