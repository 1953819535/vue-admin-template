<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// --- 类型定义 ---
interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: string;
}

interface Payment {
  id: number;
  status: "success" | "processing" | "failed" | "pending";
  email: string;
  amount: string;
}

// --- 模拟数据 ---
const stats: StatCard[] = [
  {
    title: "总收入",
    value: "$15,231.89",
    change: "+12.5%",
    trend: "up",
    icon: "lucide:dollar-sign",
  },
  {
    title: "订阅数",
    value: "+2,350",
    change: "+10.2%",
    trend: "up",
    icon: "lucide:users",
  },
  {
    title: "销售额",
    value: "+12,234",
    change: "+19.1%",
    trend: "up",
    icon: "lucide:shopping-cart",
  },
  {
    title: "活跃用户",
    value: "+572",
    change: "-2.1%",
    trend: "down",
    icon: "lucide:activity",
  },
];

const payments: Payment[] = [
  { id: 1, status: "success", email: "ken99@example.com", amount: "$316.00" },
  { id: 2, status: "success", email: "abe45@example.com", amount: "$242.00" },
  {
    id: 3,
    status: "processing",
    email: "monserrat44@example.com",
    amount: "$837.00",
  },
  { id: 4, status: "failed", email: "carmella@example.com", amount: "$721.00" },
  { id: 5, status: "pending", email: "jason78@example.com", amount: "$450.00" },
];

const recentSales = [
  {
    name: "Olivia Martin",
    email: "olivia@email.com",
    amount: "+$1,999.00",
    avatar: "OM",
  },
  {
    name: "Jackson Lee",
    email: "jackson@email.com",
    amount: "+$39.00",
    avatar: "JL",
  },
  {
    name: "Isabella Nguyen",
    email: "isabella@email.com",
    amount: "+$299.00",
    avatar: "IN",
  },
  {
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    avatar: "WK",
  },
];

const chartData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1500 },
  { month: "Mar", revenue: 1100 },
  { month: "Apr", revenue: 2100 },
  { month: "May", revenue: 2400 },
  { month: "Jun", revenue: 2800 },
];

// --- 状态管理 ---
const sliderValue = ref([50]);
const notificationsEnabled = ref(true);
const selectedPlan = ref("pro");
const isLoading = ref(false);

const statusVariant: Record<Payment["status"], "default" | "secondary" | "destructive" | "outline"> = {
  success: "default",
  processing: "secondary",
  failed: "destructive",
  pending: "outline",
};

const toggleLoading = () => {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 1500);
};

// 计算图表路径
const maxValue = Math.max(...chartData.map((d) => d.revenue));
const chartPath = computed(() => {
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * 100;
    const y = 100 - (d.revenue / maxValue) * 80; // 留出顶部空间
    return `${x},${y}`;
  });
  return `M ${points.join(" L ")}`;
});
</script>

