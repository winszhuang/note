<template>
  <router-view/>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { checkAuthState } from './store/firebaseAuth';
import { isDataInLS, setDataToLS, deleteDataFromLS } from './store/localStorageEffect';
// import userInfoEffect from './views/verification/userInfoEffect';
import { getUserDataByEmailFromFS } from './store/firestore';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const setUserDataToStore = (data) => {
      Object.keys(data).forEach((key) => {
        store.commit('setStoreData', {
          data: data[key],
          name: key,
        });
      });
    };

    checkAuthState((user) => {
      const isSignInOrOut = user ? 'signin' : 'signout';
      // console.log(user);
      console.log(user ? '登入狀態喔' : '未登入狀態');

      const signinProcedure = async () => {
        try {
          const userData = { value: {} };
          const result = await getUserDataByEmailFromFS(user.email);

          if (!result) {
            const userInfo = {
              name: user.displayName,
              email: user.email,
              headshot: user.photoURL,
            };
            userData.value = { userInfo };
          } else {
            userData.value = result;
          }
          setUserDataToStore(userData.value);

          if (!isDataInLS('userInfo')) {
            setDataToLS('userInfo', userData.value.userInfo);
          }

          if (route.path === '/signin' || route.path === '/register') {
            console.log('跳到首頁');
            router.push('/');
          }
        } catch (error) {
          console.log(error);
        }
      };

      const signoutProcedure = () => {
        if (isDataInLS('userInfo')) {
          deleteDataFromLS('userInfo');
        }
        store.commit('deleteUserInfo');
        router.push('/signin');
      };

      const actions = {
        signin: signinProcedure,
        signout: signoutProcedure, // 一律在刪除localstorage裡面的user資料前，先上傳到FS
      };

      actions[isSignInOrOut]();
    });
  },
};
</script>
