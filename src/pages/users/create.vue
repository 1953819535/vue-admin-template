<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const username = ref('')
const email = ref('')
const role = ref('user')
const password = ref('')
</script>

<route lang="yaml">
meta:
  layout: default
  title: 新增用户
  menuIcon: lucide:user-plus
  menuGroup: 用户管理
  menuOrder: 11
  menuIndent: true
  requiresAuth: true
  permissions: [users:add]
</route>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold">新增用户</h3>
      <Button variant="link" as-child>
        <RouterLink to="/users">
          返回列表
        </RouterLink>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>用户信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form class="space-y-4">
          <div class="space-y-2">
            <Label for="username">用户名</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="请输入用户名"
            />
          </div>

          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="请输入邮箱"
            />
          </div>

          <div class="space-y-2">
            <Label for="role">角色</Label>
            <Select v-model="role">
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">普通用户</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <Label for="password">初始密码</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入初始密码"
            />
          </div>

          <div class="pt-4 flex gap-4">
            <Button type="submit">
              创建用户
            </Button>
            <RouterLink to="/users">
              <Button variant="outline">
                取消
              </Button>
            </RouterLink>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>