declare module 'watermark-plus' {
  export interface WatermarkOptions {
    /** 文本水印内容 */
    content?: string
    /** 图片水印 */
    image?: string
    /** 第二列文本水印文本 */
    tip?: string
    /** 水印图片宽度 */
    imageWidth?: string | number
    /** 水印图片高度 */
    imageHeight?: string | number
    /** 字体粗细 */
    fontWeight?: string | number
    /** 字体大小 (px) */
    fontSize?: string | number
    /** 字体 */
    fontFamily?: string
    /** 水印文本颜色 */
    color?: string
    /** 水印文本透明度 0~1 */
    alpha?: string | number
    /** 单个水印宽度 (px) */
    width?: string | number
    /** 单个水印高度 (px) */
    height?: string | number
    /** 单个水印最大宽度 (px) */
    maxWidth?: string | number
    /** 单个水印最大高度 (px) */
    maxHeight?: string | number
    /** 水印旋转角度 */
    rotate?: string | number
    /** z-index */
    zIndex?: string | number
    /** 水印创建成功回调 */
    onSuccess?: () => void
    /** 水印被破坏消失后的回调 */
    onWatermarkNull?: () => void
  }

  export default class Watermark {
    constructor(options: WatermarkOptions)
    /** 创建水印 */
    create(): void
    /** 销毁水印 */
    destroy(): void
  }
}