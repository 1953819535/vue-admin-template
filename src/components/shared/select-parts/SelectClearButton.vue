<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    label?: string
    class?: string
  }>(),
  { label: '清除' },
)

const emit = defineEmits<{ clear: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    e.stopPropagation()
    emit('clear')
  }
}
</script>

<template>
  <span
    role="button"
    tabindex="0"
    :aria-label="label"
    :title="label"
    class="shrink-0 cursor-pointer rounded-sm p-0.5 text-muted-foreground opacity-0 transition-all outline-none hover:text-foreground hover:opacity-100 focus-visible:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100 group-focus-within:opacity-100"
    :class="cn(props.class)"
    @pointerdown.stop.prevent
    @click.stop.prevent="emit('clear')"
    @keydown="onKeydown"
  >
    <X class="size-3.5" />
  </span>
</template>
