<template>
  <div class="w-52 bg-dark-light border-r border-slate-700 overflow-y-auto p-3 space-y-2">
    <div
      v-for="(slide, i) in store.slides"
      :key="slide.id"
      @click="store.activeIndex = i"
      class="relative cursor-pointer rounded-lg border-2 p-2 transition"
      :class="i === store.activeIndex ? 'border-primary' : 'border-slate-700 hover:border-slate-500'"
    >
      <div class="text-xs text-slate-500 mb-1">{{ i + 1 }}</div>
      <div class="bg-dark rounded p-2 aspect-video flex items-center justify-center">
        <span class="text-xs text-slate-300 truncate">{{ slide.title }}</span>
      </div>
      <button
        v-if="store.slides.length > 1"
        @click.stop="store.removeSlide(i)"
        class="absolute top-1 right-1 w-5 h-5 text-xs text-slate-500 hover:text-red-400 rounded-full flex items-center justify-center"
      >&times;</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSlidesStore } from '@/stores/slides'
const store = useSlidesStore()
</script>
