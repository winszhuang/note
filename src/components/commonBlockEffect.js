import { computed } from 'vue';
import { useStore } from 'vuex';
import { generateRandomString } from './commonEffect';

const commonBlockEffect = () => {
  const store = useStore();

  // 當前level屬於第幾層
  const getLevelOfBlock = (thisBlock) => {
    const level = { value: 0 };
    const block = { value: thisBlock };

    while (block.value.parentId !== '') {
      block.value = computed(() => store.getters['blocks/chooseBlock'](block.value.parentId)).value;
      level.value += 1;
    }

    return level.value;
  };

  const generateBlock = ({ type = 'p', content = '', group = '' }) => ({
    id: generateRandomString(),
    type,
    content,
    group,
    blocks: [],
    parentId: '',
    className: 'style-text-color__default',
  });

  return { getLevelOfBlock, generateBlock };
};

export default commonBlockEffect;
