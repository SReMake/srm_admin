import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  // 添加 token 状态
  const token = ref('')

  function increment() {
    count.value++
  }

  // 返回 token
  return { count, doubleCount, increment, token }
})
