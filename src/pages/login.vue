<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuthStore } from '@/stores/modules/auth'
import { TEST_USERS } from '@/mock/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 登录加载状态
const loading = ref(false)

// 账号密码登录
const username = ref('')
const password = ref('')
const captchaCode = ref('')
const captchaText = ref('')
const captchaCanvas = ref<HTMLCanvasElement | null>(null)

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let text = ''
  for (let i = 0; i < 4; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = text
  drawCaptcha(text)
}

// 绘制验证码
const drawCaptcha = (text: string) => {
  const canvas = captchaCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  // 背景色
  ctx.fillStyle = '#f0f0f0'
  ctx.fillRect(0, 0, width, height)

  // 绘制干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * width, Math.random() * height)
    ctx.lineTo(Math.random() * width, Math.random() * height)
    ctx.stroke()
  }

  // 绘制文字
  ctx.font = 'bold 28px Arial'
  ctx.textBaseline = 'middle'
  const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12']
  for (let i = 0; i < text.length; i++) {
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    ctx.save()
    const x = 15 + i * 28
    const y = height / 2
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(text[i], 0, 0)
    ctx.restore()
  }

  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.8)`
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
}

// 手机验证码登录
const phone = ref('')
const smsCode = ref('')
const countdown = ref(0)

// 当前登录方式
const loginType = ref<'account' | 'phone' | 'qrcode'>('account')

// 发送验证码
let smsTimer: number | undefined
const sendSmsCode = () => {
  if (countdown.value > 0 || !phone.value) return
  countdown.value = 60
  smsTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(smsTimer)
      smsTimer = undefined
    }
  }, 1000)
}

onUnmounted(() => {
  if (smsTimer) {
    clearInterval(smsTimer)
    smsTimer = undefined
  }
})

const smsButtonText = computed(() => {
  return countdown.value > 0 ? `${countdown.value}s 后重发` : '获取验证码'
})

const handleLogin = async (e: Event) => {
  e.preventDefault()

  if (captchaCode.value.toLowerCase() !== captchaText.value.toLowerCase()) {
    toast.error('验证码错误')
    generateCaptcha()
    return
  }

  loading.value = true

  try {
    const success = await authStore.login({
      username: username.value,
      password: password.value,
      captcha: captchaCode.value,
    })

    if (success) {
      toast.success('登录成功')
      const redirect = route.query.redirect as string || '/dashboard'
      router.replace(redirect)
    } else {
      toast.error('登录失败，请检查用户名和密码')
      generateCaptcha()
    }
  } catch (error) {
    toast.error('登录失败，请稍后重试')
    generateCaptcha()
  } finally {
    loading.value = false
  }
}

// 快速填充测试账号
const fillTestAccount = (account: { username: string; password: string }) => {
  username.value = account.username
  password.value = account.password
  captchaCode.value = captchaText.value // 自动填充验证码
}

onMounted(() => {
  generateCaptcha()
})
</script>

<route lang="yaml">
meta:
  layout: blank
  menuHidden: true
  constant: true
</route>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="text-2xl">登录</CardTitle>
        <CardDescription>选择登录方式</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs v-model="loginType" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="account">
              账号密码
            </TabsTrigger>
            <TabsTrigger value="phone">
              手机验证码
            </TabsTrigger>
            <TabsTrigger value="qrcode">
              扫码登录
            </TabsTrigger>
          </TabsList>

          <!-- 账号密码登录 -->
          <TabsContent value="account" class="mt-4">
            <form class="space-y-4" @submit="handleLogin">
              <div class="space-y-2">
                <Label for="username">用户名</Label>
                <Input
                  id="username"
                  v-model="username"
                  type="text"
                  placeholder="请输入用户名"
                  :disabled="loading"
                />
              </div>
              <div class="space-y-2">
                <Label for="password">密码</Label>
                <Input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="请输入密码"
                  :disabled="loading"
                />
              </div>
              <div class="space-y-2">
                <Label for="captcha">验证码</Label>
                <div class="flex gap-2">
                  <Input
                    id="captcha"
                    v-model="captchaCode"
                    type="text"
                    placeholder="请输入验证码"
                    class="flex-1"
                    autocomplete="off"
                    :disabled="loading"
                  />
                  <canvas
                    ref="captchaCanvas"
                    width="120"
                    height="40"
                    class="rounded cursor-pointer hover:opacity-80 transition-opacity"
                    title="点击刷新验证码"
                    @click="generateCaptcha"
                  />
                </div>
              </div>
              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
              </Button>
            </form>

            <!-- 测试账号提示 -->
            <div class="mt-4 p-3 bg-muted/50 rounded-lg">
              <p class="text-xs text-muted-foreground mb-2">测试账号（点击快速填充）：</p>
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="(account, key) in TEST_USERS"
                  :key="key"
                  variant="outline"
                  size="sm"
                  type="button"
                  :disabled="loading"
                  @click="fillTestAccount(account)"
                >
                  {{ account.username }}
                </Button>
              </div>
            </div>
          </TabsContent>

          <!-- 手机验证码登录 -->
          <TabsContent value="phone" class="mt-4">
            <form class="space-y-4" @submit="handleLogin">
              <div class="space-y-2">
                <Label for="phone">手机号</Label>
                <Input
                  id="phone"
                  v-model="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  :disabled="loading"
                />
              </div>
              <div class="space-y-2">
                <Label for="smsCode">验证码</Label>
                <div class="flex gap-2">
                  <Input
                    id="smsCode"
                    v-model="smsCode"
                    type="text"
                    placeholder="请输入验证码"
                    class="flex-1"
                    :disabled="loading"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    :disabled="countdown > 0 || !phone || loading"
                    @click="sendSmsCode"
                  >
                    {{ smsButtonText }}
                  </Button>
                </div>
              </div>
              <Button type="submit" class="w-full" :disabled="loading">
                {{ loading ? '登录中...' : '登录' }}
              </Button>
            </form>
          </TabsContent>

          <!-- 扫码登录 -->
          <TabsContent value="qrcode" class="mt-4">
            <div class="flex flex-col items-center space-y-4">
              <!-- 二维码占位 -->
              <div class="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border">
                <div class="text-center text-muted-foreground">
                  <svg class="w-16 h-16 mx-auto mb-2 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 17v3M17 14v3M20 17v3" />
                  </svg>
                  <p class="text-sm">二维码加载中...</p>
                </div>
              </div>
              <p class="text-sm text-muted-foreground">
                请使用微信扫描二维码登录
              </p>
              <Button variant="outline" size="sm">
                刷新二维码
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <!-- 第三方登录 -->
        <div class="mt-6 pt-6 border-t">
          <p class="text-center text-sm text-muted-foreground mb-4">其他登录方式</p>
          <div class="flex justify-center gap-4">
            <Button variant="outline" size="icon" title="微信登录">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.328.328 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1 .177-.554C23.313 18.637 24 17.263 24 15.81c0-3.39-2.989-6.133-6.804-6.916-.412-.081-.835-.13-1.258-.035zm-2.594 3.056c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z"/>
              </svg>
            </Button>
            <Button variant="outline" size="icon" title="QQ登录">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.003 2c-2.265 0-6.29 1.364-6.29 7.325v1.195S3.55 14.96 3.55 17.474c0 .665.17 1.025.281 1.025.114 0 .902-.484 1.748-2.072 0 0-.18 2.197 1.904 3.967 0 0-1.77.495-1.77 1.182 0 .686 2.04 1.064 4.168 1.064 2.128 0 4.168-.378 4.168-1.064 0-.687-1.77-1.182-1.77-1.182 2.085-1.77 1.905-3.967 1.905-3.967.845 1.588 1.634 2.072 1.746 2.072.111 0 .283-.36.283-1.025 0-2.514-2.166-6.954-2.166-6.954V9.325C18.29 3.364 14.268 2 12.003 2z"/>
              </svg>
            </Button>
            <Button variant="outline" size="icon" title="钉钉登录">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.595c-.093.155-.27.24-.45.24a.496.496 0 0 1-.24-.06c-.96-.51-1.92-.93-2.94-1.2v2.79c0 .03.015.06.015.09s-.015.06-.015.09v.09c0 .03.015.06.015.09s-.015.06-.015.09v.15c0 .03.015.06.015.09s-.015.06-.015.09v.03c0 .09-.045.165-.09.24-.06.075-.135.135-.225.18-.09.045-.18.075-.27.075h-.03c-.09 0-.18-.015-.255-.06-.09-.045-.165-.105-.225-.18-.06-.075-.09-.165-.09-.27v-.03c0-.03.015-.06.015-.09s-.015-.06-.015-.09v-.15c0-.03.015-.06.015-.09s-.015-.06-.015-.09v-.09c0-.03.015-.06.015-.09s-.015-.06-.015-.09v-2.79c-1.02.27-1.98.69-2.94 1.2a.496.496 0 0 1-.24.06c-.18 0-.357-.085-.45-.24a.516.516 0 0 1 .18-.72c2.28-1.2 4.68-1.86 7.08-1.86s4.8.66 7.08 1.86c.24.12.33.42.18.72zm.27-3.51c-2.34-1.185-4.86-1.785-7.5-1.785-2.64 0-5.16.6-7.5 1.785a.516.516 0 0 1-.225.045.497.497 0 0 1-.45-.27.516.516 0 0 1 .225-.72C4.83 8.925 7.56 8.28 10.338 8.28c2.778 0 5.508.645 7.965 1.86.255.12.36.42.225.72a.497.497 0 0 1-.45.27.516.516 0 0 1-.225-.045z"/>
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>