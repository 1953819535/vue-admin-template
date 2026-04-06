<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useAppStore, type LayoutType, type ThemeMode } from '@/stores/modules/app'
import { useCustomTheme } from '@/composables/useCustomTheme'
import themes from '@/themes/tweakcn-themes.json'
import themeNamesZh from '@/themes/theme-names-zh.json'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

const appStore = useAppStore()
const customTheme = useCustomTheme()
const sheetOpen = ref(false)
const customCssInput = ref('')
const urlInput = ref('')
const themeTab = ref<'preset' | 'custom'>('preset')

// 类型定义
type ThemeNamesZh = Record<string, { title: string; description: string }>
type ThemeCssVars = { primary?: string; accent?: string; secondary?: string; background?: string }
type ThemeData = { name: string; cssVars: { light?: ThemeCssVars; dark?: ThemeCssVars } }

const themeNamesZhMap = themeNamesZh as ThemeNamesZh
const themeDataMap = new Map<string, ThemeData>(themes.map(t => [t.name, t as ThemeData]))

// 外观模式选项
const modeOptions: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: '亮色', icon: 'lucide:sun' },
  { value: 'dark', label: '暗色', icon: 'lucide:moon' },
  { value: 'system', label: '系统', icon: 'lucide:monitor' },
]

// 布局选项
const layoutOptions: { value: LayoutType; label: string; icon: string }[] = [
  { value: 'sidebar', label: '侧边栏', icon: 'lucide:panel-left' },
  { value: 'top-nav', label: '顶部导航', icon: 'lucide:layout-template' },
]

// 主题预览数据
const themePreviewData = computed(() => {
  return appStore.availableThemes.map(theme => {
    const themeData = themeDataMap.get(theme.name)
    const light = (themeData?.cssVars.light || {}) as ThemeCssVars
    const dark = (themeData?.cssVars.dark || {}) as ThemeCssVars
    const vars = appStore.isDark ? dark : light

    return {
      name: theme.name,
      title: themeNamesZhMap[theme.name]?.title || theme.name,
      description: themeNamesZhMap[theme.name]?.description || '',
      colors: {
        primary: vars.primary || '',
        accent: vars.accent || vars.secondary || '',
        background: vars.background || '',
      },
    }
  })
})

// 自定义主题预览
const customPreviewData = computed(() => {
  if (!appStore.customTheme) return null
  const vars = appStore.isDark ? appStore.customTheme.cssVars.dark : appStore.customTheme.cssVars.light
  return {
    primary: vars.primary || '',
    accent: vars.accent || vars.secondary || '',
    background: vars.background || '',
  }
})

// 打开时加载自定义主题
watch(sheetOpen, (open) => {
  if (open && customTheme.customThemeCss.value) {
    customCssInput.value = customTheme.customThemeCss.value
  }
})

function handleSelectTheme(name: string) {
  if (appStore.customTheme) {
    appStore.clearCustomTheme()
  }
  appStore.setThemeName(name)
}

async function handleApplyCustom() {
  if (!customCssInput.value.trim()) {
    customTheme.error.value = '请输入 CSS 配置'
    return
  }
  const success = customTheme.applyCustomTheme(customCssInput.value)
  if (success) {
    customCssInput.value = ''
  }
}

async function handleLoadFromUrl() {
  if (!urlInput.value.trim()) {
    customTheme.error.value = '请输入 URL'
    return
  }
  try {
    const success = await customTheme.loadFromUrl(urlInput.value)
    if (success) {
      customCssInput.value = customTheme.customThemeCss.value
    }
  } catch {
    // error 已在 useCustomTheme 中设置
  }
}

function handleClearCustom() {
  customTheme.clearCustomTheme()
  customCssInput.value = ''
  urlInput.value = ''
}
</script>

