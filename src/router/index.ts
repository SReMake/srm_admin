import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/LoginPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
  ],
})

export default router
// 移除关于 /about 路由的配置
// {
//   path: '/about',
//   name: 'about',
//   component: () => import('../views/AboutView.vue'),
// },
// ],
// })
//
// export default router
