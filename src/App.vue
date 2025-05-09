<template>
  <n-config-provider :theme="theme">
    <n-card class="app_nav_card">
      <n-switch v-model:value="active" size="medium" @update:value="handleChange">
        <template #icon>
          <n-icon>
            <DarkTheme24Regular />
          </n-icon>
        </template>
      </n-switch>
    </n-card>
    <n-message-provider>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts">
import { DarkTheme24Regular } from '@vicons/fluent'
import { RouterView } from 'vue-router'
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { defineComponent, ref, onMounted } from 'vue'
const active = ref(false)
const theme = ref<GlobalTheme | null>(null)
export default defineComponent({
  components: {
    DarkTheme24Regular,
  },
  setup() {
    // 页面挂载时从 localStorage 读取主题配置
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        handleChange(true)
        active.value = true
      }
    })

    const handleChange = (changeTheme: boolean) => {
      if (changeTheme) {
        theme.value = darkTheme
        const root = document.documentElement
        root.style.setProperty('--color-background', 'var(--vt-c-black)')
        root.style.setProperty('--color-background-soft', 'var(--vt-c-black-soft)')
        root.style.setProperty('--color-background-mute', 'var(--vt-c-black-mute)')
        root.style.setProperty('--color-border', 'var(--vt-c-divider-dark-2)')
        root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-dark-1)')
        root.style.setProperty('--color-heading', 'var(--vt-c-text-dark-1)')
        root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
        // 保存深色主题到 localStorage
        localStorage.setItem('theme', 'dark')
        active.value = true
      } else {
        theme.value = null
        const root = document.documentElement
        root.style.setProperty('--color-background', 'var(--vt-c-white)')
        root.style.setProperty('--color-background-soft', 'var(--vt-c-white-soft)')
        root.style.setProperty('--color-background-mute', 'var(--vt-c-white-mute)')
        root.style.setProperty('--color-border', 'var(--vt-c-divider-light-2)')
        root.style.setProperty('--color-border-hover', 'var(--vt-c-divider-light-1)')
        root.style.setProperty('--color-heading', 'var(--vt-c-text-light-1)')
        root.style.setProperty('--color-text', 'var(--vt-c-text-dark-2)')
        // 保存浅色主题到 localStorage
        localStorage.setItem('theme', 'light')
        active.value = false
      }
    }

    return {
      active,
      RouterView,
      darkTheme,
      theme,
      handleChange,
    }
  },
})
</script>
<style scoped>
.app_nav_card {
  height: 50px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: flex-end; /* 垂直顶部对齐 */
}
</style>
