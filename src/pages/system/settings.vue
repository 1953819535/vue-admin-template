<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  siteName: '后台管理系统',
  siteUrl: 'https://admin.example.com',
  emailNotify: true,
  smsNotify: false,
  maxLoginAttempts: 5,
  sessionTimeout: 30,
})
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 参数配置
  requiresAuth: true
  roles: [admin]
</route>

<template>
  <div class="p-6 border rounded-lg bg-card">
    <h3 class="text-lg font-semibold mb-4">参数配置</h3>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">站点名称</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded-md"
          v-model="settings.siteName"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">站点地址</label>
        <input
          type="text"
          class="w-full px-3 py-2 border rounded-md"
          v-model="settings.siteUrl"
        />
      </div>

      <div class="flex items-center gap-4">
        <label class="text-sm font-medium">邮件通知</label>
        <input type="checkbox" v-model="settings.emailNotify" />
      </div>

      <div class="flex items-center gap-4">
        <label class="text-sm font-medium">短信通知</label>
        <input type="checkbox" v-model="settings.smsNotify" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">最大登录尝试次数</label>
        <input
          type="number"
          class="w-32 px-3 py-2 border rounded-md"
          v-model="settings.maxLoginAttempts"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">会话超时时间 (分钟)</label>
        <input
          type="number"
          class="w-32 px-3 py-2 border rounded-md"
          v-model="settings.sessionTimeout"
        />
      </div>

      <div class="pt-4">
        <button
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          保存配置
        </button>
      </div>
    </div>
  </div>
</template>