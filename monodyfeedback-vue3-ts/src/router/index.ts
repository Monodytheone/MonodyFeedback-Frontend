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
    name: 'ChangePasswordWithUserNamePage',
    component: () => import('@/views/changePasswordPage/ChangePasswordWithUserNamePage.vue'),
  },
  {
    path: '/progress/submission',
    name: 'SubmissionDetialPage',
    component: () => import('@/views/SubmissionDetailsPage/SubmissionDetailsPage.vue'),
    props: route => ({
      submissionId: route.query.subid
    })
  },
  {
    path: '/processor/problems/submission',
    name: 'ProcessorSubmissionDetialPage',
    component: () => import('@/processorViews/ProcessorSubmissionDetailPage/ProcessorSubmissionDetailPage.vue'),
    props: route => ({
      submissionId: route.query.subid
    })
  },
  {
    path: '/processor',
    name: 'ProcessorHome',
    component: () => import('@/processorViews/home/ProcessorHome.vue'),
  },
  {
    path: '/processor/problems',
    name: 'ProblemListPage',
    component: () => import('@/processorViews/ProblemListsPage/ProblemListPage.vue'),
    props: route => ({activeNumber: route.query.active})
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
