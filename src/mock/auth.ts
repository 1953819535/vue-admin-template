import type { UserInfo, LoginParams, LoginToken } from '@/types/auth'
import { delay } from './utils'

// 模拟用户数据库
const MOCK_USERS: Record<string, { password: string; userInfo: UserInfo }> = {
  admin: {
    password: 'admin123',
    userInfo: {
      userId: 1,
      username: 'admin',
      nickname: '超级管理员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      email: 'admin@example.com',
      phone: '13800138000',
      roles: ['admin'],
      permissions: ['*:*:*'], // 超级管理员拥有所有权限
    },
  },
  user: {
    password: 'user123',
    userInfo: {
      userId: 2,
      username: 'user',
      nickname: '普通用户',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      email: 'user@example.com',
      phone: '13800138001',
      roles: ['user'],
      permissions: [
        'dashboard:view',
        'system:view',
        'system:settings:view',
        'users:view',
        'users:list',
      ],
    },
  },
  editor: {
    password: 'editor123',
    userInfo: {
      userId: 3,
      username: 'editor',
      nickname: '编辑员',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
      email: 'editor@example.com',
      phone: '13800138002',
      roles: ['editor'],
      permissions: [
        'dashboard:view',
        'users:view',
        'users:list',
        'users:add',
        'users:edit',
        'users:delete',
      ],
    },
  },
}

/** 登录响应（包含 token 和用户信息） */
export interface MockLoginResult extends LoginToken {
  userInfo: UserInfo
}

/**
 * 模拟登录
 * @param params 登录参数
 * @returns MockLoginResult 包含 token 和用户信息
 */
export async function mockLogin(params: LoginParams): Promise<MockLoginResult> {
  await delay(300) // 模拟网络延迟

  const user = MOCK_USERS[params.username]

  if (!user) {
    throw new Error('用户不存在')
  }

  if (user.password !== params.password) {
    throw new Error('密码错误')
  }

  // 生成模拟 token
  const accessToken = `mock_token_${params.username}_${Date.now()}`
  const refreshToken = `mock_refresh_${params.username}_${Date.now()}`

  return {
    accessToken,
    refreshToken,
    expiresIn: 7200, // 2小时
    userInfo: user.userInfo,
  }
}

/**
 * 模拟获取用户信息
 * 根据 token 解析用户信息
 * @param token 访问令牌
 * @returns UserInfo
 */
export async function mockGetUserInfo(token: string): Promise<UserInfo> {
  await delay(200) // 模拟网络延迟

  if (!token) {
    throw new Error('未登录')
  }

  // 从 token 中解析用户名（mock_token_username_timestamp）
  const parts = token.split('_')
  const username = parts[2] || 'admin'

  const user = MOCK_USERS[username]
  if (!user) {
    throw new Error('用户不存在')
  }

  return user.userInfo
}

/**
 * 模拟登出
 */
export async function mockLogout(): Promise<void> {
  await delay(100)
}

// 导出测试用户信息，方便开发调试
export const TEST_USERS = {
  admin: { username: 'admin', password: 'admin123', desc: '超级管理员 - 拥有所有权限' },
  user: { username: 'user', password: 'user123', desc: '普通用户 - 只有查看权限' },
  editor: { username: 'editor', password: 'editor123', desc: '编辑员 - 可以增删改用户' },
}