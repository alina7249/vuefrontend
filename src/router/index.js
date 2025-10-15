import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
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
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
    },
    {
      path: '/post/:id',
      name: 'postDetail',
      component: () => import('../views/PostDetailView.vue'),
    },
    {
    path: '/tutorials',
    name: 'tutorials',
    component: () => import('../views/TutorialsView.vue'),
  },
  {
    path: '/equipment',
    name: 'equipment',
    component: () => import('../views/EquipmentView.vue'),
  },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivitiesView.vue'),
    },
    {
      path: '/photo/:id',
      name: 'photoDetail',
      component: () => import('../views/PhotoDetailView.vue'),
    },
  ]
})

// 添加全局前置路由守卫
router.beforeEach((to, from, next) => {
  const isLoggedInUser = isLoggedIn()
  
  // 如果已登录用户尝试访问登录或注册页面，重定向到首页
  if ((to.name === 'login' || to.name === 'register') && isLoggedInUser) {
    next({ name: 'home' })
  }
  // 如果未登录用户尝试访问受保护页面（除了登录和注册），重定向到登录页面
  else if (to.name !== 'login' && to.name !== 'register' && !isLoggedInUser) {
    next({ name: 'login' })
  }
  // 其他情况正常访问
  else {
    next()
  }
})

export default router
