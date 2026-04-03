import type { RouteRecordRaw, RouteMeta } from 'vue-router'

export interface MenuItem {
  title: string
  to: string
  icon?: string
  indent?: boolean
}

export interface MenuGroup {
  title: string
  icon?: string
  items: MenuItem[]
}

export interface MenuConfig {
  items: MenuItem[]
  groups: MenuGroup[]
}

interface InternalMenuItem extends MenuItem {
  order: number
}

interface InternalMenuGroup {
  title: string
  icon?: string
  order: number
  items: InternalMenuItem[]
}

/**
 * 从路由配置生成菜单结构
 */
export function generateMenus(routes: RouteRecordRaw[]): MenuConfig {
  const items: InternalMenuItem[] = []
  const groupsMap = new Map<string, InternalMenuGroup>()

  function processRoute(route: RouteRecordRaw, parentPath = '') {
    const meta = route.meta as RouteMeta | undefined
    const fullPath = route.path.startsWith('/')
      ? route.path
      : parentPath
        ? `${parentPath}/${route.path}`
        : route.path

    // 跳过隐藏菜单
    if (meta?.menuHidden) return

    // 跳过无菜单标题的
    if (!meta?.menuTitle) return

    // 跳过动态参数路由 (如 /users/[id])
    if ((fullPath.includes('[') && fullPath.includes(']'))) return

    const menuItem: InternalMenuItem = {
      title: meta.menuTitle,
      to: fullPath,
      icon: meta.menuIcon,
      indent: meta.menuIndent,
      order: meta.menuOrder ?? 999,
    }

    if (meta.menuGroup) {
      const group = groupsMap.get(meta.menuGroup)
      if (group) {
        group.items.push(menuItem)
        // 分组 order 取最小的
        if (menuItem.order < group.order) {
          group.order = menuItem.order
        }
        // 分组 icon：优先使用 menuGroupIcon，否则使用第一个有 icon 的子项
        if (meta.menuGroupIcon && !group.icon) {
          group.icon = meta.menuGroupIcon
        }
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

    // 处理子路由
    if (route.children) {
      for (const child of route.children) {
        processRoute(child, fullPath)
      }
    }
  }

  for (const route of routes) {
    processRoute(route)
  }

  // 排序
  items.sort((a, b) => a.order - b.order)

  const groups: MenuGroup[] = []
  const groupOrders = new Map<string, number>()
  for (const [title, group] of groupsMap) {
    groupOrders.set(title, group.order)
    group.items.sort((a, b) => a.order - b.order)
    groups.push({
      title,
      icon: group.icon,
      items: group.items.map(item => ({ title: item.title, to: item.to, icon: item.icon, indent: item.indent })),
    })
  }
  groups.sort((a, b) => {
    const orderA = groupOrders.get(a.title) ?? 999
    const orderB = groupOrders.get(b.title) ?? 999
    return orderA - orderB
  })

  return {
    items: items.map(item => ({ title: item.title, to: item.to, icon: item.icon, indent: item.indent })),
    groups,
  }
}