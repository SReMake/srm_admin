import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/ApiInstance'
import NotFoundView from '@/views/NotFoundView.vue'
import type { ResourcesVo } from '@/__generated/model/static'
const views = import.meta.glob('../views/**/*.vue')

// 缓存键名
const ROUTE_CACHE_KEY = 'app_dynamic_routes'

// 缓存相关工具函数
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

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { unRequiresAuth: true },
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children: [],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
function loadDynamicRouter(elements: ResourcesVo[]) {
  const home = router.getRoutes().filter((item) => item.path === '/home')[0]
  elements.forEach((element) => {
    if (element.type === 'VIEW') {
      const component = views[element.resources]
      if (component) {
        const route = {
          id: element.id,
          path: element.path,
          name: element.name,
          parentId: element.parentId,
          component,
        }
        if (!element.parentId || element.parentId === 0) {
          home.children.push(route)
        }
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
  const cachedRoutes = routeCache.load()
  if (to.path !== '/login' && !loadRouter && cachedRoutes) {
    loadRouter = true
    loadDynamicRouter(cachedRoutes)
    next({ ...to })
    // 如果是从登入页面到其他页面
  } else if (to.path !== '/login' && !cachedRoutes) {
    loadRouter = true
    // //获取动态路由
    const res = await api.resourcesController.listResources()
    if (res.code === 200) {
      loadDynamicRouter(res.data)
      routeCache.save(res.data)
    }
    next({ ...to })
  } else {
    next()
  }
})

function clearRouteCache() {
  routeCache.clear()
  router.clearRoutes()
  routes.forEach((r) => {
    router.addRoute(r)
  })
  loadRouter = false
}

export { router, clearRouteCache }
