<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  options?: { value: AcceptableValue; label: string }[]
  max?: number
  placeholder?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  placeholder: '请选择',
  max: 3,
})

const emit = defineEmits<{ remove: [value: AcceptableValue] }>()

const display = computed(() => props.options.slice(0, props.max))
const remaining = computed(() => Math.max(0, props.options.length - props.max))

// 选项 key（防止对象值变成 "[object Object]"）
function getKey(value: AcceptableValue): string {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value)
  }
  return String(value ?? '__empty__')
}
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-wrap items-center gap-1" :class="cn(props.class)">
    <template v-if="props.options.length">
      <Badge v-for="opt in display" :key="getKey(opt.value)" variant="secondary" class="gap-1 pr-1">
        <slot name="tag" :option="opt">{{ opt.label }}</slot>
        <button
          type="button"
          :aria-label="`移除 ${opt.label}`"
          class="cursor-pointer rounded-sm outline-none transition-colors hover:bg-secondary-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"
          @pointerdown.stop.prevent="emit('remove', opt.value)"
          @click.stop.prevent
        >
          <X class="size-3" />
        </button>
      </Badge>
      <Badge v-if="remaining > 0" variant="secondary">+{{ remaining }}</Badge>
    </template>
    <span v-else class="text-muted-foreground">{{ placeholder }}</span>
  </div>
</template>
