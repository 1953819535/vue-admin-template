import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { MenuItem } from '@/types/auth'

export const useRouteStore = defineStore('route', () => {
  /** 路由是否已初始化 */
  const isInitialized = ref(false)

  /** 动态添加的菜单 */
  const dynamicMenus = ref<MenuItem[]>([])

  /** 初始化路由（标记已完成） */
  function initRoutes() {
    isInitialized.value = true
  }

  /** 重置路由状态 */
  function resetRoutes() {
    isInitialized.value = false
    dynamicMenus.value = []
  }

  return {
    isInitialized,
    dynamicMenus,
    initRoutes,
    resetRoutes,
  }
})