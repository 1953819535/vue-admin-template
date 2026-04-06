/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId: number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 头像 */
  avatar?: string
  /** 邮箱 */
  email?: string
  /** 手机号 */
  phone?: string
  /** 角色标识列表 */
  roles: string[]
  /** 权限标识列表 */
  permissions: string[]
}

/** 登录参数 */
export interface LoginParams {
  username: string
  password: string
  /** 验证码 */
  captcha?: string
  /** 验证码key */
  captchaKey?: string
}

/** 登录响应 */
export interface LoginToken {
  /** 访问令牌 */
  accessToken: string
  /** 刷新令牌 */
  refreshToken?: string
  /** 过期时间(秒) */
  expiresIn?: number
}

/** 菜单项 */
export interface MenuItem {
  /** 路由路径 */
  path: string
  /** 菜单标题 */
  title: string
  /** 图标 */
  icon?: string
  /** 排序 */
  order?: number
  /** 是否隐藏 */
  hideInMenu?: boolean
  /** 子菜单 */
  children?: MenuItem[]
}