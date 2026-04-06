import type { AnnouncementItem } from '@/types/announcement'
import { delay } from './utils'

/** 模拟公告数据 */
export const mockAnnouncements: AnnouncementItem[] = [
  {
    id: 1,
    title: '系统升级通知',
    content: '系统将于 2024年12月28日 22:00 进行维护升级，届时服务将暂停约 30 分钟，请提前保存工作。',
    type: 'warning',
    createdAt: '2024-12-26 10:00:00',
  },
  {
    id: 2,
    title: '新功能上线',
    content: '数据导出功能已上线，支持 Excel、CSV、PDF 多种格式导出，欢迎体验。',
    type: 'success',
    createdAt: '2024-12-25 09:00:00',
  },
  {
    id: 3,
    title: '安全提醒',
    content: '请定期修改登录密码，建议使用 8 位以上包含字母、数字、特殊字符的强密码。',
    type: 'info',
    createdAt: '2024-12-24 14:00:00',
  },
]

/** 获取公告列表 */
export async function fetchAnnouncements(): Promise<AnnouncementItem[]> {
  await delay(150)
  return mockAnnouncements
}