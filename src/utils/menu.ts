import type { RouteRecordRaw, RouteMeta } from 'vue-router'
import type { MenuItem, MenuGroup, MenuConfig } from '@/components/app/menu/types'

export type { MenuItem, MenuGroup, MenuConfig }

interface InternalItem extends MenuItem {
  order: number
}

interface InternalGroup {
  title: string
  icon?: string
  order: number
  items: InternalItem[]
}

const DEFAULT_ORDER = 999

const toItem = (item: InternalItem): MenuItem => ({
  title: item.title, to: item.to, icon: item.icon, indent: item.indent
})

export function generateMenus(routes: RouteRecordRaw[]): MenuConfig {
  const items: InternalItem[] = []
  const groupsMap = new Map<string, InternalGroup>()

  function processRoute(route: RouteRecordRaw, parentPath = '') {
    const meta = route.meta as RouteMeta | undefined
    const fullPath = route.path.startsWith('/') ? route.path
      : parentPath ? `${parentPath}/${route.path}` : route.path

    const menuTitle = meta?.menuTitle || meta?.title
    if (meta?.menuHidden || !menuTitle || fullPath.includes('[')) return

    const item: InternalItem = {
      title: menuTitle,
      to: fullPath,
      icon: meta.menuIcon,
      indent: meta.menuIndent,
      order: meta.menuOrder ?? DEFAULT_ORDER,
    }

    if (meta.menuGroup) {
      const group = groupsMap.get(meta.menuGroup)
      if (group) {
        group.items.push(item)
        group.order = Math.min(group.order, item.order)
        if (meta.menuGroupIcon && !group.icon) group.icon = meta.menuGroupIcon
      } else {
        groupsMap.set(meta.menuGroup, {
          title: meta.menuGroup,
          icon: meta.menuGroupIcon,
          order: item.order,
          items: [item],
        })
      }
    } else {
      items.push(item)
    }

    route.children?.forEach(child => processRoute(child, fullPath))
  }

  for (const route of routes) processRoute(route)

  const groups = Array.from(groupsMap.values())
    .sort((a, b) => a.order - b.order)
    .map(g => ({
      title: g.title,
      icon: g.icon,
      items: g.items.sort((a, b) => a.order - b.order).map(toItem)
    }))

  return {
    items: items.sort((a, b) => a.order - b.order).map(toItem),
    groups,
  }
}