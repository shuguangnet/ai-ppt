<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" @click.self="$emit('close')">
    <div class="bg-dark-light rounded-xl border border-slate-700 w-full max-w-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium">AI 模型配置</h3>
        <button @click="$emit('close')" class="text-slate-400 hover:text-white">&times;</button>
      </div>

      <p class="text-xs text-slate-500 mb-4">配置仅保存在当前页面内存中，刷新即清除，不会上传存储。</p>

      <label class="block text-xs text-slate-500 mb-1">API Key</label>
      <input
        v-model="store.apiKey"
        type="password"
        placeholder="sk-..."
        class="w-full mb-3 px-3 py-2 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />

      <label class="block text-xs text-slate-500 mb-1">Base URL</label>
      <input
        v-model="store.baseUrl"
        placeholder="https://api.openai.com/v1"
        class="w-full mb-3 px-3 py-2 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />

      <label class="block text-xs text-slate-500 mb-1">模型名称</label>
      <input
        v-model="store.model"
        placeholder="gpt-4o"
        class="w-full mb-4 px-3 py-2 rounded bg-dark border border-slate-700 text-white text-sm focus:outline-none focus:border-primary"
      />

      <button @click="$emit('close')" class="w-full py-2 bg-primary hover:bg-blue-600 rounded text-sm transition">
        确定
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAIConfigStore } from '@/stores/aiConfig'
defineProps<{ visible: boolean }>()
defineEmits<{ close: [] }>()
const store = useAIConfigStore()
</script>
