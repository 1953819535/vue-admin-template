<script setup lang="ts">
/**
 * PaginationBar 交互式示例
 */
import type { AcceptableValue } from "reka-ui";
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 分页状态
const page = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 配置项
const showTotal = ref(true);
const showSizeChanger = ref(true);

// 模拟数据变化
const pageSizes = [10, 20, 50, 100];

function handleChange(newPage: number, newPageSize: number) {
  console.log("页码:", newPage, "每页条数:", newPageSize);
}

// 更新总数（演示用）
function updateTotal(newTotal: number) {
  total.value = newTotal;
  // 重置到第一页
  page.value = 1;
}

function handlePageSizeChange(value: AcceptableValue) {
  pageSize.value = Number(value);
}

function handleTotalChange(value: AcceptableValue) {
  updateTotal(Number(value));
}
</script>

<route lang="yaml">
meta:
  layout: default
  title: PaginationBar 示例
  menuTitle: PaginationBar
  menuIcon: lucide:grip-horizontal
  menuGroup: 组件示例
  menuGroupIcon: lucide:component
  menuOrder: 21
</route>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">PaginationBar 分页条</h1>
        <p class="text-muted-foreground mt-1.5">
          基于 shadcn-vue Pagination 封装的分页组件
        </p>
      </div>
      <Badge variant="secondary" class="shrink-0">
        <Icon icon="lucide:sparkles" class="size-3.5 mr-1" />
        交互式配置
      </Badge>
    </div>

    <!-- 配置面板 -->
    <Card>
      <CardHeader class="pb-4">
        <CardTitle class="text-base">配置选项</CardTitle>
        <CardDescription>实时调整分页参数，查看效果变化</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- 分页参数 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:settings-2" class="size-4" />
              分页参数
            </h4>

            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <Label class="w-20 text-muted-foreground">当前页</Label>
                <input
                  type="number"
                  v-model.number="page"
                  min="1"
                  :max="Math.ceil(total / pageSize)"
                  class="w-20 h-8 px-2 border rounded-md text-sm"
                />
              </div>

              <div class="flex items-center gap-3">
                <Label class="w-20 text-muted-foreground">每页条数</Label>
                <Select :model-value="String(pageSize)" @update:model-value="handlePageSizeChange">
                  <SelectTrigger class="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem v-for="size in pageSizes" :key="size" :value="String(size)">
                      {{ size }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div class="flex items-center gap-3">
                <Label class="w-20 text-muted-foreground">总条数</Label>
                <Select :model-value="String(total)" @update:model-value="handleTotalChange">
                  <SelectTrigger class="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                    <SelectItem value="500">500</SelectItem>
                    <SelectItem value="1000">1000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <!-- 显示选项 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:eye" class="size-4" />
              显示选项
            </h4>

            <div class="space-y-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="showTotal" />
                <span class="text-sm">显示总条数</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <Checkbox v-model="showSizeChanger" />
                <span class="text-sm">显示每页条数切换</span>
              </label>
            </div>
          </div>

          <!-- 当前状态 -->
          <div class="space-y-4">
            <h4 class="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon icon="lucide:info" class="size-4" />
              当前状态
            </h4>

            <div class="p-3 bg-muted/50 rounded-lg border text-sm space-y-2">
              <div class="flex justify-between">
                <span class="text-muted-foreground">当前页:</span>
                <span class="font-medium">{{ page }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">每页条数:</span>
                <span class="font-medium">{{ pageSize }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">总页数:</span>
                <span class="font-medium">{{ Math.ceil(total / pageSize) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-muted-foreground">总条数:</span>
                <span class="font-medium">{{ total }}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 分页组件展示 -->
    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-base">示例</CardTitle>
      </CardHeader>
      <CardContent>
        <PaginationBar
          :page="page"
          :page-size="pageSize"
          :total="total"
          :show-total="showTotal"
          :show-size-changer="showSizeChanger"
          @update:page="page = $event"
          @update:page-size="pageSize = $event"
          @change="handleChange"
        />
      </CardContent>
    </Card>

    <!-- 不同风格 -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">不同场景</CardTitle>
        <CardDescription>不同数据量的分页展示</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- 少量数据 -->
        <div class="space-y-2">
          <div class="text-sm text-muted-foreground">少量数据 (35条)</div>
          <PaginationBar
            :page="1"
            :page-size="10"
            :total="35"
            @update:page="(p: number) => console.log('少量数据页码:', p)"
          />
        </div>

        <!-- 中等数据 -->
        <div class="space-y-2">
          <div class="text-sm text-muted-foreground">中等数据 (200条)</div>
          <PaginationBar
            :page="5"
            :page-size="20"
            :total="200"
            @update:page="(p: number) => console.log('中等数据页码:', p)"
          />
        </div>

        <!-- 大量数据 -->
        <div class="space-y-2">
          <div class="text-sm text-muted-foreground">大量数据 (1000条)</div>
          <PaginationBar
            :page="25"
            :page-size="20"
            :total="1000"
            @update:page="(p: number) => console.log('大量数据页码:', p)"
          />
        </div>

        <!-- 简洁模式 -->
        <div class="space-y-2">
          <div class="text-sm text-muted-foreground">简洁模式 (不显示总数和切换器)</div>
          <PaginationBar
            :page="3"
            :page-size="10"
            :total="50"
            :show-total="false"
            :show-size-changer="false"
            @update:page="(p: number) => console.log('简洁模式页码:', p)"
          />
        </div>
      </CardContent>
    </Card>

    <!-- 代码示例 -->
    <Card>
      <CardHeader class="pb-3">
        <CardTitle class="text-base">使用示例</CardTitle>
      </CardHeader>
      <CardContent>
        <pre class="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto border"><code>&lt;PaginationBar
  v-model:page="page"
  v-model:page-size="pageSize"
  :total="total"
  :show-total="true"
  :show-size-changer="true"
  @change="handleChange"
/&gt;</code></pre>
      </CardContent>
    </Card>
  </div>
</template>