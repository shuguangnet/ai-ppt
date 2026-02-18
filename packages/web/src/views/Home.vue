<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-dark to-slate-900 flex flex-col items-center px-4 transition-all duration-500" :class="step === 'input' ? 'justify-center' : 'pt-10'">
    <div class="absolute inset-0 bg-grid opacity-20 pointer-events-none"></div>
    
    <h1 class="text-5xl md:text-6xl font-extrabold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-fadeIn">AI PPT</h1>
    <p class="text-slate-400 mb-8 text-center text-lg animate-fadeIn delay-100">输入主题，AI 一键生成专业演示文稿</p>

    <!-- Step 1: 输入主题 -->
    <template v-if="step === 'input'">
      <div class="mb-8 w-full max-w-xl animate-fadeIn delay-200">
        <p class="text-xs text-slate-500 mb-3 text-center uppercase tracking-widest">选择主题风格</p>
        <ThemePicker :current="slidesStore.theme" @select="slidesStore.theme = $event" />
      </div>
      <div class="w-full max-w-xl flex flex-col sm:flex-row gap-3 animate-fadeIn delay-300 relative z-10">
        <input v-model="topic" @keyup.enter="generate" placeholder="输入PPT主题，如：2026年AI发展趋势"
          class="flex-1 px-5 py-4 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-lg" />
        <button @click="generate" class="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 transition-all whitespace-nowrap">
          生成大纲
        </button>
      </div>
      <button @click="showSettings = true" class="mt-8 text-xs text-slate-500 hover:text-primary transition flex items-center gap-1 opacity-80 hover:opacity-100">
        <span :class="aiStore.isConfigured || aiStore.imageApiKey ? 'text-green-500' : ''">{{ aiStore.isConfigured || aiStore.imageApiKey ? '✓ 已配置 API' : '⚙ 配置 API' }}</span>
      </button>
    </template>

    <!-- Step 2: 流式生成中 -->
    <div v-if="step === 'loading'" class="w-full max-w-2xl relative z-10">
      <div class="flex items-center gap-3 mb-4">
        <div class="relative w-5 h-5">
            <div class="absolute inset-0 border-2 border-primary/30 rounded-full"></div>
            <div class="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span class="text-slate-300 font-medium">AI 正在生成「<span class="text-primary">{{ topic }}</span>」的大纲...</span>
      </div>
      <div ref="streamBox" class="p-6 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700/50 shadow-2xl max-h-[60vh] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div v-for="(line, i) in parsedLines" :key="i" class="flex items-start gap-3 text-sm animate-fadeIn">
          <span v-if="line.type === 'title'" class="text-xl text-white font-bold mb-2 block">{{ line.text }}</span>
          <template v-else-if="line.type === 'slide'">
            <span class="text-primary/70 font-mono w-6 text-right shrink-0 mt-0.5">{{ line.num }}.</span>
            <span class="text-slate-200 font-medium">{{ line.text }}</span>
            <span class="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-slate-400 ml-auto border border-slate-700">{{ line.layout }}</span>
          </template>
          <span v-else-if="line.type === 'bullet'" class="text-slate-400 pl-10 text-sm leading-relaxed relative before:content-['•'] before:absolute before:left-6 before:text-slate-600">{{ line.text }}</span>
        </div>
        <div class="text-primary animate-pulse font-bold ml-2">|</div>
      </div>
    </div>

    <!-- Step 3: 大纲确认/编辑 -->
    <div v-if="step === 'outline' && outlineData" class="w-full max-w-3xl relative z-10 flex flex-col h-[85vh]">
      <div class="flex items-center justify-between mb-4 shrink-0">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-1 h-6 bg-primary rounded-full"></span>
            大纲预览
        </h2>
        <div class="flex gap-3">
          <button @click="reset" class="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition">返回</button>
          <button @click="generate" class="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition">重新生成</button>
          <button @click="confirm" :disabled="loadingImages" class="px-6 py-2 text-sm bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2">
            <div v-if="loadingImages" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ loadingImages ? '正在智能配图...' : '确认生成 PPT' }}
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-hidden flex flex-col bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700/50 shadow-2xl p-1">
          <!-- 可编辑标题 -->
          <div class="p-4 border-b border-slate-700/50 bg-slate-800/50 rounded-t-xl">
            <input v-model="outlineData.title"
                class="w-full px-4 py-3 rounded-lg bg-dark border border-slate-700 text-white text-xl font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition" placeholder="PPT 标题" />
          </div>

          <!-- 可编辑幻灯片列表 -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <div v-for="(slide, i) in outlineData.slides" :key="i"
              class="p-4 rounded-xl bg-dark border border-slate-700 hover:border-slate-600 transition group relative">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-xs font-mono text-slate-600 w-6 text-right">{{ i + 1 }}</span>
                <select v-model="slide.layout"
                  class="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-primary hover:bg-slate-700 cursor-pointer transition">
                  <option value="title">封面页</option>
                  <option value="content">内容页</option>
                  <option value="image">全图页</option>
                  <option value="section">章节页</option>
                  <option value="thanks">结束页</option>
                </select>
                <input v-model="slide.title"
                  class="flex-1 bg-transparent text-base font-medium text-white focus:outline-none border-b border-transparent focus:border-primary/50 px-1 transition" placeholder="页面标题" />
                <button @click="removeOutlineSlide(i)" v-if="outlineData.slides.length > 1"
                  class="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition opacity-0 group-hover:opacity-100" title="删除页面">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <!-- 内容编辑区域 -->
              <div class="pl-10 space-y-2">
                  <!-- subtitle -->
                  <div v-if="slide.layout === 'title' || slide.layout === 'thanks'" class="mb-2">
                    <input v-model="slide.subtitle" placeholder="输入副标题..."
                      class="w-full bg-slate-800/50 text-sm text-slate-400 focus:outline-none focus:text-slate-200 rounded px-2 py-1 border border-transparent focus:border-slate-600 transition" />
                  </div>
                  
                  <!-- bullets 编辑 -->
                  <div v-if="slide.bullets?.length" class="space-y-1.5">
                    <div v-for="(b, j) in slide.bullets" :key="j" class="flex items-center gap-2 group/bullet">
                      <span class="text-slate-600 text-xs mt-0.5">•</span>
                      <input v-model="slide.bullets[j]"
                        class="flex-1 bg-transparent text-sm text-slate-400 focus:text-slate-200 focus:outline-none border-b border-transparent focus:border-slate-700 px-1 transition" />
                      <button @click="slide.bullets.splice(j, 1)" class="text-slate-700 hover:text-red-400 opacity-0 group-hover/bullet:opacity-100 transition px-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                    <button @click="slide.bullets.push('新要点')" class="text-xs text-primary/70 hover:text-primary flex items-center gap-1 mt-1 px-1 py-0.5 rounded hover:bg-primary/10 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                        添加要点
                    </button>
                  </div>

                  <!-- imageKeyword -->
                  <div v-if="slide.imageKeyword != null" class="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-2">
                    <span class="text-slate-500 text-xs shrink-0 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        配图关键词:
                    </span>
                    <input v-model="slide.imageKeyword" placeholder="输入关键词以自动搜索图片"
                      class="bg-slate-800/50 text-xs text-slate-400 focus:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-2 py-1 flex-1 border border-slate-700/50" />
                  </div>
              </div>
            </div>
          </div>
          
          <div class="p-4 border-t border-slate-700/50 bg-slate-800/50 rounded-b-xl">
             <button @click="addOutlineSlide" class="w-full py-3 text-sm text-slate-400 border border-dashed border-slate-600 bg-slate-800/30 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                添加新页面
             </button>
          </div>
      </div>
    </div>

    <p v-if="error" class="mt-4 text-red-400 text-sm">{{ error }}</p>
    <AISettingsModal :visible="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSlidesStore } from '@/stores/slides'
