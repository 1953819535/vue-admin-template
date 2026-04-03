import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import type { NavGroup } from './types'

export function useNavActive() {
  const route = useRoute()

  function isActive(to: RouteLocationRaw) {
    const path = typeof to === 'string' ? to : (to as any).path
    return route.path === path
  }

  function isGroupActive(group: NavGroup) {
    return group.items.some(item => isActive(item.to))
  }

  return { isActive, isGroupActive }
}