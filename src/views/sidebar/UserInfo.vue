<template>
  <div class="user" type="button">
    <div class="user__icon">W</div>
    <div class="user__info">
      <div class="user__info__name">Wins</div>
      <div class="user__info__email">win4709hi@gmail.com</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
};
</script>

<style lang="scss">
.user{
  width: 100%;
  display: flex;
  padding: 1.2rem 1rem .7rem 1rem;
  border-bottom: .02rem solid #e4e4e4;
  margin-bottom: 1rem;
  &:hover{
    background: #ebebeb;
    // color: #787878;
  }
  &__icon{
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    background: #959595;
    color: #ebebeb;
    margin-right: .5rem;
    font-size: 1.3rem;
  }
  &__info{
    &__name{
      font-size: 1.2rem;
      font-weight: bold;
      line-height: 1.3rem;
      margin-top: .2rem;
      color: #3e3e3e;
    }
    &__email{
      margin-left: .1rem;
      font-size: .2rem;
      transform: scale(50%);
      color: #70bae4;
    }
  }
}
</style>
