<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const userId = route.params.id

const username = ref('张三')
const email = ref('zhangsan@example.com')
const role = ref('admin')
const status = ref('active')
</script>

<route lang="yaml">
meta:
  layout: default
  title: 编辑用户
  menuHidden: true
  requiresAuth: true
</route>

<template>
  <div class="max-w-2xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold">编辑用户 (ID: {{ userId }})</h3>
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
            />
          </div>

          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
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
            <Label for="status">状态</Label>
            <Select v-model="status">
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="pt-4 flex gap-4">
            <Button type="submit">
              保存修改
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