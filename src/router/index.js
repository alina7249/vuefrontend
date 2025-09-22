import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserCenterView from '../views/UserCenterView.vue'
import GrowthBenefitsView from '../views/GrowthBenefitsView.vue'
import UserHomeView from '../views/UserHomeView.vue'
import RegisterView from '../views/RegisterView.vue'

// 模拟登录状态存储
const isLoggedIn = () => {
  // 在实际应用中，这里应该检查localStorage或cookie中的登录状态
  return localStorage.getItem('isLoggedIn') === 'true'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: UserHomeView,
    },
    {
      path: '/growth',
      name: 'growth',
      component: GrowthBenefitsView,
    },
    {
      path: '/member',
      name: 'member',
      component: UserCenterView,
    },
    {
      path: '/learn',
      name: 'learn',
      component: () => import('../views/LearnView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
  ],
]
})

// 添加全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 需要登录才能访问的页面
  const requiresAuth = ['user', 'growth', 'member', 'learn']
  
  // 检查是否需要登录
  if (requiresAuth.includes(to.name) && !isLoggedIn()) {
    // 如果未登录且需要登录，则跳转到登录页面
    next({ name: 'login' })
  } else {
    // 如果已登录或不需要登录，则继续访问
    next()
  }
})

export default router
