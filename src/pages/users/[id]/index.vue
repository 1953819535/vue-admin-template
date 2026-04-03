<script setup lang="ts">
import { useRoute } from "vue-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const route = useRoute();
const userId = route.params.id;

// 模拟用户数据
const user = {
  id: userId,
  name: "张三",
  email: "zhangsan@example.com",
  role: "admin",
  status: "active",
  createdAt: "2024-01-15",
  lastLogin: "2024-12-20 14:30",
};
</script>

<route lang="yaml">
meta:
  layout: default
  title: 用户详情
  menuHidden: true
  requiresAuth: true
</route>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <CardTitle>用户详情</CardTitle>
        <RouterLink to="/users">
          <Button variant="ghost" size="sm">
            返回列表
          </Button>
        </RouterLink>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-sm text-muted-foreground">用户 ID</label>
          <div class="font-medium">{{ user.id }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">用户名</label>
          <div class="font-medium">{{ user.name }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">邮箱</label>
          <div class="font-medium">{{ user.email }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">角色</label>
          <div class="font-medium">{{ user.role }}</div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">状态</label>
          <div class="font-medium">
            <Badge class="bg-green-500">活跃</Badge>
          </div>
        </div>
        <div>
          <label class="text-sm text-muted-foreground">注册时间</label>
          <div class="font-medium">{{ user.createdAt }}</div>
        </div>
      </div>

      <Separator class="my-4" />

      <div class="flex gap-4">
        <RouterLink :to="`/users/${user.id}/edit`">
          <Button>编辑用户</Button>
        </RouterLink>
        <Button variant="outline">禁用账户</Button>
      </div>
    </CardContent>
  </Card>
</template>
