import type { RouteLocationRaw, RouteLocationPathRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import routes from '~pages'
import { generateMenus } from '@/utils/menu'
import { useAuthStore } from '@/stores/modules/auth'
import { computed } from 'vue'

// Types
export interface NavItem {
  title: string
  to: RouteLocationRaw
  icon?: string
  indent?: boolean
  roles?: string[]
  permissions?: string[]
}

export interface NavGroup {
  title: string
  icon?: string
  items: NavItem[]
}

export interface NavProps {
  groups?: NavGroup[]
  items?: NavItem[]
}

// 原始菜单数据
const rawMenuConfig = generateMenus(routes)

/** 根据权限过滤菜单 */
function filterMenusByPermission(
  menus: NavProps,
  authStore: ReturnType<typeof useAuthStore>
): NavProps {
  const filteredItems = menus.items?.filter(item => authStore.hasAccess({
    roles: item.roles,
    permissions: item.permissions,
  }))

  const filteredGroups = menus.groups?.map(group => ({
    ...group,
    items: group.items.filter(item => authStore.hasAccess({
      roles: item.roles,
      permissions: item.permissions,
    }))
  })).filter(group => group.items.length > 0)

  return {
    items: filteredItems,
    groups: filteredGroups,
  }
}

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
  if ('path' in to) return (to as RouteLocationPathRaw).path
  return ''
}

export function useNavActive() {
  const route = useRoute()

  function isActive(to: RouteLocationRaw) {
    return route.path === extractPath(to)
  }

  function isGroupActive(group: NavGroup) {
    return group.items.some(item => isActive(item.to))
  }

  return { isActive, isGroupActive }
}