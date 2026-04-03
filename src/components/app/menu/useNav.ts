import { useRoute } from 'vue-router'
import type { RouteLocationRaw, RouteLocationPathRaw } from 'vue-router'
import type { NavGroup } from './types'

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