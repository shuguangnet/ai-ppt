<template>
  <div class="min-h-screen bg-dark flex flex-col items-center px-4" :class="step === 'input' ? 'justify-center' : 'pt-10'">
    <h1 class="text-4xl md:text-5xl font-bold mb-2">AI PPT</h1>
    <p class="text-slate-400 mb-6 text-center">输入主题，AI 一键生成专业演示文稿</p>

    <!-- Step 1: 输入主题 -->
    <template v-if="step === 'input'">
      <div class="mb-6">
        <p class="text-xs text-slate-500 mb-2 text-center">选择主题风格</p>
        <ThemePicker :current="slidesStore.theme" @select="slidesStore.theme = $event" />
      </div>
      <div class="w-full max-w-xl flex flex-col sm:flex-row gap-3">
        <input v-model="topic" @keyup.enter="generate" placeholder="输入PPT主题，如：2026年AI发展趋势"
          class="flex-1 px-4 py-3 rounded-lg bg-dark-light border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary" />
        <button @click="generate" class="px-6 py-3 bg-primary hover:bg-blue-600 rounded-lg font-medium whitespace-nowrap transition">
          生成大纲
        </button>
      </div>
      <button @click="showSettings = true" class="mt-6 text-xs text-slate-500 hover:text-primary transition">
        {{ aiStore.isConfigured ? '✓ 已配置自定义AI' : '配置自定义 AI 模型' }}
      </button>
    </template>

    <!-- Step 2: 流式生成中 -->
    <div v-if="step === 'loading'" class="w-full max-w-2xl">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-slate-300">AI 正在生成「{{ topic }}」的大纲...</span>
      </div>
      <div ref="streamBox" class="p-4 rounded-lg bg-dark-light border border-slate-700 max-h-72 overflow-y-auto space-y-1">
        <div v-for="(line, i) in parsedLines" :key="i" class="flex items-start gap-2 text-sm animate-fadeIn">
          <span v-if="line.type === 'title'" class="text-primary font-medium">{{ line.text }}</span>
          <template v-else-if="line.type === 'slide'">
            <span class="text-slate-500 w-6 text-right shrink-0">{{ line.num }}.</span>
            <span class="text-slate-300">{{ line.text }}</span>
            <span class="text-slate-600 text-xs ml-auto">{{ line.layout }}</span>
          </template>
          <span v-else-if="line.type === 'bullet'" class="text-slate-400 pl-8 text-xs">- {{ line.text }}</span>
        </div>
        <div class="text-slate-600 animate-pulse">|</div>
      </div>
    </div>

    <!-- Step 3: 大纲确认/编辑 -->
    <div v-if="step === 'outline' && outlineData" class="w-full max-w-2xl">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-medium">大纲预览</h2>
        <div class="flex gap-2">
          <button @click="reset" class="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded transition">返回</button>
          <button @click="generate" class="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded transition">重新生成</button>
          <button @click="confirm" :disabled="loadingImages" class="px-4 py-1.5 text-sm bg-primary hover:bg-blue-600 rounded transition disabled:opacity-50">
            {{ loadingImages ? '配图中...' : '确认生成 PPT' }}
          </button>
        </div>
      </div>

      <!-- 可编辑标题 -->
      <input v-model="outlineData.title"
        class="w-full mb-4 px-3 py-2 rounded-lg bg-dark-light border border-slate-700 text-primary text-lg font-medium focus:outline-none focus:border-primary" />

      <!-- 可编辑幻灯片列表 -->
      <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        <div v-for="(slide, i) in outlineData.slides" :key="i"
          class="p-3 rounded-lg bg-dark-light border border-slate-700 group">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs text-slate-500 w-5 text-right">{{ i + 1 }}</span>
            <select v-model="slide.layout"
              class="text-xs bg-dark border border-slate-700 text-slate-400 rounded px-1.5 py-0.5 focus:outline-none focus:border-primary">
              <option value="title">封面</option>
              <option value="content">内容</option>
              <option value="image">图片</option>
              <option value="section">章节</option>
              <option value="thanks">结束页</option>
            </select>
            <input v-model="slide.title"
              class="flex-1 bg-transparent text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary rounded px-1" />
            <button @click="removeOutlineSlide(i)" v-if="outlineData.slides.length > 1"
              class="text-slate-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition">&times;</button>
          </div>
          <!-- bullets 编辑 -->
          <div v-if="slide.bullets?.length" class="pl-7 space-y-1 mt-1">
            <div v-for="(b, j) in slide.bullets" :key="j" class="flex items-center gap-1">
              <span class="text-slate-600 text-xs">-</span>
              <input v-model="slide.bullets[j]"
                class="flex-1 bg-transparent text-xs text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary rounded px-1" />
              <button @click="slide.bullets.splice(j, 1)" class="text-slate-700 hover:text-red-400 text-xs">&times;</button>
            </div>
            <button @click="slide.bullets.push('新要点')" class="text-xs text-slate-600 hover:text-primary">+ 要点</button>
          </div>
          <!-- subtitle -->
          <div v-if="slide.layout === 'title' || slide.layout === 'thanks'" class="pl-7 mt-1">
            <input v-model="slide.subtitle" placeholder="副标题"
              class="bg-transparent text-xs text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 w-full" />
          </div>
          <!-- imageKeyword -->
          <div v-if="slide.imageKeyword != null" class="pl-7 mt-1 flex items-center gap-1">
            <span class="text-slate-600 text-xs shrink-0">img:</span>
            <input v-model="slide.imageKeyword" placeholder="image keyword"
              class="bg-transparent text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 flex-1" />
          </div>
        </div>
      </div>

      <button @click="addOutlineSlide" class="mt-2 w-full py-2 text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg hover:border-primary hover:text-primary transition">
        + 添加页面
      </button>
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
  try {
    const tasks = outlineData.value.slides.map(async (slide) => {
      if (slide.imageKeyword && !slide.imageUrl) {
        slide.imageUrl = await searchImage(slide.imageKeyword)
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
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
