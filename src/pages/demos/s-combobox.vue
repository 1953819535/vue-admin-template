<script setup lang="ts">
/**
 * SCombobox 交互式示例
 */
import type { AcceptableValue } from "reka-ui";
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { SCombobox } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-vue-next";

// ========== 基础用法 ==========
const basicValue = ref<string>();
const basicOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Next.js', value: 'next' },
  { label: 'Nuxt', value: 'nuxt' },
];

// ========== 不同尺寸 ==========
const sizeValue = ref('md');
const sizeOptions = [
  { label: '小尺寸', value: 'sm' },
  { label: '默认尺寸', value: 'md' },
];

// ========== 可清空 ==========
const clearableValue = ref('vue');
const clearableOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
];

function handleClear() {
  console.log('已清空');
}

// ========== 禁用状态 ==========
const disabledValue = ref('vue');
const disabledOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
];
const disabledItemOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React (禁用)', value: 'react', disabled: true },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte (禁用)', value: 'svelte', disabled: true },
];

// ========== 分组选项 ==========
const groupValue = ref<string>();
const groupOptions = [
  { label: '北京', value: 'bj', group: '华北' },
  { label: '天津', value: 'tj', group: '华北' },
  { label: '上海', value: 'sh', group: '华东' },
  { label: '杭州', value: 'hz', group: '华东' },
  { label: '广州', value: 'gz', group: '华南' },
  { label: '深圳', value: 'sz', group: '华南' },
];

// 使用 groups 配置
const groupValue2 = ref<string>();
const cityGroups = [
  {
    label: '华北地区',
    options: [
      { label: '北京', value: 'bj' },
      { label: '天津', value: 'tj' },
    ],
  },
  {
    label: '华东地区',
    options: [
      { label: '上海', value: 'sh' },
      { label: '杭州', value: 'hz' },
      { label: '南京', value: 'nj' },
    ],
  },
  {
    label: '华南地区',
    options: [
      { label: '广州', value: 'gz' },
      { label: '深圳', value: 'sz' },
    ],
  },
];

// ========== 前缀插槽 ==========
const prefixValue = ref<string>();
const searchOptions = [
  { label: '用户管理', value: 'user' },
  { label: '角色管理', value: 'role' },
  { label: '权限管理', value: 'permission' },
];

// ========== 自定义选中项显示 ==========
const customLabelValue = ref<string>();
const statusOptions = [
  { label: '待审核', value: 'pending' },
  { label: '已通过', value: 'approved' },
  { label: '已拒绝', value: 'rejected' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};

// ========== 空状态 ==========
const emptyValue = ref<string>();
const emptyOptions: { label: string; value: string }[] = [];

// ========== 事件监听 ==========
const eventValue = ref<string>();
const eventOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' },
  { label: '选项三', value: '3' },
];
const eventLog = ref<string[]>([]);

function handleEventChange(value: AcceptableValue | undefined) {
  eventLog.value.unshift(`change: ${value ?? 'undefined'}`);
  if (eventLog.value.length > 5) eventLog.value.pop();
}

function handleEventVisibleChange(visible: boolean) {
  eventLog.value.unshift(`visible-change: ${visible}`);
  if (eventLog.value.length > 5) eventLog.value.pop();
}

function handleEventSearch(query: string) {
  eventLog.value.unshift(`search: "${query}"`);
  if (eventLog.value.length > 5) eventLog.value.pop();
}

// ========== 自定义选项插槽 ==========
const userOptionValue = ref<string>();
const userOptions = [
  { label: '张三', value: 'zhangsan', email: 'zhangsan@example.com', avatar: 'Z' },
  { label: '李四', value: 'lisi', email: 'lisi@example.com', avatar: 'L' },
  { label: '王五', value: 'wangwu', email: 'wangwu@example.com', avatar: 'W' },
];

// ========== 多选模式 ==========
const multipleValue = ref<string[]>(['vue', 'react']);
const multipleOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
];

