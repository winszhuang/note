<template>
  <div id="splitter" :class="className"></div>
</template>

<script>
import { onMounted } from 'vue';
import commonDomEffect from './commonDomEffect';

export default {
  name: 'Splitter',
  emits: ['getMouseOffset', 'stopMouseMove'],
  props: ['className'],
  setup(props, { emit }) {
    const { getMouseOffsetByClickElAndMove } = commonDomEffect();

    const returnMouseOffset = (offset) => {
      emit('getMouseOffset', offset);
    };

    const stopMouseMove = () => {
      emit('stopMouseMove');
    };

    onMounted(() => {
      const splitter = document.getElementById('splitter');
      const {
        mouseDown,
        mouseMove,
        mouseUp,
      } = getMouseOffsetByClickElAndMove();

      splitter.addEventListener('mousedown', (e) => {
        mouseDown(e, (offset) => { returnMouseOffset(offset); });
      });
      document.addEventListener('mousemove', (e) => {
        mouseMove(e, (offset) => { returnMouseOffset(offset); });
      });
      document.addEventListener('mouseup', (e) => {
        mouseUp(e, stopMouseMove);
      });

      return {
        mouseDown,
        mouseMove,
        mouseUp,
      };
    });
  },
};
</script>

<style lang="scss" scoped>

</style>
