<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-for="t in themes"
      :key="t.name"
      @click="$emit('select', t.name)"
      class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition"
      :class="current === t.name ? 'border-primary text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'"
    >
      <span class="w-3 h-3 rounded-full" :style="{ background: '#' + t.primary }"></span>
      {{ t.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { themes } from '@/config/themes'
defineProps<{ current: string }>()
defineEmits<{ select: [name: string] }>()
</script>
