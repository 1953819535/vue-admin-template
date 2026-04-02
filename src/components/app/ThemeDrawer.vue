<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useAppStore } from "@/stores/modules/app";
import themes from "@/themes/tweakcn-themes.json";
import Button from "@/components/ui/button/Button.vue";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import themeNamesZh from "@/themes/theme-names-zh.json";

const appStore = useAppStore();

type ThemeNamesZh = Record<string, { title: string; description: string }>;

function getTitle(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.title || name;
}

function getDescription(name: string): string {
  return (themeNamesZh as ThemeNamesZh)[name]?.description || "";
}

// 获取主题的预览颜色
function getThemePreviewColors(name: string) {
  const theme = themes.find((t) => t.name === name);
  if (!theme) return { primary: "", accent: "", background: "" };

  const light = theme.cssVars.light || {};
  const dark = theme.cssVars.dark || {};

  // 根据当前模式选择颜色
  const vars = appStore.isDark ? dark : light;

  return {
    primary: vars.primary || "",
    accent: vars.accent || vars.secondary || "",
    background: vars.background || "",
  };
}

// 定义props
const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

function handleSelect(name: string) {
  appStore.setThemeName(name);
  emit("update:open", false);
}
</script>

<template>
  <Drawer
    :open="props.open"
    @update:open="emit('update:open', $event)"
    direction="right"
  >
    <DrawerContent class="w-[400px] sm:max-w-[400px]">
      <DrawerHeader>
        <DrawerTitle class="flex items-center justify-between">
          <span>主题风格</span>
          <DrawerClose as-child>
            <Button variant="ghost" size="icon">
              <Icon icon="lucide:x" class="size-4" />
            </Button>
          </DrawerClose>
        </DrawerTitle>
      </DrawerHeader>

      <TooltipProvider>
        <div class="px-4 pb-4 overflow-y-auto">
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="theme in appStore.availableThemes"
              :key="theme.name"
              class="group relative rounded-lg border p-3 text-left transition-all hover:border-primary hover:shadow-sm"
              :class="[
                appStore.currentTheme === theme.name
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border',
              ]"
              @click="handleSelect(theme.name)"
            >
              <!-- 颜色预览条 -->
              <div
                class="mb-2 h-8 w-full rounded-md overflow-hidden"
                :style="{
                  background: getThemePreviewColors(theme.name).background,
                }"
              >
                <div
                  class="h-full flex"
                  :style="{
                    background: `linear-gradient(135deg,
                    ${getThemePreviewColors(theme.name).primary} 0%,
                    ${getThemePreviewColors(theme.name).primary} 30%,
                    ${getThemePreviewColors(theme.name).accent} 30%,
                    ${getThemePreviewColors(theme.name).accent} 60%,
                    ${getThemePreviewColors(theme.name).background} 60%
                  )`,
                  }"
                />
              </div>

              <!-- 主题信息 -->
              <div class="font-medium text-sm">{{ getTitle(theme.name) }}</div>
              <Tooltip>
                <TooltipTrigger as-child>
                  <div
                    class="text-xs text-muted-foreground line-clamp-1 cursor-default"
                  >
                    {{ getDescription(theme.name) }}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" class="max-w-50">
                  {{ getDescription(theme.name) }}
                </TooltipContent>
              </Tooltip>

              <!-- 当前选中标记 -->
              <div
                v-if="appStore.currentTheme === theme.name"
                class="absolute right-2 top-2"
              >
                <Icon icon="lucide:check" class="size-4 text-primary" />
              </div>
            </button>
          </div>
        </div>
      </TooltipProvider>
    </DrawerContent>
  </Drawer>
</template>
