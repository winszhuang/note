<template>
  <div class="dividing-content">
    <div class="dividing-line"

        :id="block.id"></div>
  </div>
</template>

<script>
export default {
  name: 'DividingLine',
  props: ['block'],
};
</script>

<style lang="scss" scoped>
.dividing{
  &-content{
    display: flex;
    align-items: center;
    height: 1rem;
  }
  &-line{
    height: .05rem;
    width: 100%;
    background: #e7e6e1;
  }
}

</style>
