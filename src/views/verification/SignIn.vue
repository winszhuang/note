<template>
  <VerificationPage>
    <template #title>
      <div class="verify-title">登入</div>
      <div class="verify-subtitle">請輸入email以及密碼</div>
    </template>

    <template #input="{ update }">
      <div class="verify-input">
        <input type="text" placeholder="user@gmail.com" @input="update($event, 'email')">
      </div>
      <div class="verify-input">
        <input type="text" placeholder="password" @input="update($event, 'password')">
      </div>
    </template>

    <template #check="{ userInput }">
      <button class="w-100 btn btn-lg btn-primary mb-3"
              type="button"
              @click="signUp(userInput.email, userInput.password)"
          >登入</button>
    </template>

    <template #bottom>
      <div class="d-flex justify-content-center">
        <div class="info-bottom w-50">
          <hr>
          <router-link :to="'/register'">
            <div type="button" class="info-bottom-text mb-1">還沒有帳號 ? 創建帳號</div>
          </router-link>
          <div type="button" class="info-bottom-text">忘記密碼?</div>
          <hr>
        </div>
      </div>
    </template>
  </VerificationPage>
</template>

<script>
// import { ref } from 'vue';
// import { reactive } from 'vue';
import VerificationPage from './VerificationPage.vue';

export default {
  name: 'SignIn',
  components: {
    VerificationPage,
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_verification.scss';

.info-bottom{
  display: inline-block;
  margin-top: 5rem;
  color: #5f5f5f;
  a{
    text-decoration: none;
  }
  &-text{
    color: #afafaf;
    // color: #8a8a8a;
    &:hover{
      color: #c0c0c0;
    }
  }
}
</style>
