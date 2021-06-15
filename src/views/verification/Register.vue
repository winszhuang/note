<template>
  <VerificationPage>
    <template #title>
      <div class="verify-title">註冊</div>
      <div class="verify-subtitle">請輸入email以及密碼</div>
    </template>

    <template #input="{ update }">
      <div class="verify-input">
        <input type="text" placeholder="使用者暱稱" @input="update($event, 'name')">
      </div>
      <div class="verify-input">
        <input type="text" placeholder="user@gmail.com" @input="update($event, 'email')">
      </div>
      <div class="verify-input">
        <input type="text" placeholder="密碼" @input="update($event, 'password')">
      </div>
    </template>

    <template #check="{ verify }">
      <button class="w-100 btn btn-lg btn-primary mb-3"
              type="button"
              @click="verify"
          >註冊</button>
    </template>

    <template #bottom>
      <div class="d-flex justify-content-center">
        <div class="info-bottom w-50">
          <hr>
          <router-link to="/signin">
            <div type="button" class="info-bottom-text mb-1">已經有帳號 ? 登入帳號</div>
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
  name: 'Register',
  components: {
    VerificationPage,
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';
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
    a{
      text-decoration: none;
    }
  }
}
</style>
