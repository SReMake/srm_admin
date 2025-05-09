import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/authStore'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
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
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (!to.meta.unRequiresAuth && !authStore.token) {
    next('/login') // 若需要认证且 token 不存在，重定向到登录页
  } else if (to.path === '/login' && authStore.token) {
    next('/')
  } else {
    next() // 正常跳转
  }
})
export default router
