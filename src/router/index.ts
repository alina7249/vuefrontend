import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: () => import('@/pages/Home.vue') },
  { path: '/photo/:id', name: 'PhotoDetail', component: () => import('@/pages/PhotoDetail.vue') },
  { path: '/photo-comments/:id', name: 'PhotoComments', component: () => import('@/pages/PhotoComments.vue') },
  { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue') },
  { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue') },
  { path: '/profile/:id', name: 'Profile', component: () => import('@/pages/Profile.vue') },
  { path: '/profile/:id/posts', name: 'ProfilePosts', component: () => import('@/pages/Profile.vue') },
  { path: '/profile/:id/collections', name: 'ProfileCollections', component: () => import('@/pages/Profile.vue') },
  { path: '/profile/:id/likes', name: 'ProfileLikes', component: () => import('@/pages/Profile.vue') },
  { path: '/profile-center', name: 'ProfileCenter', component: () => import('@/pages/ProfileCenter.vue') },
  { path: '/profile-center/batch-manage', name: 'BatchManagePhotos', component: () => import('@/pages/BatchManagePhotos.vue') },
  { path: '/profile-center/works', name: 'ProfileWorks', component: () => import('@/pages/ProfileWorks.vue') },
  { path: '/profile-center/photo-locations', name: 'PhotoLocations', component: () => import('@/pages/PhotoLocations.vue') },
  { path: '/profile-center/materials', name: 'ProfileMaterials', component: () => import('@/pages/ProfileMaterials.vue') },
  { path: '/profile-center/membership', name: 'ProfileMembership', component: () => import('@/pages/ProfileMembership.vue') },
  { path: '/profile-center/benefits', name: 'ProfileBenefits', component: () => import('@/pages/ProfileBenefits.vue') },
  { path: '/profile-center/settings', name: 'ProfileSettings', component: () => import('@/pages/ProfileSettings.vue') },
  { path: '/profile-center/events', name: 'ProfileEvents', component: () => import('@/pages/ProfileEvents.vue') },
  { path: '/profile-center/orders', name: 'ProfileOrders', component: () => import('@/pages/ProfileOrders.vue') },
  { path: '/profile-center/editor', name: 'ProfileEditor', component: () => import('@/pages/ProfileEditor.vue') },
  { path: '/profile-center/equipment', name: 'EquipmentLibrary', component: () => import('@/pages/EquipmentLibrary.vue') },
  { path: '/community', name: 'Community', component: () => import('@/pages/Community.vue') },
  { path: '/resources', name: 'Resources', component: () => import('@/pages/Resources.vue') },
  { path: '/search', name: 'Search', component: () => import('@/pages/SearchResult.vue') },
  { path: '/equipment-database', name: 'EquipmentDatabase', component: () => import('@/pages/EquipmentDatabase.vue') },
  { path: '/equipment-review', name: 'EquipmentReview', component: () => import('@/pages/EquipmentReview.vue') },
  { path: '/equipment-trade', name: 'EquipmentTrade', component: () => import('@/pages/EquipmentTrade.vue') },
  { path: '/online-courses', name: 'OnlineCourses', component: () => import('@/pages/OnlineCourses.vue') },
  { path: '/tutorial-resources', name: 'TutorialResources', component: () => import('@/pages/TutorialResources.vue') },
  { path: '/offline-events', name: 'OfflineEvents', component: () => import('@/pages/OfflineEvents.vue') },
  { path: '/photography-contests', name: 'PhotographyContests', component: () => import('@/pages/PhotographyContests.vue') },
  { path: '/photographer-orders', name: 'PhotographerOrders', component: () => import('@/pages/PhotographerOrders.vue') },
  { path: '/one-on-one-coaching', name: 'OneOnOneCoaching', component: () => import('@/pages/OneOnOneCoaching.vue') },
  // fallback
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFound.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
