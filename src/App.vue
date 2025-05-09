<template>
  <n-config-provider :theme="theme">
    <n-card>
      <n-space>
        <n-button @click="toggleTheme(darkTheme)"> 深色 </n-button>
        <n-button @click="toggleTheme(null)"> 浅色 </n-button>
      </n-space>
    </n-card>
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts">
import { RouterView } from 'vue-router'
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { defineComponent, ref } from 'vue'

const theme = ref<GlobalTheme | null>(null)
export default defineComponent({
  setup() {
    return {
      RouterView,
      darkTheme,
      theme,
      toggleTheme(changeTheme: GlobalTheme | null) {
        theme.value = changeTheme
        if (changeTheme === darkTheme) {
          const root = document.documentElement
          root.style.setProperty('--color-background', 'var(--vt-c-black)')
          root.style.setProperty('--color-background-soft', 'var(--vt-c-black-soft)')
          root.style.setProperty('--color-background-mute', 'var(--vt-c-black-mute)')
          root.style.setProperty('--color-border', 'var(--vt-c-divider-dark-2)')
          root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-dark-1)')
          root.style.setProperty('--color-heading', 'var(--vt-c-text-dark-1)')
          root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
        } else if (changeTheme === null) {
          const root = document.documentElement
          root.style.setProperty('--color-background', 'var(--vt-c-white)')
          root.style.setProperty('--color-background-soft', 'var(--vt-c-white-soft)')
          root.style.setProperty('--color-background-mute', 'var(--vt-c-white-mute)')
          root.style.setProperty('--color-border', 'var(--vt-c-divider-light-2)')
          root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-light-1)')
          root.style.setProperty('--color-heading', 'var(--vt-c-text-light-1)')
          root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
        }
      },
    }
  },
})
</script>
<style scoped></style>
