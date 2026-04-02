<script setup lang="ts">
import type { ColumnConfig } from "./types";
import { computed, useSlots } from "vue";

const props = defineProps<{
  key: string;
  title: string;
  width?: number | string;
  align?: "left" | "center" | "right";
}>();

// 注入到父组件的列配置
const columnConfig = computed<ColumnConfig>(() => ({
  key: props.key,
  title: props.title,
  width: props.width,
  align: props.align,
}));

// 获取插槽
const slots = useSlots();

// 暴露给父组件
defineExpose({
  columnConfig,
  slots,
});
</script>

<template>
  <!-- DataTableColumn 不渲染任何内容，仅用于配置传递 -->
  <slot />
</template>
