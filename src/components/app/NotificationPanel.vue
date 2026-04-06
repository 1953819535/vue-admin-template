<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useNotificationStore } from '@/stores/modules/notification'
import { useAppStore } from '@/stores/modules/app'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { NotificationType, NotificationItem } from '@/types/notification'

const notificationStore = useNotificationStore()
const appStore = useAppStore()
const popoverOpen = ref(false)
const activeTab = ref<NotificationType | 'all'>('all')

const popoverAlign = computed(() => appStore.layout === 'sidebar' ? 'start' : 'end')

onMounted(() => {
  notificationStore.loadNotifications()
})

const displayNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notificationStore.notifications
  }
  return notificationStore.groupedNotifications[activeTab.value]
})

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return dateStr.split(' ')[0]
}

// 点击通知项
function handleClickNotification(notification: NotificationItem) {
  if (!notification.read) {
    notificationStore.markRead(notification.id)
  }
}

// 全部已读
function handleMarkAllRead() {
  notificationStore.markAllRead()
}

// 清空已读
function handleClearRead() {
  notificationStore.clearRead()
}
</script>

<template>
  <Popover v-model:open="popoverOpen">
    <PopoverTrigger as-child>
      <Button variant="ghost" size="icon" class="relative">
        <Icon icon="lucide:bell" class="size-5" />
        <!-- 未读角标 -->
        <span
          v-if="notificationStore.hasUnread"
          class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 text-[10px] font-medium bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
        >
          {{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent :align="popoverAlign" class="w-96 p-0">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-4 py-3 border-b">
        <h4 class="font-semibold">通知中心</h4>
        <div class="flex gap-2">
          <Button
            v-if="notificationStore.hasUnread"
            variant="ghost"
            size="sm"
            class="h-7 text-xs"
            @click="handleMarkAllRead"
          >
            全部已读
          </Button>
          <Button
            v-if="notificationStore.stats.unread < notificationStore.stats.total"
            variant="ghost"
            size="sm"
            class="h-7 text-xs"
            @click="handleClearRead"
          >
            清空已读
          </Button>
        </div>
      </div>

      <!-- 标签页 -->
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="w-full justify-start rounded-none border-b bg-transparent px-2 h-9">
          <TabsTrigger
            value="all"
            class="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
          >
            全部
            <Badge v-if="notificationStore.stats.total > 0" variant="secondary" class="ml-1 h-4 px-1 text-[10px]">
              {{ notificationStore.stats.total }}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            v-for="(config, type) in notificationStore.notificationTypeConfig"
            :key="type"
            :value="type"
            class="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2"
          >
            {{ config.label }}
            <Badge
              v-if="notificationStore.groupedNotifications[type]?.length > 0"
              variant="secondary"
              class="ml-1 h-4 px-1 text-[10px]"
            >
              {{ notificationStore.groupedNotifications[type].length }}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <!-- 通知列表 -->
        <TabsContent
          v-for="tab in ['all', 'system', 'todo', 'notice', 'message']"
          :key="tab"
          :value="tab"
          class="mt-0"
        >
          <ScrollArea class="h-[300px]">
            <!-- 空状态 -->
            <div
              v-if="displayNotifications.length === 0"
              class="flex flex-col items-center justify-center py-8 text-muted-foreground"
            >
              <Icon icon="lucide:bell-off" class="size-10 mb-2 opacity-50" />
              <p class="text-sm">暂无通知</p>
            </div>

            <!-- 通知项 -->
            <div v-else class="divide-y">
              <div
                v-for="notification in displayNotifications"
                :key="notification.id"
                class="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                :class="{ 'bg-muted/30': !notification.read }"
                @click="handleClickNotification(notification)"
              >
                <div class="flex gap-3">
                  <!-- 类型图标 -->
                  <div
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted"
                    :class="notificationStore.notificationTypeConfig[notification.type].color"
                  >
                    <Icon
                      :icon="notificationStore.notificationTypeConfig[notification.type].icon"
                      class="size-4"
                    />
                  </div>

                  <!-- 内容 -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span
                        class="font-medium text-sm truncate"
                        :class="{ 'font-bold': !notification.read }"
                      >
                        {{ notification.title }}
                      </span>
                      <span
                        v-if="!notification.read"
                        class="w-2 h-2 rounded-full bg-primary flex-shrink-0"
                      />
                    </div>
                    <p class="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {{ notification.content }}
                    </p>
                    <span class="text-[10px] text-muted-foreground/70 mt-1 block">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <!-- 底部 -->
      <div class="border-t px-4 py-2">
        <Button variant="link" size="sm" class="w-full h-7 text-xs text-muted-foreground">
          查看全部通知
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>