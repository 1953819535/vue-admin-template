import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/modules/auth'
import { useRouteStore } from '@/stores/modules/route'

/** 常量路由（无需登录验证的路径） */
const WHITE_LIST = ['/login', '/403', '/404']

/**
 * 设置路由守卫
 */
export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()
    const routeStore = useRouteStore()

    // 白名单路由直接放行
    if (WHITE_LIST.includes(to.path) || to.meta.constant) {
      next()
      return
    }

    // 检查登录状态
    if (!authStore.isLogin) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }

    // 初始化用户信息（首次访问或刷新后）
    if (!routeStore.isInitialized) {
      try {
        await authStore.fetchUserInfo()
        routeStore.initRoutes()
      } catch (error) {
        console.error('获取用户信息失败:', error)
        authStore.logout()
        next({ path: '/login', query: { redirect: to.fullPath } })
        return
      }
    }

    // 检查路由权限
    if (!authStore.hasAccess({ roles: to.meta.roles, permissions: to.meta.permissions })) {
      next({ path: '/403' })
      return
    }

    next()
  })
}