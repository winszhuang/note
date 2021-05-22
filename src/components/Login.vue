<template>
  <teleport to='#app'>
    <main class="form-signin d-flex justify-content-center align-items-center">
      <button type="button" class="btn-close close" aria-label="Close"></button>
      <div>
        <form class="text-center">
          <slot name="title">
          </slot>

          <slot name="input" :userInfo="userInfo" :update="update">
          </slot>

          <slot name="check" :userInfo="userInfo" :update="update">
          </slot>

          <slot> <!--預設內容-->
            <div class=" mb-2" style="color: #5f5f5f;">從其他地方登入</div>
            <div class="d-flex justify-content-center mb-4">
              <div class="brand me-2" type="button" @click="socialLogin('google')">
                <font-awesome-icon :icon="['fab', 'google-plus-square']" size="2x"/>
              </div>
              <div class="brand me-2" type="button" @click="socialLogin('facebook')">
                <font-awesome-icon :icon="['fab', 'facebook-square']"
                      size="2x"/>
              </div>
              <div class="brand me-2" type="button" @click="socialLogin('twitter')">
                <font-awesome-icon :icon="['fab', 'twitter-square']"
                      size="2x"/>
              </div>
            </div>
          </slot>
          <div class="d-flex justify-content-center align-items-center info-bottom">
            <span type="button" class="font-small" @click="signUp">創建帳號</span>
            <div class="ms-2 me-2 fs-4 font-small">|</div>
            <span type="button" class="font-small">忘記密碼?</span>
          </div>
        </form>
      </div>
    </main>
  </teleport>
</template>

<script>
// import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { reactive } from 'vue';
import {
  // signIn,
  // signOut,
  signUp,
  loginBySocialThen,
} from '../store/firebase';

export default {
  name: 'Login',
  props: ['id'],
  emits: ['close'],
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    const userInfo = reactive({
      email: '',
      password: '',
    });

    const closeLogin = () => {
      emit('close', 1);
    };

    const socialLogin = (social) => {
      loginBySocialThen(social, ({ user }) => {
        console.log(user.email, user.displayName);
        closeLogin();
      });
    };

    const update = (event, type) => {
      userInfo[type] = event.target.value;
      console.log(userInfo.email);
    };

    // const changeToSignUp = () => {

    // }

    return {
      closeLogin,
      userInfo,
      signUp,
      socialLogin,
      update,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../style/color.scss';

form {
  min-width: 300px;
}

@media (max-width: 400px) {
  form {
    min-width: 270px;
  }
}

.form-signin {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // max-width: 330px;
  padding: 15px;
  margin: auto;
  z-index: 4;
  background: $coffee;
}

.font-small{
  color: #8a8a8a;
  &:hover{
    color: #a0a0a0;
  }
}

.brand{
  color: rgb(116, 116, 116);
  &:hover{
    // border: .2rem solid #272727;
    // background: #222222;
    color: $persian-green;
  }
}

.close{
  position: inherit;
  right: 2rem;
  top: 1rem;
  font-size: 1.5rem;
  color: #919191;
  &:hover{
    color: #5f5f5f;
  }
}

.info-bottom{
  margin-top: 4rem;
  &::hover{
    color: #da1f1f;
  }
}

.text-light{
  color: #da1f1f;
}
</style>
