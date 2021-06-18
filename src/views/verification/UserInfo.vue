<template>
  <main class="fullscreen d-flex flex-column justify-content-center align-items-center">
    <img class="userinfo-img" :src="userInfo.headshot || 'https://image.flaticon.com/icons/png/512/3135/3135715.png' " alt="">
    <div class="userinfo-name">{{ userInfo.name }}</div>
    <div class="userinfo-email">{{ userInfo.email }}</div>
    <div class="userinfo-back" type="button" @click="goHome">回到首頁</div>
    <div type="button" class="signout" @click="signOutAndGoSignIn">登出</div>
  </main>
</template>

<script>
import { toRefs } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { signOut } from '../../store/firebaseAuth';

export default {
  name: 'UserInfo',
  components: {
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const { userInfo, pages, blocks } = toRefs(store.state);

    const signOutAndGoSignIn = () => {
      signOut();
    };

    const goHome = () => {
      router.push('/');
    };

    return {
      signOutAndGoSignIn,
      userInfo,
      pages,
      blocks,
      goHome,
    };
  },
};
</script>

<style lang="scss" scoped>
.userinfo{
  &-name{
    font-weight: 500;
    font-size: 2rem;
    color: #F1F0EA;
  }
  &-img{
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    box-shadow: .3rem .4rem .7rem 0rem rgb(41, 41, 41);
    margin-bottom: 1rem;
  }
  &-email{
    font-size: 12px;
    color: rgb(119, 119, 119);
    margin-bottom: 3rem;
  }
  &-title{
    font-size: .8rem;
    color: rgb(190, 190, 190);
    margin-bottom: .4rem;
  }
  &-content{
    font-size: 2.5rem;
    color: #F1F0EA;
    // margin-bottom: .4rem;
  }
  &-back{
    color: #b6b6b6;
    margin-bottom: .5rem;
    &:hover{
      color: #cccccc;
    }
  }
}
.signout{
  text-align: center;
  width: 5rem;
  border-radius: .9rem;
  background: #1B998B;
  font-weight: 700;
  color: rgb(44, 44, 44);
  box-shadow: .1rem .4rem .7rem .2rem rgb(48, 48, 48);
  &:hover{
    background: #1fb3a1;
  }
}
</style>