<template>
  <Sheet v-model:open="sheetOpen">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon">
        <Icon icon="lucide:settings" class="size-5" />
      </Button>
    </SheetTrigger>
    <SheetContent class="w-80 sm:w-96 p-0 flex flex-col h-full">
      <SheetHeader class="px-4 pt-4 pb-2 flex-shrink-0">
        <SheetTitle>设置</SheetTitle>
      </SheetHeader>

      <div class="flex-1 overflow-hidden px-4 pb-4">
        <ScrollArea class="h-full">
          <div class="space-y-6 pr-4">
            <!-- 外观模式 -->
            <div class="space-y-3">
              <Label class="text-sm font-medium">外观模式</Label>
              <ToggleGroup
                type="single"
                :model-value="appStore.mode"
                class="justify-start gap-2"
                @update:model-value="appStore.setMode($event as ThemeMode)"
              >
                <ToggleGroupItem
                  v-for="option in modeOptions"
                  :key="option.value"
                  :value="option.value"
                  :aria-label="option.label"
                  class="flex-1 gap-1.5 px-3"
                >
                  <Icon :icon="option.icon" class="size-4" />
                  <span class="text-xs">{{ option.label }}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <!-- 布局方式 -->
            <div class="space-y-3">
              <Label class="text-sm font-medium">布局方式</Label>
              <ToggleGroup
                type="single"
                :model-value="appStore.layout"
                class="justify-start gap-2"
                @update:model-value="appStore.setLayout($event as LayoutType)"
              >
                <ToggleGroupItem
                  v-for="option in layoutOptions"
                  :key="option.value"
                  :value="option.value"
                  :aria-label="option.label"
                  class="flex-1 gap-1.5 px-3"
                >
                  <Icon :icon="option.icon" class="size-4" />
                  <span class="text-xs">{{ option.label }}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <!-- 主题风格 -->
            <div class="space-y-3">
              <Label class="text-sm font-medium">主题风格</Label>

              <Tabs v-model="themeTab" class="w-full">
                <TabsList class="w-full">
                  <TabsTrigger value="preset" class="flex-1 text-xs">预设主题</TabsTrigger>
                  <TabsTrigger value="custom" class="flex-1 text-xs">自定义</TabsTrigger>
                </TabsList>

                <!-- 预设主题 -->
                <TabsContent value="preset" class="mt-3">
                  <!-- 当前自定义主题提示 -->
                  <div v-if="customPreviewData" class="p-2 rounded-lg border border-primary bg-muted/50 mb-3">
                    <div class="flex items-center justify-between mb-1">
                      <span class="text-xs font-medium">当前：自定义主题</span>
                      <Button variant="ghost" size="sm" class="h-6 w-6 p-0" @click="handleClearCustom">
                        <Icon icon="lucide:trash-2" class="size-3" />
                      </Button>
                    </div>
                    <div
                      class="h-6 w-full rounded overflow-hidden"
                      :style="{ background: customPreviewData.background }"
                    >
                      <div
                        class="h-full flex"
                        :style="{
                          background: `linear-gradient(135deg,
                          ${customPreviewData.primary} 0%,
                          ${customPreviewData.primary} 30%,
                          ${customPreviewData.accent} 30%,
                          ${customPreviewData.accent} 60%,
                          ${customPreviewData.background} 60%
                        )`,
                        }"
                      />
                    </div>
                  </div>

                  <!-- 预设主题列表 -->
                  <TooltipProvider>
                    <div class="grid grid-cols-3 gap-2">
                      <button
                        v-for="theme in themePreviewData"
                        :key="theme.name"
                        class="group relative rounded-lg border p-2 text-left transition-all hover:border-primary hover:shadow-sm"
                        :class="[
                          appStore.currentTheme === theme.name && !appStore.customTheme
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-border',
                        ]"
                        @click="handleSelectTheme(theme.name)"
                      >
                        <div
                          class="mb-1.5 h-6 w-full rounded overflow-hidden"
                          :style="{ background: theme.colors.background }"
                        >
                          <div
                            class="h-full flex"
                            :style="{
                              background: `linear-gradient(135deg,
                              ${theme.colors.primary} 0%,
                              ${theme.colors.primary} 35%,
                              ${theme.colors.accent} 35%,
                              ${theme.colors.accent} 70%,
                              ${theme.colors.background} 70%
                            )`,
                            }"
                          />
                        </div>
                        <div class="text-[10px] font-medium truncate">{{ theme.title }}</div>
                        <Tooltip>
                          <TooltipTrigger as-child>
                            <div class="text-[9px] text-muted-foreground truncate cursor-default">
                              {{ theme.description }}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" class="max-w-32 text-xs">
                            {{ theme.description }}
                          </TooltipContent>
                        </Tooltip>
                        <div v-if="appStore.currentTheme === theme.name && !appStore.customTheme" class="absolute right-1 top-1">
                          <Icon icon="lucide:check" class="size-3 text-primary" />
                        </div>
                      </button>
                    </div>
                  </TooltipProvider>
                </TabsContent>

                <!-- 自定义主题 -->
                <TabsContent value="custom" class="mt-3 space-y-3">
                  <div class="p-2 rounded-lg border bg-muted/30 text-xs text-muted-foreground">
                    从 <a href="https://tweakcn.com/community" target="_blank" class="text-primary hover:underline">tweakcn.com</a> 复制 CSS 或链接
                  </div>
                  <div class="flex gap-2">
                    <Input
                      v-model="urlInput"
                      placeholder="粘贴 tweakcn 链接..."
                      class="flex-1 h-8 text-xs"
                    />
                    <Button
                      size="sm"
                      class="h-8"
                      :disabled="customTheme.isLoading.value"
                      @click="handleLoadFromUrl"
                    >
                      <Icon v-if="customTheme.isLoading.value" icon="lucide:loader-2" class="size-3 animate-spin" />
                      <Icon v-else icon="lucide:download" class="size-3" />
                    </Button>
                  </div>
                  <Textarea
                    v-model="customCssInput"
                    placeholder="或直接粘贴 CSS..."
                    class="h-24 text-xs font-mono resize-none"
                  />
                  <div v-if="customTheme.error.value" class="p-2 rounded bg-destructive/10 text-destructive text-xs">
                    {{ customTheme.error.value }}
                  </div>
                  <Button size="sm" class="w-full" @click="handleApplyCustom">
                    应用自定义主题
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>
      </div>
    </SheetContent>
  </Sheet>
</template>