<template>
  <div
    v-if="slide"
    class="w-full max-w-3xl aspect-video bg-[#0F172A] rounded-xl shadow-2xl border border-slate-700 p-8 flex flex-col"
  >
    <!-- title 布局 -->
    <template v-if="slide.layout === 'title'">
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center text-2xl md:text-3xl font-bold text-white w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        />
        <div class="w-32 h-1 bg-primary rounded my-4"></div>
        <input
          :value="slide.subtitle || ''"
          @input="update('subtitle', ($event.target as HTMLInputElement).value)"
          placeholder="副标题"
          class="bg-transparent text-center text-sm md:text-base text-slate-400 w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        />
      </div>
    </template>

    <!-- content 布局 -->
    <template v-else-if="slide.layout === 'content'">
      <input
        :value="slide.title"
        @input="update('title', ($event.target as HTMLInputElement).value)"
        class="bg-transparent text-xl md:text-2xl font-bold text-white mb-1 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
      />
      <div class="w-16 h-1 bg-primary rounded mb-4"></div>
      <div class="flex-1 space-y-2">
        <div v-for="(b, i) in slide.bullets" :key="i" class="flex items-start gap-2">
          <span class="text-primary mt-1 text-xs">&#9679;</span>
          <input
            :value="b"
            @input="updateBullet(i, ($event.target as HTMLInputElement).value)"
            class="flex-1 bg-transparent text-slate-200 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 py-0.5"
          />
          <button @click="removeBullet(i)" class="text-slate-600 hover:text-red-400 text-xs">&times;</button>
        </div>
        <button @click="addBullet" class="text-xs text-slate-500 hover:text-primary transition">+ 添加要点</button>
      </div>
    </template>

    <!-- section 布局 -->
    <template v-else-if="slide.layout === 'section'">
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center text-2xl md:text-3xl font-bold text-white w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        />
        <div class="w-24 h-1 bg-primary rounded mt-4"></div>
      </div>
    </template>

    <!-- thanks 布局 -->
    <template v-else>
      <div class="flex-1 flex flex-col items-center justify-center">
        <input
          :value="slide.title"
          @input="update('title', ($event.target as HTMLInputElement).value)"
          class="bg-transparent text-center text-2xl md:text-3xl font-bold text-white w-full focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        />
        <input
          :value="slide.subtitle || ''"
          @input="update('subtitle', ($event.target as HTMLInputElement).value)"
          placeholder="副标题"
          class="bg-transparent text-center text-sm text-slate-400 w-full mt-3 focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 py-1"
        />
      </div>
    </template>
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
