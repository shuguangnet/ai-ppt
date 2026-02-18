<template>
  <div class="w-60 bg-dark-light border-l border-slate-700 overflow-y-auto p-4" v-if="slide">
    <h3 class="text-sm font-medium text-slate-400 mb-3">页面属性</h3>

    <label class="block text-xs text-slate-500 mb-1">布局类型</label>
    <select
      :value="slide.layout"
      @change="update('layout', ($event.target as HTMLSelectElement).value)"
      class="w-full mb-4 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
    >
      <option value="title">封面</option>
      <option value="content">内容</option>
      <option value="section">章节</option>
      <option value="thanks">结束页</option>
    </select>

    <label class="block text-xs text-slate-500 mb-1">标题</label>
    <input
      :value="slide.title"
      @input="update('title', ($event.target as HTMLInputElement).value)"
      class="w-full mb-4 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
    />

    <template v-if="slide.layout === 'title' || slide.layout === 'thanks'">
      <label class="block text-xs text-slate-500 mb-1">副标题</label>
      <input
        :value="slide.subtitle || ''"
        @input="update('subtitle', ($event.target as HTMLInputElement).value)"
        class="w-full mb-4 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />
    </template>

    <div class="mt-4 pt-4 border-t border-slate-700">
      <button
        @click="store.removeSlide(store.activeIndex)"
        :disabled="store.slides.length <= 1"
        class="w-full px-3 py-1.5 text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10 disabled:opacity-30 rounded transition"
      >删除此页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import type { Slide } from '@/types/slides'

const store = useSlidesStore()
const slide = computed(() => store.activeSlide)

function update(key: keyof Slide, value: string) {
  store.updateSlide(store.activeIndex, { [key]: value })
}
</script>
