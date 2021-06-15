<template>
  <div class="userfield bb" type="button">
    <div class="userfield-icon" v-html="headshot"></div>
    <div class="userfield-info">
      <div class="userfield-info-name">{{ userInfo?.name || '遊客' }}</div>
      <div class="userfield-info-email">{{ userInfo?.email || 'xxx.gmail.com' }}</div>
    </div>
  </div>
  <!-- {{ userInfo }} -->
</template>

<script>
import { computed, toRefs } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'UserField',
  setup() {
    const store = useStore();
    const { userInfo } = toRefs(store.state);

    const headshot = computed(() => {
      if (userInfo.value.headshot) {
        return `<img src="${userInfo.value.headshot}">`;
      }
      return 'C';
    });

    return { userInfo, headshot };
  },
};
</script>

<style lang="scss">
@import '../../style/color.scss';
.userfield{
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
    &-name{
      font-size: 1.1rem;
      font-weight: bold;
      line-height: 1.3rem;
      margin-top: .2rem;
      color: #C4C1BF;
    }
    &-email{
      // margin-left: .1rem;
      // font-size: 1rem;
      transform: scale(.8);
      transform-origin: left;
      color: #7a7a7a;
      text-decoration: underline;
      text-decoration-color: #b8b8b8;
    }
  }

}
</style>
