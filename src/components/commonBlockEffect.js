import { computed } from 'vue';
import { useStore } from 'vuex';

const commonBlockEffect = () => {
  const store = useStore();

  // 當前level屬於第幾層
  const getLevelOfBlock = (thisBlock) => {
    const level = { value: 0 };
    const block = { value: thisBlock };

    while (block.value.parentId !== '') {
      block.value = computed(() => store.getters.chooseBlock(block.value.parentId)).value;
      level.value += 1;
    }

    return level.value;
  };

  return { getLevelOfBlock };
};

export default commonBlockEffect;
