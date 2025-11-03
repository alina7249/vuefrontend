import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores'

// 懒加载路由组件
const Home = () => import('../pages/Home.vue')
const Login = () => import('../pages/Login.vue')
const Register = () => import('../pages/Register.vue')
const Profile = () => import('../pages/Profile.vue')
const ProfileCenter = () => import('../pages/ProfileCenter.vue')
const ProfileMembership = () => import('../pages/ProfileMembership.vue')
const PhotoDetail = () => import('../pages/PhotoDetail.vue')
const PhotoComments = () => import('../pages/PhotoComments.vue')
const Community = () => import('../pages/Community.vue')
const Resources = () => import('../pages/Resources.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile/:userId',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile-center',
    name: 'ProfileCenter',
    component: ProfileCenter,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile-center/membership',
    name: 'ProfileMembership',
    component: ProfileMembership,
    meta: { requiresAuth: true }
  },
  {
    path: '/photo/:photoId',
    name: 'PhotoDetail',
    component: PhotoDetail
  },
  {
    path: '/photo/:photoId/comments',
    name: 'PhotoComments',
    component: PhotoComments
  },
  {
    path: '/community',
    name: 'Community',
    component: Community
  },
  {
    path: '/resources',
    name: 'Resources',
    component: Resources
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 如果路由需要认证，但用户未登录
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 初始化认证状态（从localStorage读取）
    authStore.initializeAuth()
    
    // 再次检查认证状态
    if (!authStore.isAuthenticated) {
      // 重定向到登录页，并记录原始目标路径
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // 继续导航
  next()
})

export default router