<template>
  <TooltipProvider>
    <div class="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <!-- Header -->
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-3xl font-bold tracking-tight">仪表盘</h1>
          <p class="text-muted-foreground">
            欢迎回来，这是您今日的业务实时概览。
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="toggleLoading">
            <Icon icon="lucide:download" class="mr-2 h-4 w-4" />
            导出报告
          </Button>
          <Button size="sm">
            <Icon icon="lucide:plus" class="mr-2 h-4 w-4" />
            新建项目
          </Button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="stat in stats"
          :key="stat.title"
          class="transition-all hover:shadow-md"
        >
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">{{ stat.title }}</CardTitle>
            <Icon :icon="stat.icon" class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stat.value }}</div>
            <p class="text-xs mt-1 flex items-center gap-1">
              <span
                :class="
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
                "
                class="font-medium"
              >
                {{ stat.change }}
              </span>
              <span class="text-muted-foreground">较上月</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <!-- Alert -->
      <Alert
        variant="destructive"
        class="bg-destructive/5 border-destructive/20"
      >
        <Icon icon="lucide:alert-circle" class="h-4 w-4" />
        <AlertTitle>需要注意</AlertTitle>
        <AlertDescription>
          您的 Pro 订阅计划即将在 7 天后到期，请及时处理以避免业务中断。
        </AlertDescription>
      </Alert>

      <!-- Main Content Tabs -->
      <Tabs default-value="overview" class="space-y-6">
        <div class="flex items-center justify-between">
          <TabsList class="bg-muted/50">
            <TabsTrigger value="overview">业务概览</TabsTrigger>
            <TabsTrigger value="analytics">数据分析</TabsTrigger>
            <TabsTrigger value="settings">系统设置</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" class="space-y-6 outline-none">
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <!-- Revenue Chart -->
            <Card class="lg:col-span-4">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <CardTitle>收入趋势</CardTitle>
                  <Badge variant="outline" class="font-normal">近6个月</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div class="h-[240px] w-full pt-4">
                  <!-- Simplified Responsive Chart -->
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    class="h-full w-full overflow-visible"
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stop-color="hsl(var(--primary))"
                          stop-opacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stop-color="hsl(var(--primary))"
                          stop-opacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <!-- Grid Lines -->
                    <line
                      v-for="i in 5"
                      :key="i"
                      x1="0"
                      :y1="i * 20"
                      x2="100"
                      :y2="i * 20"
                      stroke="currentColor"
                      stroke-opacity="0.1"
                      stroke-width="0.5"
                    />
                    <!-- Area -->
                    <path
                      :d="`${chartPath} L 100,100 L 0,100 Z`"
                      fill="url(#chartGradient)"
                    />
                    <!-- Line -->
                    <path
                      :d="chartPath"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      stroke-width="2"
                      stroke-linejoin="round"
                    />
                    <!-- Points -->
                    <circle
                      v-for="(d, i) in chartData"
                      :key="i"
                      :cx="(i / (chartData.length - 1)) * 100"
                      :cy="100 - (d.revenue / maxValue) * 80"
                      r="1.5"
                      fill="white"
                      stroke="hsl(var(--primary))"
                      stroke-width="1"
                    />
                  </svg>
                </div>
                <div
                  class="flex justify-between mt-4 text-xs text-muted-foreground px-2"
                >
                  <span v-for="d in chartData" :key="d.month">{{
                    d.month
                  }}</span>
                </div>
              </CardContent>
            </Card>

            <!-- Recent Sales -->
            <Card class="lg:col-span-3">
              <CardHeader>
                <CardTitle>最近销售</CardTitle>
                <CardDescription>本月累计成交 265 笔</CardDescription>
              </CardHeader>
              <CardContent class="space-y-6">
                <div
                  v-for="sale in recentSales"
                  :key="sale.email"
                  class="flex items-center"
                >
                  <Avatar class="h-9 w-9">
                    <AvatarFallback>{{ sale.avatar }}</AvatarFallback>
                  </Avatar>
                  <div class="ml-4 space-y-1">
                    <p class="text-sm font-medium leading-none">
                      {{ sale.name }}
                    </p>
                    <p class="text-sm text-muted-foreground">
                      {{ sale.email }}
                    </p>
                  </div>
                  <div class="ml-auto font-medium text-emerald-600">
                    {{ sale.amount }}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Payment Table -->
          <Card>
            <CardHeader class="flex flex-row items-center justify-between">
              <div>
                <CardTitle>支付记录</CardTitle>
                <CardDescription>管理并查看您的最近交易状态。</CardDescription>
              </div>
              <Button variant="ghost" size="sm">查看全部</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-[100px]">状态</TableHead>
                    <TableHead>用户邮箱</TableHead>
                    <TableHead class="hidden md:table-cell">订单 ID</TableHead>
                    <TableHead class="text-right">金额</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="p in payments" :key="p.id">
                    <TableCell>
                      <Badge
                        :variant="statusVariant[p.status]"
                        class="capitalize"
                      >
                        {{ p.status }}
                      </Badge>
                    </TableCell>
                    <TableCell class="font-medium">{{ p.email }}</TableCell>
                    <TableCell
                      class="hidden md:table-cell text-muted-foreground"
                      >#INV-00{{ p.id }}</TableCell
                    >
                    <TableCell class="text-right">{{ p.amount }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" class="space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>核心指标进度</CardTitle>
              </CardHeader>
              <CardContent class="space-y-6">
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground"
                      >月度营收目标 ($50k)</span
                    >
                    <span class="font-medium">85%</span>
                  </div>
                  <Progress :model-value="85" class="h-2" />
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-muted-foreground">新客户增长</span>
                    <span class="font-medium">62%</span>
                  </div>
                  <Progress :model-value="62" class="h-2" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>预算分配控制</CardTitle>
              </CardHeader>
              <CardContent class="space-y-8">
                <div class="space-y-4">
                  <div class="flex justify-between">
                    <Label>基础预算百分比</Label>
                    <span class="text-sm font-mono bg-muted px-2 rounded"
                      >{{ sliderValue[0] }}%</span
                    >
                  </div>
                  <Slider v-model="sliderValue" :max="100" :step="1" />
                </div>
                <div class="flex items-center justify-between">
                  <div class="space-y-0.5">
                    <Label>自动优化</Label>
                    <p class="text-xs text-muted-foreground">
                      根据 AI 模型自动调整预算分配
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" class="space-y-6">
          <Card class="max-w-2xl">
            <CardHeader>
              <CardTitle>个人与通知偏好</CardTitle>
              <CardDescription
                >设置您接收消息的方式和账户安全配置。</CardDescription
              >
            </CardHeader>
            <CardContent class="space-y-6">
              <div class="flex items-center justify-between space-x-2">
                <Label class="flex flex-col space-y-1">
                  <span>邮件营销通知</span>
                  <span class="font-normal text-xs text-muted-foreground"
                    >接收有关产品更新和优惠的邮件。</span
                  >
                </Label>
                <Switch v-model:checked="notificationsEnabled" />
              </div>
              <Separator />
              <div class="space-y-4">
                <Label>当前订阅方案</Label>
                <RadioGroup
                  v-model="selectedPlan"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <Label
                    v-for="plan in ['free', 'pro']"
                    :key="plan"
                    :class="[
                      'flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all',
                      selectedPlan === plan
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted',
                    ]"
                  >
                    <div class="flex items-center gap-3">
                      <RadioGroupItem :value="plan" />
                      <span class="capitalize font-medium"
                        >{{ plan }} Plan</span
                      >
                    </div>
                    <span class="text-sm text-muted-foreground"
                      >{{ plan === "free" ? "$0" : "$29" }}/mo</span
                    >
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter class="bg-muted/50 border-t px-6 py-4">
              <Button :disabled="isLoading" @click="toggleLoading">
                <Icon
                  v-if="isLoading"
                  icon="lucide:loader-2"
                  class="mr-2 h-4 w-4 animate-spin"
                />
                保存所有更改
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <!-- Bottom Grid: Team & Skeletons -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Team Section -->
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-base font-semibold">项目团队</CardTitle>
            <Button variant="ghost" size="icon" class="rounded-full">
              <Icon icon="lucide:plus-circle" class="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div class="flex -space-x-2 overflow-hidden py-2">
              <Tooltip v-for="i in 4" :key="i">
                <TooltipTrigger>
                  <Avatar
                    class="inline-block border-2 border-background h-8 w-8"
                  >
                    <AvatarFallback>U{{ i }}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>团队成员 {{ i }}</TooltipContent>
              </Tooltip>
              <div
                class="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-[10px] font-medium border-2 border-background"
              >
                +12
              </div>
            </div>
            <p class="text-xs text-muted-foreground mt-4 italic">
              “当前项目共有 16 名活跃协作者”
            </p>
          </CardContent>
        </Card>

        <!-- Dynamic Content Demo -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">实时资源监控</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="isLoading" class="space-y-3">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
              <div class="flex gap-3 pt-2">
                <Skeleton class="h-10 w-10 rounded-full" />
                <div class="space-y-2">
                  <Skeleton class="h-4 w-[100px]" />
                  <Skeleton class="h-3 w-[150px]" />
                </div>
              </div>
            </div>
            <div v-else class="space-y-4 text-sm">
              <div class="flex items-center gap-4">
                <div class="bg-emerald-100 p-2 rounded-lg dark:bg-emerald-950">
                  <Icon icon="lucide:server" class="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p class="font-medium">API 服务器: 运行正常</p>
                  <p class="text-xs text-muted-foreground">响应时间: 124ms</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="bg-amber-100 p-2 rounded-lg dark:bg-amber-950">
                  <Icon icon="lucide:database" class="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p class="font-medium">数据库: 高负载</p>
                  <p class="text-xs text-muted-foreground">存储已使用 82%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Quick Links -->
        <Card>
          <CardHeader>
            <CardTitle class="text-base">快速帮助</CardTitle>
          </CardHeader>
          <CardContent class="grid grid-cols-2 gap-2">
            <Button variant="outline" class="justify-start h-auto py-3 px-3">
              <div class="flex flex-col items-start gap-1">
                <Icon icon="lucide:book-open" class="h-4 w-4" />
                <span class="text-xs">文档</span>
              </div>
            </Button>
            <Button variant="outline" class="justify-start h-auto py-3 px-3">
              <div class="flex flex-col items-start gap-1">
                <Icon icon="lucide:help-circle" class="h-4 w-4" />
                <span class="text-xs">支持</span>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </TooltipProvider>
</template>
