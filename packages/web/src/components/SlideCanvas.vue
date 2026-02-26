<template>
  <div
    v-if="slide"
    class="w-full max-w-3xl aspect-video rounded-2xl overflow-hidden relative transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
    :class="isSelected ? 'ring-2 ring-primary shadow-2xl' : 'shadow-xl'"
    :style="{ background: currentTheme.bgGradient || '#' + currentTheme.bg }"
    @click="$emit('select')"
  >
    <!-- 画布边框效果 -->
    <div class="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none"></div>
    <!-- 左侧装饰条 (sidebar 布局) -->
    <div
      v-if="currentTheme.layout === 'sidebar'"
      class="absolute left-0 top-0 bottom-0 flex flex-col"
      :style="{ width: currentTheme.sidebarWidth || '25%', background: getSidebarBg() }"
    >
      <!-- 装饰元素 -->
      <div class="flex-1 flex items-center justify-center">
        <div class="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
          <svg class="w-8 h-8 text-white/60" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 顶部装饰条 (部分主题) -->
    <div
      v-if="currentTheme.decoration === 'shape'"
      class="absolute top-0 left-0 right-0 h-2"
      :style="{ background: '#' + currentTheme.primary }"
    ></div>

    <!-- 右侧装饰圆形 -->
    <div
      v-if="currentTheme.decoration === 'gradient' && currentTheme.layout !== 'sidebar'"
      class="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20"
      :style="{ background: '#' + currentTheme.primary }"
    ></div>

    <!-- 主内容区 -->
    <div
      class="h-full p-8 flex flex-col overflow-visible"
      :style="{ marginLeft: currentTheme.layout === 'sidebar' ? (currentTheme.sidebarWidth || '25%') : '0' }"
    >
      <!-- title 布局 -->
      <template v-if="slide.layout === 'title'">
        <div class="flex-1 flex flex-col items-center justify-center">
          <input
            :value="slide.title"
            @input="update('title', ($event.target as HTMLInputElement).value)"
            class="bg-transparent text-center w-full focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 text-2xl font-bold transition-all duration-200"
            :style="getTextStyle(slide.titleStyle, currentTheme.text)"
          />
          <div class="w-32 h-1 rounded-full my-4" :style="{ background: '#' + currentTheme.primary }"></div>
          <input
            :value="slide.subtitle || ''"
            @input="update('subtitle', ($event.target as HTMLInputElement).value)"
            placeholder="副标题"
            class="bg-transparent text-center w-full focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 transition-all duration-200"
            :style="getTextStyle(slide.subtitleStyle, currentTheme.muted)"
          />
        </div>
      </template>

      <!-- content 布局 -->
      <template v-else-if="slide.layout === 'content'">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent mb-1 focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 text-xl font-bold transition-all duration-200"
          :style="getTextStyle(slide.titleStyle, currentTheme.text)"
        />
        <div class="w-16 h-1 rounded-full mb-4" :style="{ background: '#' + currentTheme.primary }"></div>
        <div class="flex-1 flex gap-4">
          <div class="space-y-2" :class="slide.imageUrl ? 'flex-1' : 'w-full'">
            <div v-for="(b, i) in slide.bullets" :key="i" class="flex items-start gap-2 group">
              <span class="mt-1.5 text-xs" :style="{ color: '#' + currentTheme.primary }">&#9679;</span>
              <input
                :value="b"
                @input="updateBullet(i, ($event.target as HTMLInputElement).value)"
                class="flex-1 bg-transparent focus:bg-white/10 focus:outline-none rounded-lg px-3 py-2 transition-all duration-200"
                :style="getTextStyle(slide.bulletStyle, currentTheme.text)"
              />
              <button @click="removeBullet(i)" class="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 text-xs px-1 transition-all duration-200">&times;</button>
            </div>
            <button @click="addBullet" class="text-xs text-slate-500 hover:text-primary transition mt-2 pl-4">+ 添加要点</button>
          </div>
          <div v-if="slide.imageUrl" class="w-2/5 shrink-0 rounded-lg overflow-hidden shadow-lg">
            <img :src="slide.imageUrl" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display='none'" />
          </div>
        </div>
      </template>

      <!-- image 布局 -->
      <template v-else-if="slide.layout === 'image'">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent mb-2 focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 text-lg font-bold transition-all duration-200"
          :style="getTextStyle(slide.titleStyle, currentTheme.text)"
        />
        <div class="flex-1 flex items-center justify-center border-2 border-dashed border-slate-600/50 rounded-xl overflow-hidden bg-slate-800/20">
          <img v-if="slide.imageUrl" :src="slide.imageUrl" class="max-w-full max-h-full object-contain" @error="($event.target as HTMLImageElement).style.display='none'" />
          <div v-else class="text-slate-500 text-sm text-center p-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>在右侧属性面板输入图片URL</p>
          </div>
        </div>
        <div v-if="slide.bullets?.length" class="mt-3 flex flex-wrap gap-2">
          <span v-for="(b, i) in slide.bullets" :key="i" class="text-xs px-2 py-1 bg-white/10 rounded-full" :style="{ color: '#' + currentTheme.muted }">{{ b }}</span>
        </div>
      </template>

      <!-- section 布局 -->
      <template v-else-if="slide.layout === 'section'">
        <div class="flex-1 flex flex-col items-center justify-center">
          <input
            :value="slide.title"
            @input="update('title', ($event.target as HTMLInputElement).value)"
            class="bg-transparent text-center w-full focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 text-3xl font-bold transition-all duration-200"
            :style="getTextStyle(slide.titleStyle, currentTheme.text)"
          />
          <div class="w-24 h-1 rounded-full mt-5" :style="{ background: '#' + currentTheme.primary }"></div>
        </div>
      </template>

      <!-- thanks 布局 -->
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center">
          <input
            :value="slide.title"
            @input="update('title', ($event.target as HTMLInputElement).value)"
            class="bg-transparent text-center w-full focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 text-3xl font-bold transition-all duration-200"
            :style="getTextStyle(slide.titleStyle, currentTheme.text)"
          />
          <input
            :value="slide.subtitle || ''"
            @input="update('subtitle', ($event.target as HTMLInputElement).value)"
            placeholder="副标题"
            class="bg-transparent text-center w-full mt-3 focus:outline-none focus:bg-white/10 rounded-lg px-4 py-3 transition-all duration-200"
            :style="getTextStyle(slide.subtitleStyle, currentTheme.muted)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import { getTheme } from '@/config/themes'
import type { Slide, TextStyle } from '@/types/slides'

defineEmits(['select'])

const store = useSlidesStore()
const slide = computed(() => store.activeSlide)
const currentTheme = computed(() => getTheme(store.theme))
const isSelected = computed(() => store.activeIndex >= 0)

function getSidebarBg() {
  const c = currentTheme.value
  if (c.sidebarColor) {
    return `linear-gradient(180deg, #${c.sidebarColor} 0%, #${c.sidebarColor}CC 100%)`
  }
  return '#' + (c.primary || '3B82F6')
}

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
