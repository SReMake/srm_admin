import { createRouter, createWebHistory, RouterLink } from 'vue-router'
import MainView from '../views/MainView.vue'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/ApiInstance'
import NotFoundView from '@/views/NotFoundView.vue'
import type { ResourcesVo } from '@/__generated/model/static'
import type { MenuOption } from 'naive-ui'
import { h } from 'vue'
import { useMenuStore } from '@/stores/menuStore'
const views = import.meta.glob('../views/**/*.vue')
import { useRouterStore } from '@/stores/routerStore'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { unRequiresAuth: true },
  },
  {
    path: '/',
    name: 'main',
    component: MainView,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
        children: [],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
function loadDynamicRouter(elements: ResourcesVo[]) {
  const home = router.getRoutes().filter((item) => item.path === '/')[0]
  elements.forEach((element) => {
    if (element.type === 'VIEW') {
      const component = views[element.resources]
      if (component) {
        const route = {
          id: element.id,
          path: element.path,
          parentId: element.parentId,
          component,
        }
        // if (!element.parentId || element.parentId === 0) {
        home.children.push(route)
        // }
      } else {
        console.warn(`未找到对应的组件: ${element.resources}`)
      }
    }
  })
  router.addRoute(home)
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: '404',
    component: NotFoundView,
  })
  useMenuStore().clearMenu()
  useMenuStore().addMenus(convertToMenuStructure(elements))
}
function convertToMenuStructure(elements: ResourcesVo[]): MenuOption[] {
  // 筛选顶层节点 (parentId 为 null 或 0)
  const topLevelElements = elements.filter((element) => !element.parentId || element.parentId === 0)

  // 递归构建菜单结构
  const buildMenu = (nodes: ResourcesVo[]): MenuOption[] => {
    return nodes.map((element) => {
      // 找到当前节点的子节点
      const children = elements.filter((item) => item.parentId === element.id)

      // 处理label: VIEW类型且有path时使用RouterLink
      let label: string | (() => { default: () => string })
      if (element.type === 'VIEW' && element.path) {
        label = () => h(RouterLink, { to: element.path }, { default: () => element.name })
      } else {
        label = element.name
      }

      // 基础节点结构
      const menuNode: MenuOption = {
        label,
        key: element.id,
      }

      // 处理子节点：只有Menu类型才使用group包装
      if (children.length > 0) {

          // 非Menu类型：直接添加子节点
          menuNode.children = buildMenu(children)

      }
      return menuNode
    })
  }

  return buildMenu(topLevelElements)
}

let loadRouter = false
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!to.meta.unRequiresAuth && !authStore.token) {
    next('/login') // 若需要认证且 token 不存在，重定向到登录页
  } else if (to.path === '/login' && authStore.token) {
    next('/home')
  }

  // 从缓存读取路由
  if (to.path !== '/login' && !loadRouter && useRouterStore().data.length != 0) {
    loadRouter = true
    loadDynamicRouter(useRouterStore().data)
    next({ ...to })
    // 如果是从登入页面到其他页面
  } else if (to.path !== '/login' && useRouterStore().data.length == 0) {
    loadRouter = true
    // //获取动态路由
    const res = await api.resourcesController.listResources()
    if (res.code === 200) {
      const rs = JSON.parse(JSON.stringify(res.data))
      loadDynamicRouter(rs)
      useRouterStore().update(rs)
    }
    next({ ...to })
  } else {
    next()
  }
})

function clearRouteCache() {
  useRouterStore().update([])
  router.clearRoutes()
  routes.forEach((r) => {
    router.addRoute(r)
  })
  loadRouter = false
}

export { router, clearRouteCache }
