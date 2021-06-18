import { reactive, watchEffect } from 'vue';
import { loginBySocialThen } from '../../store/firebaseAuth';

const userVerifyEffect = () => {
  const userInput = reactive({
    name: '',
    email: '',
    password: '',
  });

  const errorMessage = reactive({
    name: '',
    email: '',
    password: '',
  });

  const socialLogin = async (social) => {
    try {
      await loginBySocialThen(social);
    } catch (error) {
      console.log(error);
      if (error.code === 'auth/operation-not-allowed') {
        console.log(`${social}登入失敗`);
      }
    }
  };

  const watchErrorMessage = () => watchEffect(() => {
    if (userInput.email.length === 1 && errorMessage.email !== '') {
      errorMessage.email = '';
    }
    if (userInput.password.length === 1 && errorMessage.password !== '') {
      errorMessage.password = '';
    }
    if (userInput.name.length === 1 && errorMessage.name !== '') {
      errorMessage.name = '';
    }
  });

  return {
    userInput,
    socialLogin,
    errorMessage,
    watchErrorMessage,
  };
};

export default userVerifyEffect;
