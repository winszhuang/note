import { createRouter, createWebHistory } from 'vue-router';
import SecureLS from 'secure-ls';

const ls = new SecureLS();

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { requiresAuth: true },
    component: () => import('../views/Home.vue'),
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
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/verification/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => { // 每次跳轉頁面執行
  const { name } = to;

  if (ls.get('userInfo')) {
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
});

export default router;
