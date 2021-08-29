<template>
  <div class="topfield">
    <div :class="{ userfield: true, 'p-0': isSidebarCollapse }" type="button"
        @click="linkToUserInfo">
        <!-- :style="{ padding: isSidebarCollapse ? '0' :  }" -->
      <div class="userfield-icon">
        <div :style="{ 'background-image': `url(${headshotURL});` }">C</div>
      </div>
      <div class="userfield-info">
        <div class="userfield-info-name">{{ userInfo?.name || '遊客' }}</div>
        <div class="userfield-info-email">{{ userInfo?.email || 'xxx.gmail.com' }}</div>
      </div>
    </div>
    <NinjaButton @clickThen="floatSidebar"
        :class-name="'left-collapse'"
        v-if="!isSidebarFloating">
      <template #default="{ isShow }">
        <div v-show="isShow">
          <font-awesome-icon :icon="['fas', 'angle-double-left']"/>
        </div>
      </template>
    </NinjaButton>
    <NinjaButton @clickThen="lockSidebar"
        :class-name="'left-collapse'"
        v-if="isSidebarFloating && isWindowWidthLarge()">
      <template #default="{ isShow }">
        <div v-show="isShow">
          <font-awesome-icon :icon="['fas', 'lock']"/>
        </div>
      </template>
    </NinjaButton>
  </div>
  <!-- {{ userInfo }} -->
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NinjaButton from '../../components/NinjaButton.vue';

export default {
  name: 'UserField',
  components: { NinjaButton },
  setup() {
    const store = useStore();
    const router = useRouter();
    const userInfo = computed(() => store.state.userInfo.userInfo);
    const isSidebarCollapse = computed(() => store.state.sidebarState.isCollapse);
    const isSidebarFloating = computed(() => store.state.sidebarState.isFloating);

    const isWindowWidthLarge = () => window.innerWidth > 992;

    const linkToUserInfo = () => {
      router.push('/userinfo');
    };

    const headshotURL = computed(() => {
      if (userInfo.value.headshot) {
        console.log(userInfo.value.headshot);
        return `${userInfo.value.headshot}`;
      }
      return 'https://image.flaticon.com/icons/png/512/3135/3135715.png';
    });

    const headshot = computed(() => {
      if (userInfo.value.headshot) {
        return `<img src="${userInfo.value.headshot}">`;
      }
      return '<img src="https://image.flaticon.com/icons/png/512/3135/3135715.png">';
    });

    const floatSidebar = () => {
      store.dispatch('floatSidebar');
    };

    const lockSidebar = () => {
      if (isSidebarCollapse.value === false) {
        store.commit('setSidebarCollapse', true);
      }
      store.dispatch('lockSidebar');
    };

    return {
      userInfo,
      headshot,
      headshotURL,
      floatSidebar,
      lockSidebar,
      isSidebarCollapse,
      isSidebarFloating,
      linkToUserInfo,
      isWindowWidthLarge,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../../style/component/sidebar/_sidebar-utils.scss';
.topfield{
  width: inherit;
  position: relative;
  margin-bottom: 1rem;
}
.userfield{
  box-sizing: border-box;
  width: inherit;
  display: flex;
  padding: 1.2rem 1rem 1rem 1.2rem;
  overflow: hidden;
  &-icon{
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    background: #c87a30;
    color: #ebebeb;
    margin-right: .5rem;
    font-size: 1.3rem;
    position: relative;
  }
  img{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  &-info{
    overflow-x: hidden;
    &-name{
      font-size: 1.1rem;
      font-weight: bold;
      line-height: 1.3rem;
      margin-top: .2rem;
      color: #afafaf;
    }
    &-email{
      transform: scale(.8);
      transform-origin: left;
      color: #8b8b8b;
      // text-decoration: underline;
      // text-decoration-color: #b8b8b8;
    }
  }
  &:hover{
    background: $item-hover-bc;
    color: $color;
  }
}

.left-collapse{
  color: $color;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover{
    background: $item-active-bc;
  }
}
</style>
