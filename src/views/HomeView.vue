<template>
  <n-message-provider>
    <n-layout class="h-screen">
      <n-layout-header bordered>
        <div class="h-15 flex justify-between">
          <div class="justify-center flex items-center gap-4 pl-8">
            <span class="text-2xl font-bold">SRM管理系统</span>
          </div>
          <div class="justify-center flex items-center gap-4 pr-8">
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
          </div>
        </div>
      </n-layout-header>
      <n-layout class="h-[calc(100%-var(--spacing)*25-2px)]" has-sider>
        <n-layout-sider
          :collapsed="collapsed"
          :collapsed-width="12"
          show-trigger
          @collapse="collapsed = true"
          @expand="collapsed = false"
          bordered
          class="h-full"
          content-style="padding: 10px;"
        >
          <n-menu
            :collapsed="collapsed"
            class="h-full"
            ref="menuInstRef"
            v-model:value="activeKey"
            :root-indent="36"
            :indent="12"
            :options="useMenuStore().menuOptions"
          />
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;"> <RouterView /> </n-layout-content>
      </n-layout>
      <n-layout-footer bordered class="h-10 w-full">
        <div class="items-center text-center leading-10 w-full h-full">
          SRM管理系统 · Made by <a href="https://github.com/langbiantianya">lbty</a>
        </div></n-layout-footer
      >
    </n-layout>
  </n-message-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { DarkTheme24Regular } from '@vicons/fluent'
import { RouterView, useRouter, type Router } from 'vue-router'
import { darkTheme, type MenuInst } from 'naive-ui'
import { router as rt } from '@/router'
import { useMenuStore } from '@/stores/menuStore'
import type { Store } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { clearRouteCache } from '@/router'
import { useThemeStore } from '@/stores/themeStore'
import { useRouterStore } from '@/stores/routerStore'
const active = ref(false)
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
export default defineComponent({
  components: {
    DarkTheme24Regular,
  },
  setup() {
    const menuInstRef = ref<MenuInst | null>(null)
    const activeKey = ref<string | null>(null)
    authStore = useAuthStore()
    router = useRouter()
    const handleChange = (changeTheme: boolean) => {
      if (changeTheme) {
        useThemeStore().updateTheme(darkTheme)
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
        useThemeStore().updateTheme(null)
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
    const showMenuCallBack = (key: undefined) => {
      setTimeout(() => {
        if (menuInstRef.value) {
          menuInstRef.value.showOption(key)
        } else {
          showMenuCallBack(key)
        }
      }, 200)
    }
    onMounted(async () => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark') {
        handleChange(true)
        active.value = true
      }
      if (rt.currentRoute.value.path === '/home') {
        activeKey.value = 'home'
      } else {
        useRouterStore().data.forEach((r) => {
          if (r.path === rt.currentRoute.value.path) {
            activeKey.value = r.id
            showMenuCallBack(r.id)
          }
        })
      }
    })

    return {
      menuInstRef,
      collapsed: ref(false),
      activeKey,
      useMenuStore,
      RouterView,
      darkTheme,
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
      authStore,
      handleSelect(key: string | number) {
        switch (key) {
          case 'profile':
            console.log('用户资料')
            break
          case 'logout':
            authStore.removeToken()
            clearRouteCache()
            router.replace('/login')
            break
        }
      },
      handleChange,
      active,
    }
  },
})
</script>
