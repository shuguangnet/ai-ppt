<template>
  <div class="min-h-screen bg-dark flex flex-col items-center justify-center px-4">
    <h1 class="text-4xl md:text-5xl font-bold mb-2">AI PPT</h1>
    <p class="text-slate-400 mb-8 text-center">输入主题，AI 一键生成专业演示文稿</p>

    <div class="w-full max-w-xl flex flex-col sm:flex-row gap-3">
      <input
        v-model="topic"
        @keyup.enter="generate"
        placeholder="输入PPT主题，如：2026年AI发展趋势"
        class="flex-1 px-4 py-3 rounded-lg bg-dark-light border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-primary"
      />
      <button
        @click="generate"
        :disabled="loading"
        class="px-6 py-3 bg-primary hover:bg-blue-600 disabled:opacity-50 rounded-lg font-medium whitespace-nowrap transition"
      >
        {{ loading ? '生成中...' : '生成 PPT' }}
      </button>
    </div>

    <p v-if="error" class="mt-4 text-red-400 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSlidesStore } from '@/stores/slides'
import { aiGenerate } from '@/api'

const router = useRouter()
const store = useSlidesStore()
const topic = ref('')
const loading = ref(false)
const error = ref('')

async function generate() {
  if (!topic.value.trim() || loading.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await aiGenerate(topic.value)
    store.loadFromAI(data)
    router.push('/editor')
  } catch (e: any) {
    error.value = e.message || '生成失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>
