<template>
  <div
    v-if="slide"
    class="w-full max-w-3xl aspect-video rounded-xl shadow-2xl border border-slate-700 p-8 flex flex-col"
    :style="{ background: '#' + currentTheme.bg }"
  >
    <!-- title 布局 -->
    <template v-if="slide.layout === 'title'">
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          :style="getTextStyle(slide.titleStyle, currentTheme.text)"
        />
        <div class="w-32 h-1 rounded my-4" :style="{ background: '#' + currentTheme.primary }"></div>
        <input
          :value="slide.subtitle || ''"
          @input="update('subtitle', ($event.target as HTMLInputElement).value)"
          placeholder="副标题"
          class="bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          :style="getTextStyle(slide.subtitleStyle, currentTheme.muted)"
        />
      </div>
    </template>

    <!-- content 布局 -->
    <template v-else-if="slide.layout === 'content'">
      <input
        :value="slide.title"
        @input="update('title', ($event.target as HTMLInputElement).value)"
        class="bg-transparent mb-1 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        :style="getTextStyle(slide.titleStyle, currentTheme.text)"
      />
      <div class="w-16 h-1 rounded mb-4" :style="{ background: '#' + currentTheme.primary }"></div>
      <div class="flex-1 flex gap-4">
        <div class="space-y-2" :class="slide.imageUrl ? 'flex-1' : 'w-full'">
          <div v-for="(b, i) in slide.bullets" :key="i" class="flex items-start gap-2">
            <span class="mt-1 text-xs" :style="{ color: '#' + currentTheme.primary }">&#9679;</span>
            <input
              :value="b"
              @input="updateBullet(i, ($event.target as HTMLInputElement).value)"
              class="flex-1 bg-transparent focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
              :style="getTextStyle(slide.bulletStyle, currentTheme.text)"
            />
            <button @click="removeBullet(i)" class="text-slate-600 hover:text-red-400 text-xs">&times;</button>
          </div>
          <button @click="addBullet" class="text-xs text-slate-500 hover:text-primary transition">+ 添加要点</button>
        </div>
        <div v-if="slide.imageUrl" class="w-2/5 shrink-0 rounded-lg overflow-hidden">
          <img :src="slide.imageUrl" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display='none'" />
        </div>
      </div>
    </template>

    <!-- image 布局 -->
    <template v-else-if="slide.layout === 'image'">
      <input
        :value="slide.title"
        @input="update('title', ($event.target as HTMLInputElement).value)"
        class="bg-transparent mb-2 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        :style="getTextStyle(slide.titleStyle, currentTheme.text)"
      />
      <div class="flex-1 flex items-center justify-center border border-dashed border-slate-600 rounded-lg overflow-hidden">
        <img v-if="slide.imageUrl" :src="slide.imageUrl" class="max-w-full max-h-full object-contain" @error="($event.target as HTMLImageElement).style.display='none'" />
        <div v-else class="text-slate-500 text-sm text-center p-4">
          <p>在右侧属性面板输入图片URL</p>
        </div>
      </div>
      <div v-if="slide.bullets?.length" class="mt-2">
        <span v-for="(b, i) in slide.bullets" :key="i" class="text-xs mr-3" :style="{ color: '#' + currentTheme.muted }">{{ b }}</span>
      </div>
    </template>

    <!-- section 布局 -->
    <template v-else-if="slide.layout === 'section'">
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          :style="getTextStyle(slide.titleStyle, currentTheme.text)"
        />
        <div class="w-24 h-1 rounded mt-4" :style="{ background: '#' + currentTheme.primary }"></div>
      </div>
    </template>

    <!-- thanks 布局 -->
    <template v-else>
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          :style="getTextStyle(slide.titleStyle, currentTheme.text)"
        />
        <input
          :value="slide.subtitle || ''"
          @input="update('subtitle', ($event.target as HTMLInputElement).value)"
          placeholder="副标题"
          class="bg-transparent text-center w-full mt-3 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
          :style="getTextStyle(slide.subtitleStyle, currentTheme.muted)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import { getTheme } from '@/config/themes'
import type { Slide, TextStyle } from '@/types/slides'

const store = useSlidesStore()
const slide = computed(() => store.activeSlide)
const currentTheme = computed(() => getTheme(store.theme))

function getTextStyle(style?: TextStyle, fallbackColor?: string) {
  return {
    fontWeight: style?.bold ? 'bold' : 'normal',
    fontStyle: style?.italic ? 'italic' : 'normal',
    fontSize: style?.fontSize ? `${style.fontSize}px` : undefined,
    color: style?.color ? `#${style.color}` : (fallbackColor ? `#${fallbackColor}` : undefined),
  }
}

function update(key: keyof Slide, value: string) {
  store.updateSlide(store.activeIndex, { [key]: value })
}

function updateBullet(i: number, value: string) {
  const bullets = [...(slide.value?.bullets || [])]
  bullets[i] = value
  store.updateSlide(store.activeIndex, { bullets })
}

function addBullet() {
  const bullets = [...(slide.value?.bullets || []), '新要点']
  store.updateSlide(store.activeIndex, { bullets })
}

function removeBullet(i: number) {
  const bullets = [...(slide.value?.bullets || [])]
  bullets.splice(i, 1)
  store.updateSlide(store.activeIndex, { bullets })
}
</script>
