import type { RouteLocationRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { generateMenus } from '@/utils/menu'
import type { NavItem, NavGroup, NavProps } from '@/utils/menu'
import { useAuthStore } from '@/stores/modules/auth'
import { computed } from 'vue'

// 重新导出类型供组件使用
export type { NavItem, NavGroup, NavProps }

/** 权限检查辅助函数 */
function hasItemPermission(item: NavItem, authStore: ReturnType<typeof useAuthStore>) {
  return authStore.hasAccess({ roles: item.roles, permissions: item.permissions })
}

/** 根据权限过滤菜单 */
function filterMenusByPermission(menus: NavProps, authStore: ReturnType<typeof useAuthStore>): NavProps {
  const filteredItems = menus.items?.filter((item: NavItem) => hasItemPermission(item, authStore))
  const filteredGroups = menus.groups
    ?.map((group: NavGroup) => ({ ...group, items: group.items.filter((item: NavItem) => hasItemPermission(item, authStore)) }))
    .filter((group: NavGroup) => group.items.length > 0)

  return { items: filteredItems, groups: filteredGroups }
}

// 静态菜单配置只计算一次（routes 是编译时确定的静态数据）
const rawMenuConfig = generateMenus(routes)

export function useMenus() {
  const authStore = useAuthStore()

  const menus = computed(() => {
    if (!authStore.isLogin) return { items: [], groups: [] }
    return filterMenusByPermission(rawMenuConfig, authStore)
  })

  return {
    items: computed(() => menus.value.items ?? []),
    groups: computed(() => menus.value.groups ?? []),
  }
}

// 路由激活判断
function extractPath(to: RouteLocationRaw): string {
  if (typeof to === 'string') return to
  return 'path' in to ? to.path ?? '' : ''
}

export function useNavActive() {
  const route = useRoute()

  const isActive = (to: RouteLocationRaw) => route.path === extractPath(to)

  const isGroupActive = (group: NavGroup) => group.items.some((item) => isActive(item.to))

  return { isActive, isGroupActive }
}
