import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Slide, PptData } from '@/types/slides'

let uid = 0
const genId = () => `slide_${++uid}`

export const useSlidesStore = defineStore('slides', () => {
  const title = ref('未命名演示文稿')
  const theme = ref('dark')
  const slides = ref<Slide[]>([])
  const activeIndex = ref(0)

  const activeSlide = computed(() => slides.value[activeIndex.value])

  function loadFromAI(data: PptData) {
    title.value = data.title
    slides.value = data.slides.map(s => ({ ...s, id: genId() }))
    activeIndex.value = 0
  }

  function updateSlide(index: number, patch: Partial<Slide>) {
    slides.value[index] = { ...slides.value[index], ...patch }
  }

  function addSlide(after: number) {
    const s: Slide = { id: genId(), layout: 'content', title: '新页面', bullets: ['要点'] }
    slides.value.splice(after + 1, 0, s)
    activeIndex.value = after + 1
  }

  function removeSlide(index: number) {
    if (slides.value.length <= 1) return
    slides.value.splice(index, 1)
    if (activeIndex.value >= slides.value.length) activeIndex.value = slides.value.length - 1
  }

  function moveSlide(from: number, to: number) {
    const [item] = slides.value.splice(from, 1)
    slides.value.splice(to, 0, item)
    activeIndex.value = to
  }

  function toPptData(): PptData {
    return { title: title.value, theme: theme.value, slides: slides.value }
  }

  return { title, theme, slides, activeIndex, activeSlide, loadFromAI, updateSlide, addSlide, removeSlide, moveSlide, toPptData }
})
