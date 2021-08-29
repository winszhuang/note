<template>
  <div class="tooltiptext">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'Tooltip',
  props: ['text'],
  setup() {

  },
};
</script>

<style lang="scss" scoped>
.tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  position: absolute;
  z-index: 10;
}

</style>