// ========== 多选 + 清空 ==========
const multipleClearableValue = ref<string[]>([]);
const multipleClearableOptions = [
  { label: '用户管理', value: 'user' },
  { label: '角色管理', value: 'role' },
  { label: '权限管理', value: 'permission' },
  { label: '系统设置', value: 'system' },
];

// ========== 大量选项多选 ==========
const largeValue = ref<string[]>([]);
const largeOptions = Array.from({ length: 50 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: `opt-${i + 1}`,
}));

function handleSelectAll() {
  largeValue.value = largeOptions.map(o => o.value);
}

function handleClearAll() {
  largeValue.value = [];
}

// ========== 远程搜索 ==========
const remoteValue = ref<string>();
const remoteLoading = ref(false);

async function handleRemoteSearch(query: string): Promise<{ label: string; value: string }[]> {
  // 模拟远程搜索延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 模拟搜索结果
  const mockUsers = [
    { label: '张三', value: 'zhangsan' },
    { label: '张伟', value: 'zhangwei' },
    { label: '张明', value: 'zhangming' },
    { label: '李四', value: 'lisi' },
    { label: '李明', value: 'liming' },
    { label: '王五', value: 'wangwu' },
    { label: '王明', value: 'wangming' },
  ];

  if (!query) return [];

  return mockUsers.filter(user =>
    user.label.toLowerCase().includes(query.toLowerCase())
  );
}

// ========== 对象比较 (by) ==========
interface UserItem {
  id: number;
  name: string;
  email: string;
}
const userObjectValue = ref<UserItem | undefined>();
const userObjectOptions: UserItem[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
];
const userObjectSelectOptions = userObjectOptions.map(u => ({
  label: u.name,
  value: u as Record<string, any>,
}));
</script>

<route lang="yaml">
meta:
  layout: default
  title: SCombobox 示例
  menuTitle: SCombobox
  menuIcon: lucide:search
  menuGroup: 组件示例
  menuGroupIcon: lucide:component
  menuOrder: 23
  requiresAuth: true
  roles: [admin]
