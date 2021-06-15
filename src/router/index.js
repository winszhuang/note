import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
// import Workspace from '../views/workspace/Workspace.vue';
// import Register from '../views/verification/Register.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    // component: () => import('../views/Home.vue'),
    component: Home,
  },
  {
    path: '/userinfo',
    name: 'UserInfo',
    component: () => import('../views/verification/UserInfo.vue'),
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('../views/verification/SignIn.vue'),
    // beforeEnter: (to, from, next) => {
    //   checkAuthState((user) => {
    //     if (user) {
    //       next({ name: 'Home' });
    //       return;
    //     }
    //     next();
    //   });
    // },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/verification/Register.vue'),
    // beforeEnter: (to, from, next) => {
    //   checkAuthState((user) => {
    //     if (user) {
    //       next({ name: 'Home' });
    //       return;
    //     }
    //     next();
    //   });
    // },
  },
  // {
  //   path: '/:id',
  //   name: 'Workspace',
  //   component: Workspace,
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => { // 每次跳轉業面執行
  const { name } = to;
  const { userInfo } = localStorage;
  if (userInfo) {
    console.log('已登入');
    if (name === 'SignIn' || name === 'Register') {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    console.log('未登入');
    if (name === 'SignIn' || name === 'Register') {
      next();
    } else {
      next({ name: 'SignIn' });
    }
  }

  // console.log(auth.currentUser);
  // if (auth.currentUser) {
  //   console.log('已登入');
  //   if (name === 'SignIn' || name === 'Register') {
  //     next({ name: 'Home' });
  //   } else {
  //     next();
  //   }
  // } else {
  //   console.log('未登入');
  //   if (name === 'SignIn' || name === 'Register') {
  //     next();
  //   } else {
  //     next({ name: 'SignIn' });
  //   }
  // }
  // const isUserInfoExist = computed(store.getters.isUserInfoExist);
  // console.log(isUserInfoExist);
  // const { name } = to;
  // if (!user) {
  //   console.log('未登入');
  //   if (name === 'SignIn' || name === 'Register') {
  //     next();
  //   } else {
  //     next({ name: 'SignIn' });
  //   }
  // } else {
  //   console.log('已登入');
  //   if (name === 'SignIn' || name === 'Register') {
  //     console.log('?????????????');
  //     next({ name: 'Home' });
  //   } else {
  //     next();
  //   }
  // }
});

export default router;
