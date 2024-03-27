/**
 * @file router
 */

import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/options',
      name: 'Options',
      component: () => import('./views/Options.vue'),
    },
  ],
})

export default router
