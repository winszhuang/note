<template>
  <router-view/>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { checkAuthState } from './store/firebaseAuth';
import { getUserDataByEmailFromFS, updateStoreToFS } from './store/firestore';
import {
  isDataInLS,
  setDataToLS,
  getDataFromLS,
  deleteDataFromLS,
} from './store/localStorageEffect';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

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
        setDataToLS(key, data[key]);
      });
    };

    checkAuthState((user) => {
      const isSignInOrOut = user ? 'signin' : 'signout';
      console.log(user);
      console.log(user ? '登入狀態喔' : '未登入狀態');
      const signinProcedure = async () => {
        const userData = { value: {} };
        const userInfo = getDataFromLS('userInfo');

        if (userInfo && userInfo.email === user.email) {
          userData.value = {
            pages: getDataFromLS('pages'),
            blocks: getDataFromLS('blocks'),
            groups: getDataFromLS('groups'),
            userInfo: getDataFromLS('userInfo'),
          };
        } else {
          try {
            const result = await getUserDataByEmailFromFS(user.email);
            console.log(result);
            if (!result) {
              const info = {
                name: user.displayName,
                email: user.email,
                headshot: user.photoURL,
                pageHistory: '',
              };
              userData.value = { userInfo: info };
            } else {
              userData.value = result;
            }
          } catch (error) {
            console.log(error);
          }
          setUserDataToLS(userData.value);
        }

        setUserDataToStore(userData.value);
        console.log(store.state.userInfo);

        if (route.path === '/signin' || route.path === '/register') {
          console.log('跳到首頁');
          router.push('/');
        }
      };

      const signoutProcedure = async () => {
        if (isDataInLS('userInfo')) {
          try {
            await updateStoreToFS();
          } catch (error) {
            console.log(error);
          }
          store.dispatch('resetStoreData');
          deleteDataFromLS('pages');
          deleteDataFromLS('blocks');
          deleteDataFromLS('groups');
          deleteDataFromLS('userInfo');
        }
        router.push('/signin');
      };

      const actions = {
        signin: signinProcedure,
        signout: signoutProcedure, // 一律在刪除localstorage裡面的user資料前，先上傳到FS
      };

      actions[isSignInOrOut]();
    });

    onMounted(() => {
      if (window.innerWidth < 992) {
        store.commit('setSidebarCollapse', true);
        store.commit('setSidebarFloating', true);
      } else {
        store.commit('setSidebarFloating', false);
        store.commit('setSidebarCollapse', true);
      }
      store.commit('setWindowWidth', window.innerWidth);

      window.addEventListener('resize', () => {
        store.commit('setWindowWidth', window.innerWidth);
      });
    });
  },
};
</script>
