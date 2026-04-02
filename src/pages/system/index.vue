<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<route lang="yaml">
meta:
  layout: admin
  title: 系统设置
  requiresAuth: true
  roles: [admin]
</route>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">系统设置</h2>

    <Tabs default-value="info">
      <TabsList class="mb-6">
        <TabsTrigger value="info">
          基本信息
        </TabsTrigger>
        <TabsTrigger value="settings">
          参数配置
        </TabsTrigger>
        <TabsTrigger value="logs">
          操作日志
        </TabsTrigger>
      </TabsList>

      <TabsContent value="info">
        <Card>
          <CardHeader>
            <CardTitle>系统基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-muted-foreground">系统名称</label>
                <div class="font-medium">后台管理系统</div>
              </div>
              <div>
                <label class="text-sm text-muted-foreground">版本号</label>
                <div class="font-medium">v1.0.0</div>
              </div>
              <div>
                <label class="text-sm text-muted-foreground">部署环境</label>
                <div class="font-medium">生产环境</div>
              </div>
              <div>
                <label class="text-sm text-muted-foreground">运行状态</label>
                <div class="font-medium flex items-center gap-2">
                  <Badge class="bg-green-500">正常运行</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings">
        <RouterView />
      </TabsContent>

      <TabsContent value="logs">
        <RouterView />
      </TabsContent>
    </Tabs>
  </div>
</template>