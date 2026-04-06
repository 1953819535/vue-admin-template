import type { RouteLocationRaw, RouteLocationPathRaw } from 'vue-router'
import { useRoute } from 'vue-router'
import routes from '~pages'
import { generateMenus } from '@/utils/menu'

// Types
export interface NavItem {
  title: string
  to: RouteLocationRaw
  icon?: string
  indent?: boolean
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

// 菜单数据
const menuConfig = generateMenus(routes)

export function useMenus() {
  return {
    items: menuConfig.items,
    groups: menuConfig.groups,
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