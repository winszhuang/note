<template>
  <main class="fullscreen d-flex justify-content-center align-items-center">
    <form class="text-center">
      <div class="verify-title">登入</div>
      <div class="verify-subtitle">請輸入email以及密碼</div>
      <!-- {{ isShowError }} -->
      <div :class="{ 'verify-input': true, 'error-border': errorMessage.email !== '' }">
        <input type="text" placeholder="user@gmail.com" autocomplete
            v-model="userInput.email" spellcheck="false">
        <div class="error-message">{{ errorMessage.email }}</div>
      </div>

      <div :class="{ 'verify-input': true, 'error-border': errorMessage.password !== '' }">
        <input type="password" placeholder="password" autocomplete
            v-model="userInput.password" spellcheck="false">
        <div class="error-message">{{ errorMessage.password }}</div>
      </div>

      <button class="w-100 btn btn-lg btn-primary mb-4"
            type="button"
            @click="checkAndSignIn"
        >登入</button>

      <div class=" mb-2" style="color: #5f5f5f;">從其他地方登入</div>
      <div class="d-flex justify-content-center mb-4">
        <div class="brand me-2" type="button" @click="socialLogin('google')">
          <font-awesome-icon :icon="['fab', 'google-plus-square']" size="2x"/>
        </div>
        <div class="brand me-2" type="button">
          <font-awesome-icon :icon="['fab', 'facebook-square']"
                size="2x"/>
        </div>
        <div class="brand me-2" type="button">
          <font-awesome-icon :icon="['fab', 'twitter-square']"
                size="2x"/>
        </div>
      </div>

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
    </form>
  </main>
</template>

<script>
// import { watchEffect } from 'vue';
import userVerifyEffect from './userVerifyEffect';
import { signIn } from '../../store/firebaseAuth';
// import { auth } from '../../store/firebase';

export default {
  name: 'SignIn',
  components: {
  },
  setup() {
    const {
      userInput,
      socialLogin,
      errorMessage,
      watchErrorMessage,
    } = userVerifyEffect();

    watchErrorMessage();

    const checkAndSignIn = async () => {
      try {
        const result = await signIn(userInput.email, userInput.password);
        console.log(result);
      } catch (error) {
        if (error.code === 'auth/invalid-email') {
          errorMessage.email = '錯誤的email格式';
        }
        if (error.code === 'auth/user-not-found') {
          errorMessage.email = '沒有使用者資料，請先註冊';
        }
        if (error.code === 'auth/wrong-password') {
          errorMessage.password = '密碼輸入錯誤';
        }
      }
    };

    return {
      userInput,
      socialLogin,
      checkAndSignIn,
      errorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_verification.scss';

</style>
