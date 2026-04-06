import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题 */
    title?: string
    /** 菜单标题（不设置则使用 title，若 title 也未设置则不显示在菜单中） */
    menuTitle?: string
    /** 菜单分组标题 */
    menuGroup?: string
    /** 菜单分组图标（仅需在分组第一个页面设置） */
    menuGroupIcon?: string
    /** 菜单图标 */
    menuIcon?: string
    /** 菜单排序权重 */
    menuOrder?: number
    /** 是否在菜单中隐藏 */
    menuHidden?: boolean
    /** 是否为二级菜单（缩进显示） */
    menuIndent?: boolean
    /** 布局名称 */
    layout?: string
    /** 是否需要登录 */
    requiresAuth?: boolean
    /** 允许的角色 */
    roles?: string[]
    /** 所需权限标识 */
    permissions?: string[]
    /** 常量路由（无需登录验证） */
    constant?: boolean
  }
}