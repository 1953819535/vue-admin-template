/** 公告项 */
export interface AnnouncementItem {
  /** 公告ID */
  id: number
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 类型: info | warning | success | error */
  type: 'info' | 'warning' | 'success' | 'error'
  /** 创建时间 */
  createdAt: string
}