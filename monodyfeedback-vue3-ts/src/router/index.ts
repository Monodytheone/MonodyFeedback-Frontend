import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    // 用户主界面
    path: '/',
    component: () => import('../views/home/Home.vue'),
  },
  {
    // 提交反馈页面
    path: '/submit',
    name: 'SubmitPage',
    component: () => import('../views/submitFeedback/SubmitPage.vue'),
  },
  {
    path: '/progress',
    name: 'ServiceProgressPage',
    component: () => import('@/views/serviceProgressPage/ServiceProgressPage.vue'),
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('@/views/loginPage/LoginPage.vue'),
  },
  {
    path: '/signUp',
    name: 'SignUpPage',
    component: () => import('@/views/signUpPage/SignUpPage.vue'),
  },
  {
    path: '/setAvatar',
    name: 'SetAvatarPage',
    component: () => import('@/views/setAvatarPage/SetAvatarPage.vue'),
  },
  {
    path: '/ChangePasswordWithoutUserNamePage',
    name: 'ChangePasswordWithoutUserNamePage',
    component: () => import('@/views/changePasswordPage/ChangePasswordWithoutUserNamePage.vue'),
  },
  {
    path: '/changePasswordWithUserNamePage',
    name: 'ChangePasswordWithUserNamePagee',
    component: () => import('@/views/changePasswordPage/ChangePasswordWithUserNamePage.vue'),
  },
  {
    path: '/processor',
    name: 'ProcessorHome',
    component: () => import('@/processorViews/home/ProcessorHome.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
