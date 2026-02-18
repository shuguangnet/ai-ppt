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
      <option value="image">图片</option>
      <option value="section">章节</option>
      <option value="thanks">结束页</option>
    </select>

    <label class="block text-xs text-slate-500 mb-1">标题</label>
    <input
      :value="slide.title"
      @input="update('title', ($event.target as HTMLInputElement).value)"
      class="w-full mb-2 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
    />

    <!-- 标题样式 -->
    <div class="mb-4 p-2 rounded bg-dark border border-slate-700/50">
      <label class="block text-xs text-slate-500 mb-2">标题样式</label>
      <div class="flex gap-1 mb-2">
        <button
          @click="toggleStyle('titleStyle', 'bold')"
          :class="slide.titleStyle?.bold ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
          class="w-8 h-8 rounded text-sm font-bold border border-slate-600 hover:border-primary transition"
        >B</button>
        <button
          @click="toggleStyle('titleStyle', 'italic')"
          :class="slide.titleStyle?.italic ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
          class="w-8 h-8 rounded text-sm italic border border-slate-600 hover:border-primary transition"
        >I</button>
        <input
          type="number"
          :value="slide.titleStyle?.fontSize || 24"
          @input="updateStyle('titleStyle', 'fontSize', Number(($event.target as HTMLInputElement).value))"
          class="w-14 h-8 px-1 rounded bg-dark-light border border-slate-600 text-white text-xs text-center"
          placeholder="字号"
        />
        <input
          type="color"
          :value="slide.titleStyle?.color || 'ffffff'"
          @input="updateStyle('titleStyle', 'color', ($event.target as HTMLInputElement).value.replace('#', ''))"
          class="w-8 h-8 p-0 rounded border border-slate-600 cursor-pointer"
        />
      </div>
    </div>

    <template v-if="slide.layout === 'title' || slide.layout === 'thanks'">
      <label class="block text-xs text-slate-500 mb-1">副标题</label>
      <input
        :value="slide.subtitle || ''"
        @input="update('subtitle', ($event.target as HTMLInputElement).value)"
        class="w-full mb-2 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />

      <!-- 副标题样式 -->
      <div class="mb-4 p-2 rounded bg-dark border border-slate-700/50">
        <label class="block text-xs text-slate-500 mb-2">副标题样式</label>
        <div class="flex gap-1 mb-2">
          <button
            @click="toggleStyle('subtitleStyle', 'bold')"
            :class="slide.subtitleStyle?.bold ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
            class="w-8 h-8 rounded text-sm font-bold border border-slate-600 hover:border-primary transition"
          >B</button>
          <button
            @click="toggleStyle('subtitleStyle', 'italic')"
            :class="slide.subtitleStyle?.italic ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
            class="w-8 h-8 rounded text-sm italic border border-slate-600 hover:border-primary transition"
          >I</button>
          <input
            type="number"
            :value="slide.subtitleStyle?.fontSize || 16"
            @input="updateStyle('subtitleStyle', 'fontSize', Number(($event.target as HTMLInputElement).value))"
            class="w-14 h-8 px-1 rounded bg-dark-light border border-slate-600 text-white text-xs text-center"
            placeholder="字号"
          />
          <input
            type="color"
            :value="slide.subtitleStyle?.color || 'cccccc'"
            @input="updateStyle('subtitleStyle', 'color', ($event.target as HTMLInputElement).value.replace('#', ''))"
            class="w-8 h-8 p-0 rounded border border-slate-600 cursor-pointer"
          />
        </div>
      </div>
    </template>

    <template v-if="slide.layout === 'image'">
      <label class="block text-xs text-slate-500 mb-1">图片 URL</label>
      <input
        :value="slide.imageUrl || ''"
        @input="update('imageUrl', ($event.target as HTMLInputElement).value)"
        placeholder="https://example.com/image.png"
        class="w-full mb-4 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />
    </template>

    <!-- 要点样式 (content 布局) -->
    <template v-if="slide.layout === 'content'">
      <div class="mb-4 p-2 rounded bg-dark border border-slate-700/50">
        <label class="block text-xs text-slate-500 mb-2">要点样式</label>
        <div class="flex gap-1 mb-2">
          <button
            @click="toggleStyle('bulletStyle', 'bold')"
            :class="slide.bulletStyle?.bold ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
            class="w-8 h-8 rounded text-sm font-bold border border-slate-600 hover:border-primary transition"
          >B</button>
          <button
            @click="toggleStyle('bulletStyle', 'italic')"
            :class="slide.bulletStyle?.italic ? 'bg-primary text-white' : 'bg-dark-light text-slate-400'"
            class="w-8 h-8 rounded text-sm italic border border-slate-600 hover:border-primary transition"
          >I</button>
          <input
            type="number"
            :value="slide.bulletStyle?.fontSize || 14"
            @input="updateStyle('bulletStyle', 'fontSize', Number(($event.target as HTMLInputElement).value))"
            class="w-14 h-8 px-1 rounded bg-dark-light border border-slate-600 text-white text-xs text-center"
            placeholder="字号"
          />
          <input
            type="color"
            :value="slide.bulletStyle?.color || 'ffffff'"
            @input="updateStyle('bulletStyle', 'color', ($event.target as HTMLInputElement).value.replace('#', ''))"
            class="w-8 h-8 p-0 rounded border border-slate-600 cursor-pointer"
          />
        </div>
      </div>
    </template>

    <label class="block text-xs text-slate-500 mb-1">演讲备注</label>
    <textarea
      :value="slide.notes || ''"
      @input="update('notes', ($event.target as HTMLTextAreaElement).value)"
      rows="3"
      placeholder="演讲者备注..."
      class="w-full mb-4 px-2 py-1.5 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary resize-none"
    ></textarea>

    <div class="pt-4 border-t border-slate-700">
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
import type { Slide, TextStyle } from '@/types/slides'

const store = useSlidesStore()
const slide = computed(() => store.activeSlide)

function update(key: keyof Slide, value: string) {
  store.updateSlide(store.activeIndex, { [key]: value })
}

function toggleStyle(styleKey: 'titleStyle' | 'subtitleStyle' | 'bulletStyle', prop: 'bold' | 'italic') {
  const current = slide.value?.[styleKey] || {}
  store.updateSlide(store.activeIndex, {
    [styleKey]: { ...current, [prop]: !current[prop] }
  })
}

function updateStyle(styleKey: 'titleStyle' | 'subtitleStyle' | 'bulletStyle', prop: 'fontSize' | 'color', value: number | string) {
  const current = slide.value?.[styleKey] || {}
  store.updateSlide(store.activeIndex, {
    [styleKey]: { ...current, [prop]: value }
  })
}
</script>
