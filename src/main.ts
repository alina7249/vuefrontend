import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from 'vue-toastification'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import './index.css'
import 'vue-toastification/dist/index.css'

// 导入页面组件
import Home from './pages/Home.vue'
import PhotoDetail from './pages/PhotoDetail.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'
import Profile from './pages/Profile.vue'
import ProfileCenter from './pages/ProfileCenter.vue'
import ProfileWorks from './pages/ProfileWorks.vue'
import ProfileMaterials from './pages/ProfileMaterials.vue'
import ProfileMembership from './pages/ProfileMembership.vue'
import ProfileBenefits from './pages/ProfileBenefits.vue'
import ProfileSettings from './pages/ProfileSettings.vue'
import ProfileEvents from './pages/ProfileEvents.vue'
import ProfileOrders from './pages/ProfileOrders.vue'
import ProfileEditor from './pages/ProfileEditor.vue'
import Community from './pages/Community.vue'
import Resources from './pages/Resources.vue'
import EquipmentDatabase from './pages/EquipmentDatabase.vue'
import EquipmentReview from './pages/EquipmentReview.vue'
import EquipmentTrade from './pages/EquipmentTrade.vue'
import OnlineCourses from './pages/OnlineCourses.vue'
import TutorialResources from './pages/TutorialResources.vue'
import OfflineEvents from './pages/OfflineEvents.vue'
import PhotographyContests from './pages/PhotographyContests.vue'
import PhotographerOrders from './pages/PhotographerOrders.vue'
import OneOnOneCoaching from './pages/OneOnOneCoaching.vue'
import PhotoComments from './pages/PhotoComments.vue'
import PhotoLocations from './pages/PhotoLocations.vue'
import BatchManagePhotos from './pages/BatchManagePhotos.vue'
import EquipmentLibrary from './pages/EquipmentLibrary.vue'

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/photo/:id', component: PhotoDetail },
    { path: '/photo-comments/:id', component: PhotoComments },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/profile/:id', component: Profile },
    { path: '/profile/:id/posts', component: Profile },
    { path: '/profile/:id/collections', component: Profile },
    { path: '/profile/:id/likes', component: Profile },
    { path: '/profile-center', component: ProfileCenter },
    { path: '/profile-center/works', component: ProfileWorks },
    { path: '/profile-center/batch-manage', component: BatchManagePhotos },
    { path: '/profile-center/photo-locations', component: PhotoLocations },
    { path: '/profile-center/materials', component: ProfileMaterials },
    { path: '/profile-center/membership', component: ProfileMembership },
    { path: '/profile-center/benefits', component: ProfileBenefits },
    { path: '/profile-center/settings', component: ProfileSettings },
    { path: '/profile-center/events', component: ProfileEvents },
    { path: '/profile-center/orders', component: ProfileOrders },
    { path: '/profile-center/editor', component: ProfileEditor },
    { path: '/profile-center/equipment', component: EquipmentLibrary },
    { path: '/community', component: Community },
    { path: '/resources', component: Resources },
    { path: '/search', component: OfflineEvents },
    { path: '/equipment-database', component: EquipmentDatabase },
    { path: '/equipment-review', component: EquipmentReview },
    { path: '/equipment-trade', component: EquipmentTrade },
    { path: '/online-courses', component: OnlineCourses },
    { path: '/tutorial-resources', component: TutorialResources },
    { path: '/offline-events', component: OfflineEvents },
    { path: '/photography-contests', component: PhotographyContests },
    { path: '/photographer-orders', component: PhotographerOrders },
    { path: '/one-on-one-coaching', component: OneOnOneCoaching },
    { path: '/:pathMatch(.*)*', component: () => import('@/components/Empty.vue') }
  ]
})

// 创建 Vue 应用
const app = createApp(App)

// 使用路由
app.use(router)

// 使用 Motion 动画插件
app.use(MotionPlugin)

// 使用 Toast 插件
app.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true,
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
})

// 挂载应用
app.mount('#app')