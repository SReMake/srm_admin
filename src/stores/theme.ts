import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<BuiltInGlobalTheme | null>(null)

  function updateTheme(newTheme: BuiltInGlobalTheme | null) {
    theme.value = newTheme
  }
  return {
    theme,
    updateTheme,
  }
})
