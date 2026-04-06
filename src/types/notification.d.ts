/** 通知类型 */
export type NotificationType = 'system' | 'todo' | 'notice' | 'message'

/** 通知项 */
export interface NotificationItem {
  /** 通知ID */
  id: number
  /** 通知类型 */
  type: NotificationType
  /** 标题 */
  title: string
  /** 内容 */
  content: string
  /** 是否已读 */
  read: boolean
  /** 创建时间 */
  createdAt: string
  /** 额外数据（如跳转链接） */
  extra?: {
    url?: string
    [key: string]: unknown
  }
}

/** 通知统计 */
export interface NotificationStats {
  total: number
  unread: number
  system: number
  todo: number
  notice: number
  message: number
}