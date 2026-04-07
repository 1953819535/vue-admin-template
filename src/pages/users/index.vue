<script setup lang="ts">
import { ref } from 'vue'
import { SDataTable } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/composables/useAuth'

interface User {
  id: number
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
}

const { hasAuth } = useAuth()

const users = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'user', status: 'active' },
  { id: 5, name: '钱七', email: 'qianqi@example.com', role: 'admin', status: 'inactive' },
])

const loading = ref(false)

// 删除确认对话框
const deleteDialogOpen = ref(false)
const userToDelete = ref<User | null>(null)

// 列配置
const columns = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: '用户名' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
  { key: 'status', title: '状态' },
  { key: 'action', title: '操作', width: 150 },
]

function handleDeleteClick(user: User) {
  userToDelete.value = user
  deleteDialogOpen.value = true
}

function confirmDelete() {
  if (userToDelete.value) {
    console.log('删除', userToDelete.value)
    users.value = users.value.filter(u => u.id !== userToDelete.value!.id)
  }
  deleteDialogOpen.value = false
  userToDelete.value = null
}
</script>

<route lang="yaml">
meta:
  layout: default
  title: 用户管理
  menuTitle: 用户列表
  menuIcon: lucide:users
  menuGroup: 用户管理
  menuGroupIcon: lucide:users
  menuOrder: 10
  requiresAuth: true
  permissions: [users:list]
</route>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">用户管理</h2>
      <!-- 按钮级权限：新增按钮 -->
      <RouterLink v-if="hasAuth('users:add')" to="/users/create">
        <Button>
          新增用户
        </Button>
      </RouterLink>
    </div>

    <!-- 使用 DataTable -->
    <SDataTable :data="users" :columns="columns" :loading="loading">
      <!-- 角色 slot -->
      <template #cell-role="{ value }">
        <Badge :variant="value === 'admin' ? 'default' : 'secondary'">
          {{ value === 'admin' ? '管理员' : '普通用户' }}
        </Badge>
      </template>

      <!-- 状态 slot -->
      <template #cell-status="{ value }">
        <Badge
          :variant="value === 'active' ? 'default' : 'outline'"
          :class="value === 'active' ? 'bg-green-500' : ''"
        >
          {{ value === 'active' ? '启用' : '禁用' }}
        </Badge>
      </template>

      <!-- 操作 slot - 按钮级权限控制 -->
      <template #cell-action="{ row }">
        <div class="flex gap-2">
          <RouterLink :to="`/users/${row.id}`">
            <Button variant="link" size="sm">
              查看
            </Button>
          </RouterLink>
          <!-- 编辑按钮：需要 users:edit 权限 -->
          <RouterLink v-if="hasAuth('users:edit')" :to="`/users/${row.id}/edit`">
            <Button variant="link" size="sm">
              编辑
            </Button>
          </RouterLink>
          <!-- 删除按钮：需要 users:delete 权限 -->
          <Button
            v-if="hasAuth('users:delete')"
            variant="link"
            size="sm"
            class="text-destructive"
            @click="handleDeleteClick(row)"
          >
            删除
          </Button>
        </div>
      </template>
    </SDataTable>

    <!-- 删除确认对话框 -->
    <Dialog v-model:open="deleteDialogOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除用户 "{{ userToDelete?.name }}" 吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="deleteDialogOpen = false">
            取消
          </Button>
          <Button variant="destructive" @click="confirmDelete">
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 子路由渲染位置 -->
    <RouterView />
  </div>
</template>