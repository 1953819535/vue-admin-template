import type { RouteLocationRaw } from 'vue-router'

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