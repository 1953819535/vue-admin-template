import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { NotificationItem, NotificationType } from '@/types/notification'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearReadNotifications,
  notificationTypeConfig,
} from '@/mock/notification'

export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref<NotificationItem[]>([])
  const isLoading = ref(false)

  // 计算属性
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const hasUnread = computed(() => unreadCount.value > 0)

  const stats = computed(() => ({
    total: notifications.value.length,
    unread: unreadCount.value,
    system: notifications.value.filter(n => n.type === 'system').length,
    todo: notifications.value.filter(n => n.type === 'todo').length,
    notice: notifications.value.filter(n => n.type === 'notice').length,
    message: notifications.value.filter(n => n.type === 'message').length,
  }))

  // 按类型分组
  const groupedNotifications = computed(() => {
    const groups: Record<NotificationType, NotificationItem[]> = {
      system: [],
      todo: [],
      notice: [],
      message: [],
    }
    notifications.value.forEach(n => {
      groups[n.type].push(n)
    })
    return groups
  })

  /** 加载通知列表 */
  async function loadNotifications() {
    isLoading.value = true
    try {
      notifications.value = await fetchNotifications()
    } finally {
      isLoading.value = false
    }
  }

  /** 标记单条已读 */
  async function markRead(id: number) {
    await markNotificationRead(id)
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  /** 标记全部已读 */
  async function markAllRead() {
    await markAllNotificationsRead()
    notifications.value.forEach(n => n.read = true)
  }

  /** 删除通知 */
  async function removeNotification(id: number) {
    await deleteNotification(id)
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  /** 清空已读通知 */
  async function clearRead() {
    await clearReadNotifications()
    notifications.value = notifications.value.filter(n => !n.read)
  }

  return {
    // 状态
    notifications,
    isLoading,
    // 计算属性
    unreadCount,
    hasUnread,
    stats,
    groupedNotifications,
    // 方法
    loadNotifications,
    markRead,
    markAllRead,
    removeNotification,
    clearRead,
    // 配置
    notificationTypeConfig,
  }
})