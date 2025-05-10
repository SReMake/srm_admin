<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-flex v-if="showHeader" justify="end" class="app_nav_card">
        <n-switch v-model:value="active" size="medium" @update:value="handleChange">
          <template #icon>
            <n-icon>
              <DarkTheme24Regular />
            </n-icon>
          </template>
        </n-switch>
        <n-dropdown :options="options" @select="handleSelect">
          <n-avatar
            size="medium"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </n-dropdown>
      </n-flex>
      <RouterView />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts">
import { DarkTheme24Regular } from '@vicons/fluent'
import { RouterView } from 'vue-router'
import type { GlobalTheme } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import { defineComponent, ref, onMounted, type Ref, onRenderTriggered, provide } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, type Router } from 'vue-router'
import type { Store } from 'pinia'
const showHeader = ref(true)
let router: Router
let authStore: Store<
  'auth',
  Pick<
    {
      token: Ref<string | null, string | null>
      isLogin: Ref<boolean, boolean>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    'token' | 'isLogin'
  >,
  Pick<
    {
      token: Ref<string | null, string | null>
      isLogin: Ref<boolean, boolean>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    never
  >,
  Pick<
    {
      token: Ref<string | null, string | null>
      isLogin: Ref<boolean, boolean>
      setToken: (newToken: string) => void
      removeToken: () => void
    },
    'setToken' | 'removeToken'
  >
>
const active = ref(false)
const theme = ref<GlobalTheme | null>(null)
function triggerHeader() {
  if (router.currentRoute.value.name === 'login') {
    showHeader.value = false
  } else {
    showHeader.value = true
  }
}

export default defineComponent({
  components: {
    DarkTheme24Regular,
  },
  setup() {
    // 页面挂载时从 localStorage 读取主题配置
    onRenderTriggered(() => {
      if (router.currentRoute.value.name === 'login') {
        showHeader.value = false
      } else {
        showHeader.value = true
      }
    })
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      authStore = useAuthStore()
      router = useRouter()
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
        root.style.setProperty('--color-text', 'var(--vt-c-text-light-2)')
        // 保存浅色主题到 localStorage
        localStorage.setItem('theme', 'light')
        active.value = false
      }
    }
    provide('triggerHeader', triggerHeader)
    return {
      showHeader,
      active,
      RouterView,
      authStore,
      darkTheme,
      theme,
      handleChange,
      options: [
        {
          label: '用户资料',
          key: 'profile',
        },
        {
          label: '退出登录',
          key: 'logout',
        },
      ],
      handleSelect(key: string | number) {
        switch (key) {
          case 'profile':
            console.log('用户资料')
            break
          case 'logout':
            authStore.removeToken()
            router.replace('/login')
            break
        }
      },
    }
  },
})
</script>
<style scoped>
.app_nav_card {
  height: 50px;
  line-height: 50px;
  padding-right: 20px;
  align-items: center; /* 垂直顶部对齐 */
  border-bottom: 1px solid var(--color-border);
}
</style>
