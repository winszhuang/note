<template>
  <router-view/>
</template>

<script>
import SecureLS from 'secure-ls';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { checkAuthState } from './store/firebaseAuth';
import { getUserDataByEmailFromFS, updateStoreToFS } from './store/firestore';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const ls = new SecureLS();

    const routeToFrontPage = () => {
      if (route.path === '/signin' || route.path === '/register') {
        console.log('跳到首頁');
        router.push('/');
      }
    };

    const setUserDataToStore = (data) => {
      Object.keys(data).forEach((key) => {
        const value = data[key] || [];
        store.commit('setStoreData', {
          data: value,
          name: key,
        });
      });
    };

    const setUserDataToLS = (data) => {
      Object.keys(data).forEach((key) => {
        ls.set(key, data[key]);
      });
    };

    const isUserDataInLS = (user) => {
      const userInfo = ls.get('userInfo');
      if (userInfo && userInfo?.email === user.email) return true;
      return false;
    };

    const isUserDataInFS = async (user) => {
      try {
        const result = await getUserDataByEmailFromFS(user.email);
        if (result) return true;
        return false;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    const signinProcedure = async (user) => {
      if (isUserDataInLS(user)) {
        setUserDataToStore({
          pages: ls.get('pages'),
          blocks: ls.get('blocks'),
          userInfo: ls.get('userInfo'),
        });
        routeToFrontPage();
        return;
      }

      if (isUserDataInFS(user)) {
        const result = await getUserDataByEmailFromFS(user.email);
        setUserDataToStore(result);
        setUserDataToLS(result);
        routeToFrontPage();
        return;
      }

      console.log('資料庫沒有資料，請重新註冊');
      router.push('/register');
    };

    const signoutProcedure = async () => {
      if (ls.get('userInfo')) {
        try {
          await updateStoreToFS();
        } catch (error) {
          console.log(error);
        }
        store.dispatch('resetStoreData');
        ls.removeAll();
      }
      router.push('/signin');
    };

    checkAuthState((user) => {
      const isSignInOrOut = user ? 'signin' : 'signout';
      // console.log(user ? '登入狀態喔' : '未登入狀態');

      const actions = {
        signin: () => signinProcedure(user),
        signout: signoutProcedure, // 一律在刪除localstorage裡面的user資料前，先上傳到FS
      };

      actions[isSignInOrOut]();
    });
  },
};
</script>
