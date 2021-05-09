<template>
  <div class="ms-2"
        v-for="(childBlockId, index) in block.content"
        :key="childBlockId">
    <p>{{ index + 1 }}. </p>
    <P :block="getBlockById(childBlockId)"/>
  </div>
</template>

<script>
import {
  computed, onMounted, // nextTick,
} from 'vue';
import { useStore } from 'vuex';
import P from './P.vue';

export default {
  name: 'NumberList',
  component: { P },
  props: ['block'],
  setup(props) {
    console.log(props.block);
    const store = useStore();
    onMounted(() => {
      const id = new Date().getTime().toString(); // 創一個新的blockId
      store.commit('addBlock', {
        typeName: 'p',
        id,
      });
      store.commit('editBlockData', {
        id: props.block.id, // 此處id為父集id
        value: [id],
      });
    });
    const getBlockById = (id) => computed(() => store.getters.choosePage(id));

    return { getBlockById };
  },
};
</script>

<style lang="scss">
</style>
