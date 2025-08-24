import { defineStore } from 'pinia'
import { h, type Component } from 'vue'
import { NIcon, type MenuOption } from 'naive-ui' // 根据实际导入路径调整
import { Book20Regular as BookIcon } from '@vicons/fluent'
import { RouterLink } from 'vue-router'
import { api } from '@/ApiInstance'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
// 缓存键名
const ROUTE_CACHE_KEY = 'app_dynamic_routes'
const routeCache = {
  // 保存路由到本地缓存
  save(routes: any[]) {
    try {
      localStorage.setItem(ROUTE_CACHE_KEY, JSON.stringify(routes))
    } catch (error) {
      console.error('保存路由缓存失败', error)
    }
  },

  // 从缓存读取路由
  load() {
    try {
      const cached = localStorage.getItem(ROUTE_CACHE_KEY)
      return cached ? JSON.parse(cached) : null
    } catch (error) {
      console.error('读取路由缓存失败', error)
      return null
    }
  },

  // 清除路由缓存
  clear() {
    localStorage.removeItem(ROUTE_CACHE_KEY)
  },
}

export const useMenuStore = defineStore('menu', () => {
  const menuOption = async () => {
    const menuOptions: MenuOption[] = [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: {
                name: 'home',
                params: {},
              },
            },
            { default: () => '回家' },
          ),
        key: 'go-back-home',
        icon: renderIcon(BookIcon),
      },
      // ... existing code ...
      // 这里将包含原来在App.vue中的菜单选项数组内容
    ]
    // 从缓存或者接口获取
    let res = routeCache.load()
    if (!res) {
      const tmp = await api.resourcesController.listResources()
      if (tmp.code === 200) {
        res = tmp.data
      }
    }

    if (res) {
      res.forEach((element) => {
        menuOptions.push({
          label: () =>
            h(
              RouterLink,
              {
                to: {
                  name: element.name,
                  params: {},
                },
              },
              { default: () => element.name },
            ),
          key: 'go-back-home',
          icon: renderIcon(BookIcon),
        })
      })
    }
    return menuOptions
  }

  return { menuOption }
})
