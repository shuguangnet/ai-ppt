import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AIConfig } from '@/types/slides'

export const useAIConfigStore = defineStore('aiConfig', () => {
  const apiKey = ref('')
  const baseUrl = ref('')
  const model = ref('')

  const isConfigured = computed(() => !!apiKey.value && !!baseUrl.value)

  function getConfig(): AIConfig | undefined {
    if (!apiKey.value) return undefined
    return { apiKey: apiKey.value, baseUrl: baseUrl.value, model: model.value }
  }

  return { apiKey, baseUrl, model, isConfigured, getConfig }
})
