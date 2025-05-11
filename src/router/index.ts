import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/ApiInstance'

const views = import.meta.glob('../views/**/*.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { unRequiresAuth: true },
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})
// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (!to.meta.unRequiresAuth && !authStore.token) {
    next('/login') // 若需要认证且 token 不存在，重定向到登录页
  } else if (to.path === '/login' && authStore.token) {
    next('/')
  }
  // 如果是从登入页面到其他页面
  if ((from.path === '/login' && to.path !== '/login') || (to.path === '/' && from.path === '/')) {
    router.getRoutes().forEach((element) => {
      if (element.name !== 'login' && element.name !== 'home') {
        return router.removeRoute(element.name)
      }
    })

    // //获取动态路由
    const res = await api.resourcesController.listResources()
    if (res.code === 200) {
      res.data.forEach((element) => {
        if (element.type === 'VIEW') {
          const component = views[`../views/${element.name}.vue`]
          if (component) {
            const route = {
              path: element.resource,
              name: element.name,
              component,
            }
            router.addRoute(route)
          } else {
            console.warn(`未找到对应的组件: ../views/${element.name}.vue`)
          }
        }
      })
    }
  }
  // 判断跳转目标页面是否存在，不存在就重定向到404页面
  
  next()
})
export default router
