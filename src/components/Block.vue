<template>
  <div class="position-relative d-flex"
        @mouseover="hoverHandle(block.id)"
        @mouseout="hoverHandle('')"
  >
    <DragItem :block="block" v-show="isDragShow"/>
    <component
        :is="getFirstToUpper(block.type)"
        :block="block"
        >
    </component>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import commonEffect from '../views/commonEffect';
import DragItem from './DragItem.vue';
// import { useStore } from 'vuex';
// import { toRefs } from 'vue';

export default {
  name: 'Block',
  props: ['block'],
  components: { DragItem },
  setup() {
    const store = useStore();
    const { currentBlockIdOnMouse } = toRefs(store.state);
    const { getFirstToUpper } = commonEffect();
    const isDragShow = ref(false);

    const hoverHandle = (id) => {
      store.commit('changeCurrentBlockIdOnMouse', id);
      if (id === currentBlockIdOnMouse.value) {
        isDragShow.value = true;
      }
      if (id === '') {
        isDragShow.value = false;
      }
    };

    // const store = useStore();
    // const { blocks } = toRefs(store.state);

    return {
      getFirstToUpper,
      hoverHandle,
      currentBlockIdOnMouse,
      isDragShow,
    };
  },
};
</script>
