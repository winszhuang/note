<template>
  <main class="fullscreen d-flex justify-content-center align-items-center">
    <form class="text-center">
      <div class="verify-title">註冊</div>
      <div class="verify-subtitle">請輸入email以及密碼</div>

      <div :class="{ 'verify-input': true, 'error-border': errorMessage.name !== '' }">
        <input type="text" placeholder="使用者暱稱" autocomplete
            v-model="userInput.name" spellcheck="false">
        <div class="error-message">{{ errorMessage.name }}</div>
      </div>
      <div :class="{ 'verify-input': true, 'error-border': errorMessage.email !== '' }">
        <input type="email" placeholder="user@gmail.com" autocomplete
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
            @click="checkAndSignUp"
        >註冊</button>

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
          <router-link to="/signin">
            <div type="button" class="info-bottom-text mb-1">已經有帳號 ? 登入帳號</div>
          </router-link>
          <div type="button" class="info-bottom-text">忘記密碼?</div>
          <hr>
        </div>
      </div>
    </form>
  </main>
</template>

<script>
import { useRouter } from 'vue-router';
import userVerifyEffect from './userVerifyEffect';
import { signUp } from '../../store/firebaseAuth';
import { setUserDataToFS } from '../../store/firestore';
// import { auth } from '../../store/firebase';

export default {
  name: 'Register',
  components: {
  },
  setup() {
    const router = useRouter();
    const {
      userInput,
      socialLogin,
      errorMessage,
      watchErrorMessage,
    } = userVerifyEffect();

    watchErrorMessage();

    const checkAndSignUp = async () => {
      if (userInput.name === '') {
        errorMessage.name = '請輸入暱稱';
      }
      if (userInput.email === '') {
        errorMessage.email = '請輸入email';
      }
      if (userInput.password === '') {
        errorMessage.password = '請輸入密碼';
      }
      try {
        const result = await signUp(userInput.email, userInput.password);
        await setUserDataToFS({
          userInfo: {
            email: userInput.email,
            headshot: '',
            name: userInput.name,
            recentPageIds: [],
          },
          pages: [],
          blocks: [],
        });
        console.log(result);
        console.log('註冊成功');
        router.push('/signin');
      } catch (error) {
        console.log(error);
        if (error.code === 'auth/invalid-email') {
          errorMessage.email = '錯誤的email格式';
        }
        if (error.code === 'auth/user-not-found') {
          errorMessage.email = '沒有使用者資料，請先註冊';
        }
        if (error.code === 'auth/wrong-password') {
          errorMessage.password = '密碼輸入錯誤';
        }
        if (error.code === 'auth/weak-password') {
          errorMessage.password = '至少需要輸入6個字元';
        }
      }
    };

    return {
      userInput,
      socialLogin,
      checkAndSignUp,
      errorMessage,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/_verification.scss';

</style>
