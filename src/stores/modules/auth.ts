import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo, LoginParams } from '@/types/auth'
import { mockLogin, mockGetUserInfo } from '@/mock/auth'
import { useRouteStore } from './route'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string>()
  const userInfo = ref<UserInfo>()

  // 计算属性
  const isLogin = computed(() => !!token.value)
  const roles = computed(() => userInfo.value?.roles ?? [])
  const permissions = computed(() => userInfo.value?.permissions ?? [])

  /** 是否超级管理员 */
  const isSuperAdmin = computed(() => {
    return permissions.value.includes('*:*:*') || roles.value.includes('admin')
  })

  /** 用户显示名称 */
  const displayName = computed(() => {
    return userInfo.value?.nickname || userInfo.value?.username || ''
  })

  /** 登录 */
  async function login(params: LoginParams): Promise<boolean> {
    try {
      const data = await mockLogin(params)
      token.value = data.accessToken
      userInfo.value = data.userInfo
      return true
    } catch (error) {
      console.error('登录失败:', error)
      return false
    }
  }

  /** 获取用户信息（用于页面刷新后恢复用户信息） */
  async function fetchUserInfo(): Promise<void> {
    if (!token.value) {
      throw new Error('未登录')
    }
    try {
      const data = await mockGetUserInfo(token.value)
      userInfo.value = data
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 获取用户信息失败时清除 token
      token.value = undefined
      userInfo.value = undefined
    }
  }

  /** 登出 */
  function logout() {
    token.value = undefined
    userInfo.value = undefined
    // 重置路由状态，确保重新登录时会重新初始化
    const routeStore = useRouteStore()
    routeStore.resetRoutes()
  }

  /** 检查是否拥有指定权限 */
  function hasPermission(codes: string | string[]): boolean {
    if (!isLogin.value) return false
    if (isSuperAdmin.value) return true

    const codeList = Array.isArray(codes) ? codes : [codes]
    return codeList.every(code => permissions.value.includes(code))
  }

  /** 检查是否拥有指定角色 */
  function hasRole(roleList: string | string[]): boolean {
    if (!isLogin.value) return false
    if (isSuperAdmin.value) return true

    const list = Array.isArray(roleList) ? roleList : [roleList]
    return list.some(role => roles.value.includes(role))
  }

  /** 检查是否拥有访问权限（支持角色和权限的组合检查）
   * 角色检查：满足其一即可（some）
   * 权限检查：需满足全部（every）
   */
  function hasAccess(config: { roles?: string[]; permissions?: string[] }): boolean {
    if (!isLogin.value) return false
    if (isSuperAdmin.value) return true

    // 无权限要求
    if (!config.roles?.length && !config.permissions?.length) return true

    // 角色检查（满足其一）
    if (config.roles?.length) {
      const hasRole = config.roles.some(role => roles.value.includes(role))
      if (!hasRole) return false
    }

    // 权限检查（满足全部）
    if (config.permissions?.length) {
      const hasPermission = config.permissions.every(perm => permissions.value.includes(perm))
      if (!hasPermission) return false
    }

    return true
  }

  return {
    // 状态
    token,
    userInfo,
    // 计算属性
    isLogin,
    roles,
    permissions,
    isSuperAdmin,
    displayName,
    // 方法
    login,
    fetchUserInfo,
    logout,
    hasPermission,
    hasRole,
    hasAccess,
  }
}, {
  persist: {
    pick: ['token'],
  }
})