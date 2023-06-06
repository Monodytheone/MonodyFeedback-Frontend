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
    path: '/FAQPage',
    component: () => import('@/views/FAQPage/FAQPage.vue'),
    props: route => ({ pageId: route.query.pageId })
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
    props: route => ({ activeName: route.query.active })
  },

  {
    path: '/master',
    name: 'MasterHome',
    component: () => import('@/masterViews/masterHome/MasterHome.vue')
  },
  {
    path: '/masterLogin',
    component: () => import('@/masterViews/masterLoginPage/MasterLoginPage.vue')
  },
  {
    path: '/master/FAQ',
    component: () => import('@/masterViews/FAQManage/FAQManage.vue')
  },
  {
    path: '/master/Page',
    component: () => import('@/masterViews/pageManage/PageManage.vue'),
    props: route => ({ pageId: route.query.pageId })
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