</route>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight">SCombobox 组合框</h1>
        <p class="text-muted-foreground mt-1.5">
          基于 shadcn-vue Command + Popover 封装的组合框组件，支持搜索、多选、远程搜索等功能
        </p>
      </div>
      <Badge variant="secondary" class="shrink-0">
        <Icon icon="lucide:sparkles" class="size-3.5 mr-1" />
        交互式配置
      </Badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 基础用法 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">基础用法</CardTitle>
          <CardDescription>可搜索的组合框，输入关键词过滤选项</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox v-model="basicValue" :options="basicOptions" placeholder="请选择框架" />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ basicValue ?? '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 不同尺寸 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">不同尺寸</CardTitle>
          <CardDescription>通过 size 属性设置尺寸</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-end gap-4">
            <div class="flex-1">
              <Label class="mb-2 block text-sm text-muted-foreground">小尺寸 (sm)</Label>
              <SCombobox v-model="sizeValue" :options="sizeOptions" size="sm" />
            </div>
            <div class="flex-1">
              <Label class="mb-2 block text-sm text-muted-foreground">默认尺寸</Label>
              <SCombobox v-model="sizeValue" :options="sizeOptions" size="default" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 可清空 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">可清空</CardTitle>
          <CardDescription>设置 clearable 属性可清空选中项</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox
            v-model="clearableValue"
            :options="clearableOptions"
            clearable
            placeholder="请选择"
            @clear="handleClear"
          />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ clearableValue ?? '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 禁用状态 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">禁用状态</CardTitle>
          <CardDescription>支持整体禁用和单项禁用</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label class="text-sm text-muted-foreground">整体禁用</Label>
            <SCombobox v-model="disabledValue" :options="disabledOptions" disabled />
          </div>
          <Separator />
          <div class="space-y-2">
            <Label class="text-sm text-muted-foreground">单项禁用</Label>
            <SCombobox v-model="basicValue" :options="disabledItemOptions" placeholder="请选择" />
          </div>
        </CardContent>
      </Card>

      <!-- 分组选项 - 使用 group 字段 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">分组选项</CardTitle>
          <CardDescription>通过 options 中的 group 字段分组</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox v-model="groupValue" :options="groupOptions" placeholder="请选择城市" />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ groupValue ?? '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 分组选项 - 使用 groups 配置 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">分组选项 (groups)</CardTitle>
          <CardDescription>通过 groups 属性配置分组</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox v-model="groupValue2" :groups="cityGroups" placeholder="请选择城市" />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ groupValue2 ?? '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 前缀插槽 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">前缀插槽</CardTitle>
          <CardDescription>使用 prefix 插槽添加前缀图标</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox v-model="prefixValue" :options="searchOptions" placeholder="搜索功能">
            <template #prefix>
              <Search class="size-4 text-muted-foreground" />
            </template>
          </SCombobox>
        </CardContent>
      </Card>

      <!-- 自定义选中项显示 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">自定义选中项</CardTitle>
          <CardDescription>使用 label 插槽自定义选中项显示</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox v-model="customLabelValue" :options="statusOptions" placeholder="请选择状态">
            <template #label="{ option }">
              <div class="flex items-center gap-2">
                <span :class="['w-2 h-2 rounded-full', statusColors[String(option.value)]]" />
                {{ option.label }}
              </div>
            </template>
          </SCombobox>
        </CardContent>
      </Card>

      <!-- 空状态 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">空状态</CardTitle>
          <CardDescription>使用 empty 插槽自定义空状态</CardDescription>
        </CardHeader>
        <CardContent>
          <SCombobox v-model="emptyValue" :options="emptyOptions" placeholder="请选择">
            <template #empty>
              <div class="py-4 text-center">
                <Search class="size-8 mx-auto mb-2 text-muted-foreground" />
                <p class="text-sm text-muted-foreground">暂无数据</p>
              </div>
            </template>
          </SCombobox>
        </CardContent>
      </Card>

      <!-- 自定义选项插槽 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">自定义选项</CardTitle>
          <CardDescription>使用 option 插槽自定义下拉列表中的选项</CardDescription>
        </CardHeader>
        <CardContent>
          <SCombobox v-model="userOptionValue" :options="userOptions" placeholder="请选择用户">
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <span class="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {{ option.avatar }}
                </span>
                <div class="flex flex-col">
                  <span class="font-medium">{{ option.label }}</span>
                  <span class="text-xs text-muted-foreground">{{ option.email }}</span>
                </div>
              </div>
            </template>
          </SCombobox>
        </CardContent>
      </Card>

      <!-- 事件监听 -->
      <Card class="lg:col-span-2">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">事件监听</CardTitle>
          <CardDescription>监听 change、visible-change、search 等事件</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SCombobox
              v-model="eventValue"
              :options="eventOptions"
              placeholder="请选择"
              @change="handleEventChange"
              @visible-change="handleEventVisibleChange"
              @search="handleEventSearch"
            />
            <div class="p-3 bg-muted/50 rounded-lg border">
              <div class="text-sm font-medium mb-2">事件日志：</div>
              <div class="space-y-1 text-xs font-mono">
                <div
                  v-for="(log, index) in eventLog"
                  :key="index"
                  class="text-muted-foreground"
                >
                  {{ log }}
                </div>
                <div v-if="eventLog.length === 0" class="text-muted-foreground">
                  暂无事件
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 远程搜索 -->
      <Card class="lg:col-span-2">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">远程搜索</CardTitle>
          <CardDescription>通过 remote-method 属性实现远程搜索，适用于大数据量场景</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox
            v-model="remoteValue"
            :remote-method="handleRemoteSearch"
            :loading="remoteLoading"
            placeholder="输入姓名搜索..."
            search-placeholder="输入关键词..."
          />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ remoteValue ?? '未选择' }}</code>
          </div>
          <div class="text-xs text-muted-foreground">
            提示：输入 "张" 或 "李" 可以搜索到模拟数据
          </div>
        </CardContent>
      </Card>

      <!-- 多选模式 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">多选模式</CardTitle>
          <CardDescription>设置 multiple 属性开启多选，以 tags 形式展示</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox
            v-model="multipleValue"
            :options="multipleOptions"
            multiple
            placeholder="请选择框架"
          />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ multipleValue.length > 0 ? multipleValue.join(', ') : '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 多选 + 清空 -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">多选 + 可清空</CardTitle>
          <CardDescription>多选模式下支持清空所有选中项</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox
            v-model="multipleClearableValue"
            :options="multipleClearableOptions"
            multiple
            clearable
            placeholder="请选择权限"
          />
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ multipleClearableValue.length > 0 ? multipleClearableValue.join(', ') : '未选择' }}</code>
          </div>
        </CardContent>
      </Card>

      <!-- 大量选项多选 -->
      <Card class="lg:col-span-2">
        <CardHeader class="pb-3">
          <CardTitle class="text-base">大量选项多选</CardTitle>
          <CardDescription>50 个选项的多选场景，支持搜索过滤</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex gap-2 mb-3">
            <Button size="sm" variant="outline" @click="handleSelectAll">全选</Button>
            <Button size="sm" variant="outline" @click="handleClearAll">清空</Button>
          </div>
          <SCombobox
            v-model="largeValue"
            :options="largeOptions"
            multiple
            clearable
            placeholder="请选择"
          />
          <div class="text-sm text-muted-foreground">
            已选: <code class="bg-muted px-1.5 py-0.5 rounded">{{ largeValue.length }} / 50</code>
          </div>
        </CardContent>
      </Card>

      <!-- 对象比较 (by) -->
      <Card>
        <CardHeader class="pb-3">
          <CardTitle class="text-base">对象比较 (by)</CardTitle>
          <CardDescription>通过 by 属性指定对象比较字段，用于比较复杂对象</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <SCombobox
            v-model="userObjectValue"
            :options="userObjectSelectOptions"
            by="id"
            placeholder="请选择用户"
          >
            <template #label="{ option }">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {{ (option.value as UserItem).name.charAt(0) }}
                </span>
                <span>{{ (option.value as UserItem).name }}</span>
              </div>
            </template>
            <template #option="{ option }">
              <div class="flex flex-col">
                <span class="font-medium">{{ (option.value as UserItem).name }}</span>
                <span class="text-xs text-muted-foreground">{{ (option.value as UserItem).email }}</span>
              </div>
            </template>
          </SCombobox>
          <div class="text-sm text-muted-foreground">
            当前值: <code class="bg-muted px-1.5 py-0.5 rounded">{{ userObjectValue ? `id=${userObjectValue.id}, name=${userObjectValue.name}` : '未选择' }}</code>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- API 文档 -->
    <Card>
      <CardHeader>
        <CardTitle class="text-base">API</CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Props -->
        <div>
          <h4 class="font-medium mb-3">Props</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">属性</th>
                  <th class="text-left py-2 pr-4">类型</th>
                  <th class="text-left py-2 pr-4">默认值</th>
                  <th class="text-left py-2">说明</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">modelValue</td>
                  <td class="py-2 pr-4"><code>AcceptableValue | AcceptableValue[]</code></td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">当前选中值（多选时为数组）</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">options</td>
                  <td class="py-2 pr-4"><code>ComboboxOption[]</code></td>
                  <td class="py-2 pr-4"><code>[]</code></td>
                  <td class="py-2">选项列表</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">groups</td>
                  <td class="py-2 pr-4"><code>ComboboxOptionGroup[]</code></td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">分组选项列表</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">placeholder</td>
                  <td class="py-2 pr-4"><code>string</code></td>
                  <td class="py-2 pr-4"><code>'请选择'</code></td>
                  <td class="py-2">占位符文本</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">searchPlaceholder</td>
                  <td class="py-2 pr-4"><code>string</code></td>
                  <td class="py-2 pr-4"><code>'搜索...'</code></td>
                  <td class="py-2">搜索框占位符</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">disabled</td>
                  <td class="py-2 pr-4"><code>boolean</code></td>
                  <td class="py-2 pr-4"><code>false</code></td>
                  <td class="py-2">是否禁用</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">clearable</td>
                  <td class="py-2 pr-4"><code>boolean</code></td>
                  <td class="py-2 pr-4"><code>false</code></td>
                  <td class="py-2">是否可清空</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">multiple</td>
                  <td class="py-2 pr-4"><code>boolean</code></td>
                  <td class="py-2 pr-4"><code>false</code></td>
                  <td class="py-2">是否多选</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">maxTags</td>
                  <td class="py-2 pr-4"><code>number</code></td>
                  <td class="py-2 pr-4"><code>3</code></td>
                  <td class="py-2">多选时最多显示的 tag 数量，超出显示 +N</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">by</td>
                  <td class="py-2 pr-4"><code>string | ((a, b) => boolean)</code></td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">对象比较字段或函数</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">remoteMethod</td>
                  <td class="py-2 pr-4"><code>(query: string) => Promise&lt;ComboboxOption[]&gt;</code></td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">远程搜索函数</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">loading</td>
                  <td class="py-2 pr-4"><code>boolean</code></td>
                  <td class="py-2 pr-4"><code>false</code></td>
                  <td class="py-2">远程搜索时是否显示 loading</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">size</td>
                  <td class="py-2 pr-4"><code>'sm' | 'default'</code></td>
                  <td class="py-2 pr-4"><code>'default'</code></td>
                  <td class="py-2">触发器尺寸</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 font-mono text-foreground">trigger-class</td>
                  <td class="py-2 pr-4"><code>string</code></td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">自定义触发器样式</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Events -->
        <div>
          <h4 class="font-medium mb-3">Events</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">事件名</th>
                  <th class="text-left py-2 pr-4">参数</th>
                  <th class="text-left py-2">说明</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">change</td>
                  <td class="py-2 pr-4"><code>value: AcceptableValue</code></td>
                  <td class="py-2">值变化时触发</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">visible-change</td>
                  <td class="py-2 pr-4"><code>visible: boolean</code></td>
                  <td class="py-2">下拉框显示/隐藏状态变化</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">search</td>
                  <td class="py-2 pr-4"><code>query: string</code></td>
                  <td class="py-2">搜索时触发（远程搜索场景）</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 font-mono text-foreground">clear</td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">清空时触发</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Slots -->
        <div>
          <h4 class="font-medium mb-3">Slots</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b">
                  <th class="text-left py-2 pr-4">插槽名</th>
                  <th class="text-left py-2 pr-4">参数</th>
                  <th class="text-left py-2">说明</th>
                </tr>
              </thead>
              <tbody class="text-muted-foreground">
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">prefix</td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">前缀图标/内容</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">label</td>
                  <td class="py-2 pr-4"><code>{ option: ComboboxOption }</code></td>
                  <td class="py-2">自定义选中项显示（单选模式）</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">tag</td>
                  <td class="py-2 pr-4"><code>{ option: ComboboxOption }</code></td>
                  <td class="py-2">自定义多选 tag 显示</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">option</td>
                  <td class="py-2 pr-4"><code>{ option: ComboboxOption }</code></td>
                  <td class="py-2">自定义下拉列表中的选项</td>
                </tr>
                <tr class="border-b">
                  <td class="py-2 pr-4 font-mono text-foreground">empty</td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">无数据时的内容</td>
                </tr>
                <tr>
                  <td class="py-2 pr-4 font-mono text-foreground">footer</td>
                  <td class="py-2 pr-4">-</td>
                  <td class="py-2">下拉框底部内容</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>