import { useAIConfigStore } from '@/stores/aiConfig'
import { aiGenerateStream, searchImage } from '@/api'
import ThemePicker from '@/components/ThemePicker.vue'
import AISettingsModal from '@/components/AISettingsModal.vue'

interface ParsedLine {
  type: 'title' | 'slide' | 'bullet' | 'info'
  text: string
  num?: number
  layout?: string
}

interface OutlineSlide {
  layout: string; title: string; subtitle?: string; bullets?: string[]
  imageKeyword?: string; imageUrl?: string
}
interface OutlineData {
  title: string
  slides: OutlineSlide[]
}

const router = useRouter()
const slidesStore = useSlidesStore()
const aiStore = useAIConfigStore()
const topic = ref('')
const step = ref<'input' | 'loading' | 'outline'>('input')
const error = ref('')
const showSettings = ref(false)
const parsedLines = ref<ParsedLine[]>([])
const streamBox = ref<HTMLElement>()
const outlineData = ref<OutlineData | null>(null)

let rawText = ''
let slideCount = 0

function parseStream() {
  const lines: ParsedLine[] = []

  // 提取 title
  const titleMatch = rawText.match(/"title"\s*:\s*"([^"]*)"/)
  if (titleMatch && lines.length === 0) {
    lines.push({ type: 'title', text: titleMatch[1] })
  }

  // 提取每个 slide 的 title 和 layout
  const slideRegex = /"layout"\s*:\s*"([^"]*)"\s*,\s*\n?\s*"title"\s*:\s*"([^"]*)"/g
  let m
  let num = 0
  while ((m = slideRegex.exec(rawText)) !== null) {
    num++
    lines.push({ type: 'slide', text: m[2], num, layout: m[1] })
  }

  // 提取 bullets
  const bulletRegex = /"bullets"\s*:\s*\[([\s\S]*?)\]/g
  while ((m = bulletRegex.exec(rawText)) !== null) {
    const items = m[1].match(/"([^"]*)"/g)
    if (items) {
      for (const item of items) {
        lines.push({ type: 'bullet', text: item.slice(1, -1) })
      }
    }
  }

  if (num > slideCount) {
    slideCount = num
    parsedLines.value = lines
    nextTick(() => {
      if (streamBox.value) streamBox.value.scrollTop = streamBox.value.scrollHeight
    })
  }
}

