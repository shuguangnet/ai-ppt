import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AIConfig, ImageConfig } from '@/types/slides'

export const useAIConfigStore = defineStore('aiConfig', () => {
  const apiKey = ref('')
  const baseUrl = ref('')
  const model = ref('')

  // 图片 API 配置
  const imageApiKey = ref('')
  const imageProvider = ref<'pexels' | 'unsplash'>('pexels')

  const isConfigured = computed(() => !!apiKey.value && !!baseUrl.value)

  function getConfig(): AIConfig | undefined {
    if (!apiKey.value) return undefined
    return { apiKey: apiKey.value, baseUrl: baseUrl.value, model: model.value }
  }

  function getImageConfig(): ImageConfig | undefined {
    if (!imageApiKey.value) return undefined
    return { apiKey: imageApiKey.value, provider: imageProvider.value }
  }

  return { apiKey, baseUrl, model, imageApiKey, imageProvider, isConfigured, getConfig, getImageConfig }
})
