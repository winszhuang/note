<template>
  <div class="user bb" type="button"
      @click="openUserInfoPage(true)"
  >
    <div class="user-icon">W</div>
    <div class="user-info">
      <div class="user-info-name">Wins</div>
      <div class="user-info-email">win4709hi@gmail.com</div>
    </div>
  </div>

  <Login :id="'exampleModal'" v-if="showUserInfo" @close="openUserInfoPage(false)">
    <template #title>
      <div class="fs-1 text-alabaster fw-light mb-4">
        註冊
      </div>
    </template>
    <template #input="{ update }">
      <div class="user-input">
        <input type="text" placeholder="user@gmail.com" @input="update($event, 'email')">
      </div>
      <div class="user-input">
        <input type="text" placeholder="password" @input="update($event, 'password')">
      </div>
    </template>
    <template #check="{ userInfo }">
      <button class="w-100 btn btn-lg btn-primary mb-4"
              type="button"
              @click="signUp(userInfo.email, userInfo.password)"
          >登入</button>
    </template>
  </Login>
</template>

<script>
import { ref } from 'vue';
import Login from '../../components/Login.vue';
import { commonLocalStorageEffect } from '../../components/commonEffect';

export default {
  name: 'UserInfo',
  components: { Login },
  setup() {
    const { getDataFromLS } = commonLocalStorageEffect();

    const showUserInfo = ref(false);

    const openUserInfoPage = (choose) => {
      const userData = getDataFromLS('userInfo');
      if (userData.email) {
        console.log(userData);
      }
      showUserInfo.value = choose;
    };

    return { openUserInfoPage, showUserInfo };
  },
};
</script>

<style lang="scss">
@import '../../style/color.scss';
.user{
  width: 100%;
  display: flex;
  padding: 1.2rem 1rem 1rem 1rem;
  margin-bottom: 1rem;
  &:hover{
    background: #4d454e;
  }
  &-icon{
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    background: #1B998B;
    color: #ebebeb;
    margin-right: .5rem;
    font-size: 1.3rem;
  }
  &-info{
    &-name{
      font-size: 1.2rem;
      font-weight: bold;
      line-height: 1.3rem;
      margin-top: .2rem;
      color: #C4C1BF;
    }
    &-email{
      margin-left: .1rem;
      font-size: .2rem;
      transform: scale(50%);
      color: #7a7a7a;
      text-decoration: underline;
      text-decoration-color: #b8b8b8;
    }
  }
  &-input{
    border: .05rem solid #777777;
    border-radius: .4rem;
    margin-bottom: 1rem;
    input{
      padding: 1rem;
      height: 4rem;
      color: #b9b9b9;
      // border-bottom: .1rem solid #5f5f5f;
      &::placeholder{
        color: #5f5f5f;
      }
    }
  }
}

.btn-color{
  background: $web-orange;
}

</style>
