<script setup lang="ts">
import { ref } from 'vue'
import { SDataTable } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const logs = ref([
  { id: 1, time: '2024-12-20 14:30:22', user: '张三', action: '登录系统', ip: '192.168.1.100' },
  { id: 2, time: '2024-12-20 14:25:10', user: '李四', action: '修改用户信息', ip: '192.168.1.101' },
  { id: 3, time: '2024-12-20 14:20:05', user: '管理员', action: '系统配置更新', ip: '192.168.1.1' },
  { id: 4, time: '2024-12-20 14:15:33', user: '张三', action: '查看用户列表', ip: '192.168.1.100' },
  { id: 5, time: '2024-12-20 14:10:00', user: '王五', action: '登录失败', ip: '192.168.1.102' },
])

const searchUser = ref('')
const searchDate = ref('')
const currentPage = ref(1)

// 列配置
const columns = [
  { key: 'time', title: '时间' },
  { key: 'user', title: '用户' },
  { key: 'action', title: '操作' },
  { key: 'ip', title: 'IP 地址' },
]
</script>

<route lang="yaml">
meta:
  layout: default
  title: 操作日志
  menuIcon: lucide:file-text
  menuGroup: 系统设置
  menuOrder: 32
  menuIndent: true
  requiresAuth: true
  roles: [admin]
  permissions: [system:logs]
</route>

<template>
  <Card>
    <CardHeader>
      <CardTitle>操作日志</CardTitle>
    </CardHeader>
    <CardContent>
      <!-- 搜索区域 -->
      <div class="mb-4 flex flex-wrap items-end gap-4">
        <div class="space-y-2">
          <Label for="searchUser">搜索用户</Label>
          <Input
            id="searchUser"
            v-model="searchUser"
            placeholder="输入用户名..."
            class="w-48"
          />
        </div>
        <div class="space-y-2">
          <Label for="searchDate">日期</Label>
          <Input
            id="searchDate"
            v-model="searchDate"
            type="date"
            class="w-40"
          />
        </div>
        <Button variant="secondary">
          查询
        </Button>
      </div>

      <!-- 数据表格 -->
      <SDataTable :data="logs" :columns="columns" />

      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center text-sm text-muted-foreground">
        <span>共 {{ logs.length }} 条记录</span>
        <Pagination v-model:page="currentPage" :total="5" :items-per-page="10" :sibling-count="1" show-edges>
          <PaginationContent v-slot="{ items }">
            <PaginationFirst />
            <PaginationPrevious />
            <template v-for="item in items">
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                as-child
              >
                <Button variant="outline" size="icon">
                  {{ item.value }}
                </Button>
              </PaginationItem>
              <PaginationEllipsis v-else />
            </template>
            <PaginationNext />
            <PaginationLast />
          </PaginationContent>
        </Pagination>
      </div>
    </CardContent>
  </Card>
</template>