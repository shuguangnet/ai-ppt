<template>
  <div class="h-screen flex flex-col bg-dark overflow-hidden">
    <!-- 顶栏 -->
    <header class="flex items-center justify-between px-4 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-20 shrink-0">
      <div class="flex items-center gap-4">
        <router-link to="/" class="flex items-center gap-1 text-slate-400 hover:text-white text-sm font-medium transition group">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:-translate-x-0.5 transition"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
          返回
        </router-link>
        <div class="h-5 w-px bg-slate-700 mx-1"></div>
        <input
          v-model="store.title"
          class="bg-transparent border border-transparent hover:border-slate-700 focus:border-primary rounded px-2 py-1 text-white text-sm font-medium focus:outline-none w-48 md:w-64 transition placeholder-slate-500"
          placeholder="未命名演示文稿"
        />
      </div>
      <div class="flex items-center gap-2">
        <div class="hidden md:flex items-center gap-1 mr-2">
            <button @click="showTheme = !showTheme" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition" :class="{'bg-slate-700 text-white': showTheme}">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              主题
            </button>
            <button @click="addSlide" class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
              加页
            </button>
        </div>
        <button @click="doExport" :disabled="exporting" class="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-md shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95">
          <svg v-if="!exporting" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          <div v-else class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {{ exporting ? '导出中...' : '导出 PPTX' }}
        </button>
      </div>
    </header>

    <!-- 主题选择栏 -->
    <div v-if="showTheme" class="px-4 py-3 bg-slate-800/90 border-b border-slate-700/50 absolute top-14 left-0 right-0 z-10 backdrop-blur shadow-xl animate-fadeIn">
      <div class="flex items-center justify-between mb-2">
          <span class="text-xs text-slate-400 font-medium">选择主题风格</span>
          <button @click="showTheme = false" class="text-slate-500 hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button>
      </div>
      <ThemePicker :current="store.theme" @select="store.theme = $event" />
    </div>

    <!-- 主体 -->
    <div class="flex-1 flex overflow-hidden relative">
      <div class="hidden md:block w-48 lg:w-56 border-r border-slate-700/50 bg-slate-900/50 flex flex-col z-0">
         <SlideList />
      </div>
      
      <div class="flex-1 flex flex-col h-full overflow-hidden bg-dark relative">
        <div class="flex-1 overflow-auto p-4 md:p-8 flex items-center justify-center bg-grid bg-fixed bg-center">
            <SlideCanvas />
        </div>
        
        <!-- 移动端底部 -->
        <div class="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900 border-t border-slate-700 shrink-0 z-20">
          <button @click="prev" :disabled="store.activeIndex === 0" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full disabled:opacity-30 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div class="flex flex-col items-center">
             <span class="text-xs font-medium text-slate-300">第 {{ store.activeIndex + 1 }} 页</span>
             <span class="text-[10px] text-slate-500">共 {{ store.slides.length }} 页</span>
          </div>
          <button @click="next" :disabled="store.activeIndex >= store.slides.length - 1" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full disabled:opacity-30 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <div class="h-6 w-px bg-slate-800 mx-2"></div>
          <button @click="addSlide" class="p-2 text-primary hover:bg-primary/10 rounded-full transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          </button>
          <button @click="showTheme = !showTheme" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </button>
        </div>
      </div>
      
      <div class="hidden lg:block w-72 border-l border-slate-700/50 bg-slate-900/50 flex flex-col z-0">
          <PropertyPanel />
      </div>
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
import ThemePicker from '@/components/ThemePicker.vue'

const store = useSlidesStore()
const exporting = ref(false)
const showTheme = ref(false)

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

<style scoped>
.bg-grid {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0v20M0 1h20' stroke='rgba(255,255,255,0.05)' stroke-width='1' fill='none'/%3E%3C/svg%3E");
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
