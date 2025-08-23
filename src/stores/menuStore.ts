import { defineStore } from 'pinia';
import { h, type Component} from 'vue'
import { NIcon, type MenuOption } from 'naive-ui'; // 根据实际导入路径调整
import {
  Book20Regular as BookIcon,
} from '@vicons/fluent'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const useMenuStore= defineStore('menu', () => {
  const menuOptions :MenuOption[] = [
     {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: renderIcon(BookIcon)
  },
    // ... existing code ...
    // 这里将包含原来在App.vue中的菜单选项数组内容
  ];

  return { menuOptions };
});
