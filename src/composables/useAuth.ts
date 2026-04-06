import { useAuthStore } from '@/stores/modules/auth'

/**
 * 权限检查 Hook
 * 用于按钮级别的权限控制
 */
export function useAuth() {
  const authStore = useAuthStore()

  /**
   * 检查是否拥有指定权限
   * @param codes 权限标识，支持数组（需全部满足）
   */
  function hasAuth(codes: string | string[]): boolean {
    return authStore.hasPermission(codes)
  }

  /**
   * 检查是否拥有指定角色
   * @param roles 角色标识，支持数组（满足其一即可）
   */
  function hasRole(roles: string | string[]): boolean {
    return authStore.hasRole(roles)
  }

  return {
    hasAuth,
    hasRole,
    /** 是否已登录 */
    isLogin: authStore.isLogin,
    /** 是否超级管理员 */
    isSuperAdmin: authStore.isSuperAdmin,
    /** 当前用户角色列表 */
    roles: authStore.roles,
    /** 当前用户权限列表 */
    permissions: authStore.permissions,
  }
}