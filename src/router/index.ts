import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { vueRouters } from '@/utils/global'

const routes: Array<RouteRecordRaw> = [
  ...vueRouters()
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
