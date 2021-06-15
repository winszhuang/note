<template>
  <main class="fullscreen d-flex justify-content-center align-items-center">
    <div>
      <form class="text-center">
        <slot name="title">
        </slot>

        <slot name="input" :update="update">
        </slot>

        <slot name="check" :verify="verifyUserInput">
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

        <slot name="bottom" :userInput="userInput" :update="update">
        </slot>
      </form>
    </div>
  </main>
</template>

<script>
// import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { reactive } from 'vue';
// import { useStore } from 'vuex';
import {
  // signIn,
  // signOut,
  loginBySocialThen,
} from '../../store/firebaseAuth';
import {
// queryEmailFromFS,
// addUserToFS,
// getDataByCollectionFromFS,
} from '../../store/firestore';

export default {
  name: 'VerificationPage',
  components: {
    FontAwesomeIcon,
  },
  setup(props, { emit }) {
    // const store = useStore();
    const userInput = reactive({
      name: '',
      email: '',
      password: '',
    });

    const closeLogin = () => {
      emit('close', 1);
    };

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

    const update = (event, type) => {
      userInput[type] = event.target.value;
      console.log(userInput.email);
    };

    return {
      closeLogin,
      userInput,
      socialLogin,
      update,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/color.scss';

form {
  min-width: 300px;
}

@media (max-width: 400px) {
  form {
    min-width: 270px;
  }
}

.brand{
  color: rgb(97, 97, 97);
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
  display: inline-block;
  margin-top: 5rem;
  color: #5f5f5f;
  &-text{
    color: #afafaf;
    // color: #8a8a8a;
    &:hover{
      color: #c0c0c0;
    }
  }
}

.text-light{
  color: #da1f1f;
}
</style>
