import { defineStore } from 'pinia'
import { h, ref, type Ref } from 'vue'
import { type MenuOption } from 'naive-ui' // 根据实际导入路径调整
import { RouterLink } from 'vue-router'

// 缓存键名

export const useMenuStore = defineStore('menu', () => {
  const menuOptions: Ref<MenuOption[]> = ref([
    {
      label: () =>
        h(
          RouterLink,
          {
            to: '/home',
          },
          { default: () => '资源大盘' },
        ),
      key: 'home',
    },
  ])
  function addMenu(menu: MenuOption) {
    const menus = menuOptions.value
    menus.push(menu)
    menuOptions.value = menus
  }
  function addMenus(menu: MenuOption[]) {
    const menus = menuOptions.value
    menus.push(...menu)
    menuOptions.value = menus
  }
  function clearMenu() {
    menuOptions.value = [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: '/home',
            },
            { default: () => '资源大盘' },
          ),
        key: 'go-back-home',
      },
    ]
  }
  return { menuOptions, addMenu, clearMenu, addMenus }
})
