<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- 遮罩 -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="close"></div>

      <!-- 弹窗 -->
      <div class="relative w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col max-h-[85vh]">
        <!-- 头部 -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-700 shrink-0">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            AI 润色
          </h3>
          <button @click="close" class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <!-- 内容 -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- 模式选择 -->
          <div>
            <label class="text-xs text-slate-400 mb-2 block">选择润色方式</label>
            <div class="flex gap-3">
              <button
                @click="mode = 'refine'"
                class="flex-1 p-3 rounded-xl border-2 transition text-left"
                :class="mode === 'refine' ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-slate-500'"
              >
                <div class="font-medium text-white text-sm">完全重写</div>
                <div class="text-xs text-slate-400 mt-1">根据要求重新生成PPT结构</div>
              </button>
              <button
                @click="mode = 'polish'"
                class="flex-1 p-3 rounded-xl border-2 transition text-left"
                :class="mode === 'polish' ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-slate-500'"
              >
                <div class="font-medium text-white text-sm">仅文字润色</div>
                <div class="text-xs text-slate-400 mt-1">保持结构，优化文字内容</div>
              </button>
            </div>
          </div>

          <!-- 润色指令 -->
          <div>
            <label class="text-xs text-slate-400 mb-2 block">润色要求</label>
            <textarea
              v-model="instruction"
              :placeholder="mode === 'refine' ? '例如：让内容更专业，增加AI相关内容' : '例如：让文字更简洁有力，优化表达'"
              class="w-full h-24 px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none"
            ></textarea>
          </div>

          <!-- 预览区域 -->
          <div v-if="loading || resultData">
            <label class="text-xs text-slate-400 mb-2 flex items-center justify-between">
              <span>预览结果</span>
              <span v-if="loading" class="text-primary">AI 正在生成中...</span>
            </label>
            <div class="bg-slate-900 rounded-xl border border-slate-700 p-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
              <template v-if="loading">
                <div class="space-y-2">
                  <div v-for="(line, i) in parsedLines" :key="i" class="animate-fadeIn">
                    <div v-if="line.type === 'title'" class="text-lg font-bold text-white mb-2">{{ line.text }}</div>
                    <div v-else-if="line.type === 'slide'" class="flex items-center gap-2">
                      <span class="text-primary/70 font-mono w-5">{{ line.num }}.</span>
                      <span class="text-slate-300">{{ line.text }}</span>
                      <span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-500">{{ line.layout }}</span>
                    </div>
                    <div v-else-if="line.type === 'bullet'" class="text-slate-400 pl-7 text-sm">• {{ line.text }}</div>
                  </div>
                  <div class="text-primary animate-pulse">|</div>
                </div>
              </template>
              <template v-else-if="resultData">
                <div class="space-y-2">
                  <div class="text-lg font-bold text-white mb-3 border-b border-slate-700 pb-2">{{ resultData.title }}</div>
                  <div v-for="(slide, i) in resultData.slides" :key="i" class="border-b border-slate-800 pb-2 last:border-0">
                    <div class="flex items-center gap-2">
                      <span class="text-primary/70 font-mono w-5">{{ i + 1 }}.</span>
                      <span class="text-slate-300 font-medium">{{ slide.title }}</span>
                      <span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-500">{{ slide.layout }}</span>
                    </div>
                    <div v-if="slide.bullets?.length" class="pl-7 mt-1 space-y-0.5">
                      <div v-for="(b, j) in slide.bullets" :key="j" class="text-slate-400 text-sm">• {{ b }}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex items-center justify-between px-6 py-4 border-t border-slate-700 shrink-0 bg-slate-800/50">
          <div class="text-xs text-slate-500">
            润色次数：{{ refineCount }}次
          </div>
          <div class="flex gap-3">
            <button @click="close" class="px-4 py-2 text-sm text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition">
              取消
            </button>
            <button
              @click="startRefine"
              :disabled="!instruction.trim() || loading"
              class="px-6 py-2 text-sm bg-gradient-to-r from-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              <div v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {{ loading ? '润色中...' : '开始润色' }}
            </button>
            <button
              v-if="resultData"
              @click="applyResult"
              class="px-6 py-2 text-sm bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium shadow-lg shadow-green-500/20 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
              应用结果
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useSlidesStore } from '@/stores/slides'
import { useAIConfigStore } from '@/stores/aiConfig'
import { refinePptStream } from '@/api'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const store = useSlidesStore()
const aiStore = useAIConfigStore()

const mode = ref<'refine' | 'polish'>('refine')
const instruction = ref('')
const loading = ref(false)
const refineCount = ref(0)

const parsedLines = ref<{ type: string; text: string; num?: number; layout?: string }[]>([])
const rawText = ref('')
const resultData = ref<{ title: string; slides: any[] } | null>(null)

watch(() => props.visible, (val) => {
  if (!val) {
    // 重置状态
    instruction.value = ''
    loading.value = false
    resultData.value = null
    parsedLines.value = []
    rawText.value = ''
  }
})

function parseStream() {
  const lines: { type: string; text: string; num?: number; layout?: string }[] = []

  // 提取 title
  const titleMatch = rawText.value.match(/"title"\s*:\s*"([^"]*)"/)
  if (titleMatch && lines.length === 0) {
    lines.push({ type: 'title', text: titleMatch[1] })
  }

  // 提取每个 slide 的 title 和 layout
  const slideRegex = /"layout"\s*:\s*"([^"]*)"\s*,\s*\n?\s*"title"\s*:\s*"([^"]*)"/g
  let m
  let num = 0
  while ((m = slideRegex.exec(rawText.value)) !== null) {
    num++
    lines.push({ type: 'slide', text: m[2], num, layout: m[1] })
  }

  // 提取 bullets
  const bulletRegex = /"bullets"\s*:\s*\[([\s\S]*?)\]/g
  while ((m = bulletRegex.exec(rawText.value)) !== null) {
    const items = m[1].match(/"([^"]*)"/g)
    if (items) {
      for (const item of items) {
        lines.push({ type: 'bullet', text: item.slice(1, -1) })
      }
    }
  }

  parsedLines.value = lines
}

async function startRefine() {
  if (!instruction.value.trim() || loading.value) return

  loading.value = true
  parsedLines.value = []
  rawText.value = ''
  resultData.value = null

  try {
    const pptData = store.toPptData()
    const result = await refinePptStream(
      pptData,
      instruction.value,
      mode.value,
      aiStore.getConfig(),
      (chunk) => {
        rawText.value += chunk
        parseStream()
      }
    )
    resultData.value = result
    refineCount.value++
  } catch (e: any) {
    alert(e.message || '润色失败')
  } finally {
    loading.value = false
  }
}

function applyResult() {
  if (!resultData.value) return
  store.loadFromAI(resultData.value)
  close()
}

function close() {
  emit('close')
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
