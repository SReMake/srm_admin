import { defineStore } from 'pinia'
import { h, ref, type Component, type Ref } from 'vue'
import { NIcon, type MenuOption } from 'naive-ui' // 根据实际导入路径调整
import { Home28Regular as HomeIcon } from '@vicons/fluent'
import { RouterLink } from 'vue-router'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
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
      icon: renderIcon(HomeIcon),
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
        icon: renderIcon(HomeIcon),
      },
    ]
  }
  return { menuOptions, addMenu, clearMenu, addMenus, }
})
