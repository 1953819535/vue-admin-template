import type { RouteMeta, RouteLocationRaw } from 'vue-router'

// Types - 在此定义避免循环依赖
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

interface InternalItem extends NavItem {
  order: number
}

interface InternalGroup {
  title: string
  icon?: string
  order: number
  items: InternalItem[]
}

const DEFAULT_ORDER = 999

/** 转换为 NavItem（移除内部字段） */
const toItem = (item: InternalItem): NavItem => ({
  title: item.title,
  to: item.to,
  icon: item.icon,
  indent: item.indent,
  roles: item.roles,
  permissions: item.permissions,
})

/** 扁平化路由类型（vue-router/auto-routes 生成的结构） */
interface FlatRoute {
  path: string
  name?: string | symbol
  meta?: RouteMeta
  redirect?: string | object
  children?: FlatRoute[]
}

/**
 * 从扁平化路由生成菜单
 * @param routes vue-router/auto-routes 生成的原始路由
 */
export function generateMenus(routes: FlatRoute[]): NavProps {
  const items: InternalItem[] = []
  const groupsMap = new Map<string, InternalGroup>()

  // 递归处理路由
  function processRoute(route: FlatRoute, parentPath: string) {
    const meta = route.meta
    // 拼接完整路径
    const fullPath = route.path === '' ? parentPath : route.path.startsWith('/') ? route.path : `${parentPath}/${route.path}`

    // 有效路由：有 name 和 meta
    if (route.name && meta) {
      const menuTitle = meta.menuTitle || meta.title

      // 跳过隐藏菜单、无标题、动态路由、重定向路由
      if (!meta.menuHidden && menuTitle && !fullPath.includes('[') && !route.redirect) {
        const menuItem: InternalItem = {
          title: menuTitle,
          to: fullPath,
          icon: meta.menuIcon,
          indent: meta.menuIndent,
          order: meta.menuOrder ?? DEFAULT_ORDER,
          roles: meta.roles,
          permissions: meta.permissions,
        }

        if (meta.menuGroup) {
          const group = groupsMap.get(meta.menuGroup)
          if (group) {
            group.items.push(menuItem)
            group.order = Math.min(group.order, menuItem.order)
            if (meta.menuGroupIcon && !group.icon) group.icon = meta.menuGroupIcon
          } else {
            groupsMap.set(meta.menuGroup, {
              title: meta.menuGroup,
              icon: meta.menuGroupIcon,
              order: menuItem.order,
              items: [menuItem],
            })
          }
        } else {
          items.push(menuItem)
        }
      }
    }

    // 递归处理子路由
    if (route.children) {
      for (const child of route.children) {
        processRoute(child, fullPath)
      }
    }
  }

  for (const route of routes) {
    processRoute(route, '')
  }

  const groups = Array.from(groupsMap.values())
    .sort((a, b) => a.order - b.order)
    .map((g) => ({
      title: g.title,
      icon: g.icon,
      items: g.items.sort((a, b) => a.order - b.order).map(toItem),
    }))

  return {
    items: items.sort((a, b) => a.order - b.order).map(toItem),
    groups,
  }
}
