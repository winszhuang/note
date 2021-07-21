<template>
  <div class="d-flex">
    <div class="prefix toggle-button" @click="toggleShowAndUpdateHiddenBlocks" type="button">
      <font-awesome-icon :icon="['fas', iconName]" :key="iconName" size="1x"/>
    </div>
    <P :block="block"/>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import P from './P.vue';
import { showEffect } from '../commonEffect';

export default {
  name: 'ToggleList',
  props: ['block'],
  components: { P },
  setup(props) {
    const store = useStore();
    const { isShow, toggleShow, handleShow } = showEffect();
    const iconName = computed(() => (isShow.value ? 'caret-down' : 'caret-right'));

    const toggleShowAndUpdateHiddenBlocks = () => {
      toggleShow();
      const childrenBlocksIds = props.block.blocks;
      if (isShow.value) {
        if (childrenBlocksIds.length === 0) return;
        store.commit('blocks/deleteIdsToHiddenBlocksIds', [...childrenBlocksIds]);
      } else {
        store.commit('blocks/addIdsToHiddenBlocksIds', [...childrenBlocksIds]);
      }
    };

    onMounted(() => {
      store.dispatch('blocks/addBlockInside', props.block);
      store.commit('blocks/addIdsToHiddenBlocksIds', [...props.block.blocks]);
      handleShow(false);
    });

    return {
      isShow,
      toggleShow,
      iconName,
      toggleShowAndUpdateHiddenBlocks,
    };
  },
};
</script>

<style lang="scss" scoped>
.toggle-button{
  &:hover{
    color: #777;
  }
}
</style>
