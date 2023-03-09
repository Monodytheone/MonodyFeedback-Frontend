import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
  {
    // 用户主界面
    path: '/',
    component: () => import('../views/home/Home.vue'),
  },
  {
    // 提交反馈页面
    path:'/submit',
    name: 'SubmitPage',
    component: () => import('../views/submitFeedback/SubmitPage.vue'),
  },
  {
    path: '/progress',
    name: 'ServiceProgressPage',
    component: () => import('@/views/serviceProgressPage/ServiceProgressPage.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
