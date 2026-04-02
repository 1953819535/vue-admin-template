<script setup lang="ts">
import { ref } from 'vue'

const logs = ref([
  { id: 1, time: '2024-12-20 14:30:22', user: '张三', action: '登录系统', ip: '192.168.1.100' },
  { id: 2, time: '2024-12-20 14:25:10', user: '李四', action: '修改用户信息', ip: '192.168.1.101' },
  { id: 3, time: '2024-12-20 14:20:05', user: '管理员', action: '系统配置更新', ip: '192.168.1.1' },
  { id: 4, time: '2024-12-20 14:15:33', user: '张三', action: '查看用户列表', ip: '192.168.1.100' },
  { id: 5, time: '2024-12-20 14:10:00', user: '王五', action: '登录失败', ip: '192.168.1.102' },
])
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 操作日志
  requiresAuth: true
  roles: [admin]
</route>

<template>
  <div class="p-6 border rounded-lg bg-card">
    <h3 class="text-lg font-semibold mb-4">操作日志</h3>

    <div class="mb-4 flex gap-4">
      <input
        type="text"
        class="px-3 py-2 border rounded-md w-48"
        placeholder="搜索用户..."
      />
      <input
        type="date"
        class="px-3 py-2 border rounded-md"
      />
      <button class="px-4 py-2 bg-muted rounded-md hover:bg-muted/80">
        查询
      </button>
    </div>

    <table class="w-full">
      <thead class="bg-muted/50">
        <tr>
          <th class="px-4 py-3 text-left">时间</th>
          <th class="px-4 py-3 text-left">用户</th>
          <th class="px-4 py-3 text-left">操作</th>
          <th class="px-4 py-3 text-left">IP 地址</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="log in logs" :key="log.id" class="border-t hover:bg-muted/30">
          <td class="px-4 py-3 text-sm">{{ log.time }}</td>
          <td class="px-4 py-3">{{ log.user }}</td>
          <td class="px-4 py-3">{{ log.action }}</td>
          <td class="px-4 py-3 text-sm text-muted-foreground">{{ log.ip }}</td>
        </tr>
      </tbody>
    </table>

    <div class="mt-4 flex justify-between items-center text-sm text-muted-foreground">
      <span>共 5 条记录</span>
      <div class="flex gap-2">
        <button class="px-3 py-1 border rounded hover:bg-muted">上一页</button>
        <button class="px-3 py-1 border rounded hover:bg-muted">下一页</button>
      </div>
    </div>
  </div>
</template>