<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

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
  <Card>
    <CardHeader>
      <CardTitle>参数配置</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="siteName">站点名称</Label>
          <Input
            id="siteName"
            v-model="settings.siteName"
          />
        </div>

        <div class="space-y-2">
          <Label for="siteUrl">站点地址</Label>
          <Input
            id="siteUrl"
            v-model="settings.siteUrl"
          />
        </div>

        <div class="flex items-center gap-3">
          <Checkbox id="emailNotify" v-model:checked="settings.emailNotify" />
          <Label for="emailNotify">邮件通知</Label>
        </div>

        <div class="flex items-center gap-3">
          <Checkbox id="smsNotify" v-model:checked="settings.smsNotify" />
          <Label for="smsNotify">短信通知</Label>
        </div>

        <div class="space-y-2">
          <Label for="maxLoginAttempts">最大登录尝试次数</Label>
          <Input
            id="maxLoginAttempts"
            v-model="settings.maxLoginAttempts"
            type="number"
            class="w-32"
          />
        </div>

        <div class="space-y-2">
          <Label for="sessionTimeout">会话超时时间 (分钟)</Label>
          <Input
            id="sessionTimeout"
            v-model="settings.sessionTimeout"
            type="number"
            class="w-32"
          />
        </div>

        <div class="pt-4">
          <Button>
            保存配置
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>