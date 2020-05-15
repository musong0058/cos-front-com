import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import permissions from './permission';
import request from './request';
import title from './title';

Vue.use(VueRouter);
require('nprogress/nprogress.css');

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/dashboard/square',
    component: () => import(/* webpackChunkName: 'basic-layout' */ '@/layouts/BasicLayout.vue'),
    children: [
      {
        path: '',
        name: 'square',
        meta: {
          title: 'Home',
          skipAuth: true
        },
        component: () => import(/* webpackChunkName: 'square' */ '@/views/square/List.vue')
      },
      {
        path: '/bounty',
        name: 'bounty',
        meta: {
          title: 'Bounty',
          skipAuth: true
        },
        component: () => import(/* webpackChunkName: 'bounty' */ '@/views/bounty/List.vue')
      },
      {
        path: '/startup/new',
        name: 'newStartup',
        meta: {
          title: 'New Startup'
        },
        component: () => import(/* webpackChunkName: 'newStartup' */ '@/views/startup/New.vue')
      },
      {
        path: '/startup/setting',
        name: 'settingStartup',
        meta: {
          title: 'Setting Startup'
        },
        component: () =>
          import(/* webpackChunkName: 'newStartup' */ '@/views/startup/SettingStartUp.vue')
      },
      {
        path: '/exchange',
        name: 'exchange',
        meta: {
          title: 'Exchange',
          skipAuth: true
        },
        component: () => import(/* webpackChunkName: 'exchange' */ '@/views/exchange/List.vue')
      },
      {
        path: '/governace',
        name: 'governace',
        meta: {
          title: 'Governace',
          skipAuth: true
        },
        component: () => import(/* webpackChunkName: 'governace' */ '@/views/governace/List.vue')
      },
      {
        path: '/startup/setting',
        name: 'startupSetting',
        meta: {
          title: 'Startup Setting'
        },
        component: () =>
          import(/* webpackChunkName: 'startupSetting' */ '@/views/startup/Setting.vue')
      }
    ]
  },
  {
    path: '*',
    component: {
      render: h => h('div', '404')
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),
  linkActiveClass: 'active',
  routes
});

// 路由回调注入
const routerInjections = {
  before: [permissions.before, request.before],
  after: [title.after]
};

// 页面跳转前
router.beforeEach((to, from, next) => {
  let passed = true;
  for (const func of routerInjections.before) {
    func(to, from, (...args) => {
      if (args) {
        passed = false;
        NProgress.start();
        next(...args);
      }
    });
    if (!passed) {
      break;
    }
  }
  if (passed) {
    NProgress.start();
    next();
  }
});

// 页面跳转后
router.afterEach((to, from) => {
  for (const func of routerInjections.after) {
    func(to, from);
  }
  NProgress.done();
});

export default router;
