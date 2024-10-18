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
      component: () => import('./pages/home.vue'),
    },
    {
      path: '/log',
      name: 'Log',
      component: () => import('./pages/log.vue'),
    },
    {
      path: '/options',
      name: 'Options',
      component: () => import('./pages/options.vue'),
    },
  ],
})

export default router
