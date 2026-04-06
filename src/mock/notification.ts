import type { NotificationItem, NotificationType } from '@/types/notification'
import { delay } from './utils'

/** 生成模拟通知数据 */
function generateMockNotifications(): NotificationItem[] {
  const notifications: NotificationItem[] = [
    {
      id: 1,
      type: 'system',
      title: '系统更新通知',
      content: '系统将于今晚 22:00 进行维护升级，届时将暂停服务约 30 分钟，请提前保存您的工作。',
      read: false,
      createdAt: '2024-12-20 14:30:00',
    },
    {
      id: 2,
      type: 'todo',
      title: '待办任务提醒',
      content: '您有 3 个待处理的审批任务，请及时处理。',
      read: false,
      createdAt: '2024-12-20 11:20:00',
      extra: { url: '/approval' },
    },
    {
      id: 3,
      type: 'notice',
      title: '公告：年终总结会议',
      content: '公司将于 12 月 28 日召开年终总结会议，请各部门负责人准备汇报材料。',
      read: true,
      createdAt: '2024-12-19 09:00:00',
    },
    {
      id: 4,
      type: 'message',
      title: '新消息来自张三',
      content: '项目进度报告已发送至您的邮箱，请查收。',
      read: false,
      createdAt: '2024-12-19 16:45:00',
    },
    {
      id: 5,
      type: 'system',
      title: '安全提醒',
      content: '检测到您的账号在新设备上登录，如非本人操作请及时修改密码。',
      read: true,
      createdAt: '2024-12-18 20:30:00',
    },
    {
      id: 6,
      type: 'todo',
      title: '合同到期提醒',
      content: '客户「科技有限公司」的合同将于 7 天后到期，请及时跟进续签事宜。',
      read: false,
      createdAt: '2024-12-18 10:00:00',
    },
    {
      id: 7,
      type: 'notice',
      title: '假期安排通知',
      content: '元旦假期安排：12月30日至1月1日放假，共3天。请各部门做好工作交接。',
      read: false,
      createdAt: '2024-12-17 15:00:00',
    },
    {
      id: 8,
      type: 'message',
      title: '新消息来自李四',
      content: '关于下周的项目会议，我建议安排在周三下午，您看可以吗？',
      read: true,
      createdAt: '2024-12-17 11:30:00',
    },
  ]

  return notifications
}

/** 模拟通知数据 */
export const mockNotifications = generateMockNotifications()

/** 获取通知列表 */
export async function fetchNotifications(): Promise<NotificationItem[]> {
  await delay(200)
  return [...mockNotifications]
}

/** 标记通知已读 */
export async function markNotificationRead(id: number): Promise<void> {
  await delay(100)
  const notification = mockNotifications.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

/** 标记全部已读 */
export async function markAllNotificationsRead(): Promise<void> {
  await delay(100)
  mockNotifications.forEach(n => n.read = true)
}

/** 删除通知 */
export async function deleteNotification(id: number): Promise<void> {
  await delay(100)
  const index = mockNotifications.findIndex(n => n.id === id)
  if (index > -1) {
    mockNotifications.splice(index, 1)
  }
}

/** 清空已读通知 */
export async function clearReadNotifications(): Promise<void> {
  await delay(100)
  const unread = mockNotifications.filter(n => !n.read)
  mockNotifications.length = 0
  mockNotifications.push(...unread)
}

/** 通知类型配置 */
export const notificationTypeConfig: Record<NotificationType, { label: string; icon: string; color: string }> = {
  system: { label: '系统', icon: 'lucide:settings', color: 'text-blue-500' },
  todo: { label: '待办', icon: 'lucide:clipboard-check', color: 'text-orange-500' },
  notice: { label: '公告', icon: 'lucide:megaphone', color: 'text-green-500' },
  message: { label: '消息', icon: 'lucide:message-circle', color: 'text-purple-500' },
}