async function generate() {
  if (!topic.value.trim()) return
  step.value = 'loading'
  error.value = ''
  parsedLines.value = []
  rawText = ''
  slideCount = 0

  try {
    const data = await aiGenerateStream(
      topic.value,
      aiStore.getConfig(),
      (chunk) => {
        rawText += chunk
        parseStream()
      },
    )
    outlineData.value = { title: data.title, slides: data.slides }
    step.value = 'outline'
  } catch (e: any) {
    error.value = e.message || '生成失败，请重试'
    step.value = 'input'
  }
}

const loadingImages = ref(false)

async function confirm() {
  if (!outlineData.value) return
  loadingImages.value = true
  const imageConfig = aiStore.getImageConfig()
  try {
    const tasks = outlineData.value.slides.map(async (slide) => {
      if (slide.imageKeyword && !slide.imageUrl) {
        slide.imageUrl = await searchImage(slide.imageKeyword, imageConfig)
      }
    })
    await Promise.all(tasks)
  } catch { /* ignore image errors */ }
  loadingImages.value = false
  slidesStore.loadFromAI(outlineData.value as any)
  router.push('/editor')
}

function reset() {
  step.value = 'input'
  outlineData.value = null
  error.value = ''
}

function addOutlineSlide() {
  outlineData.value?.slides.push({ layout: 'content', title: '新页面', bullets: ['要点1'] })
}

function removeOutlineSlide(i: number) {
  outlineData.value?.slides.splice(i, 1)
}
</script>

<style scoped>
.bg-grid {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 0v20M0 1h20' stroke='rgba(255,255,255,0.05)' stroke-width='1' fill='none'/%3E%3C/svg%3E");
  mask-image: linear-gradient(to bottom, black, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black, transparent);
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
