<template>
  <div class="h-screen flex flex-col bg-dark">
    <!-- 顶栏 -->
    <header class="flex items-center justify-between px-4 py-2 bg-dark-light border-b border-slate-700">
      <div class="flex items-center gap-3">
        <router-link to="/" class="text-slate-400 hover:text-white text-sm">&larr; 返回</router-link>
        <input
          v-model="store.title"
          class="bg-transparent border-none text-white text-lg font-medium focus:outline-none w-48 md:w-auto"
        />
      </div>
      <div class="flex gap-2">
        <button @click="addSlide" class="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded transition">
          添加页面
        </button>
        <button @click="doExport" :disabled="exporting" class="px-3 py-1.5 text-sm bg-primary hover:bg-blue-600 disabled:opacity-50 rounded transition">
          {{ exporting ? '导出中...' : '导出 PPTX' }}
        </button>
      </div>
    </header>

    <!-- 主体 - 桌面端三栏 / 移动端单栏 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧幻灯片列表 (移动端隐藏) -->
      <SlideList class="hidden md:block" />

      <!-- 中间画布 -->
      <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
        <SlideCanvas />
      </div>

      <!-- 右侧属性面板 (移动端隐藏) -->
      <PropertyPanel class="hidden lg:block" />
    </div>

    <!-- 移动端底部页码 -->
    <div class="md:hidden flex items-center justify-between px-4 py-2 bg-dark-light border-t border-slate-700">
      <button @click="prev" :disabled="store.activeIndex === 0" class="px-3 py-1 text-sm bg-slate-700 rounded disabled:opacity-30">上一页</button>
      <span class="text-sm text-slate-400">{{ store.activeIndex + 1 }} / {{ store.slides.length }}</span>
      <button @click="next" :disabled="store.activeIndex >= store.slides.length - 1" class="px-3 py-1 text-sm bg-slate-700 rounded disabled:opacity-30">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import { exportPptx } from '@/api'
import SlideList from '@/components/SlideList.vue'
import SlideCanvas from '@/components/SlideCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'

const store = useSlidesStore()
const exporting = ref(false)

function addSlide() { store.addSlide(store.activeIndex) }
function prev() { if (store.activeIndex > 0) store.activeIndex-- }
function next() { if (store.activeIndex < store.slides.length - 1) store.activeIndex++ }

async function doExport() {
  exporting.value = true
  try { await exportPptx(store.toPptData()) }
  catch (e: any) { alert(e.message || '导出失败') }
  finally { exporting.value = false }
}
</script>
