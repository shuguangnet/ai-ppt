<template>
  <div class="flex gap-2 flex-wrap justify-center">
    <button
      v-for="t in themes"
      :key="t.name"
      @click="$emit('select', t.name)"
      class="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all hover:scale-105"
      :class="current === t.name ? 'border-primary ring-2 ring-primary/30 bg-slate-800' : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-500'"
    >
      <span
        class="w-4 h-4 rounded-full border border-slate-600 shrink-0"
        :style="{ background: t.bgGradient || '#' + t.bg }"
      ></span>
      <span class="whitespace-nowrap">{{ t.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { themes } from '@/config/themes'
defineProps<{ current: string }>()
defineEmits<{ select: [name: string] }>()
</script>
