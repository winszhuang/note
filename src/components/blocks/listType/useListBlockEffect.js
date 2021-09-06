import { computed } from 'vue';
import { useStore } from 'vuex';

const useListBlockEffect = () => {
  const store = useStore();

  const getPrevBlockById = (id) => computed(() => store.getters['blocks/getPrevBlockByid'](id));

  const isSameType = (block, block2) => block?.type === block2?.type;

  const isSameIndent = (blockA, blockB) => blockA?.content?.indent
    === blockB?.content?.indent;

  const isAIndentNoMoreThanB = (blockA, blockB) => blockA.content?.indent
    <= blockB.content?.indent;

  const addIndent = (block) => {
    const prevBlock = getPrevBlockById(block.id).value;
    if (!prevBlock) return;
    if (!isSameType(block, prevBlock)) return;

    if (isAIndentNoMoreThanB(block, prevBlock)) {
      const replaceContent = { ...block.content };
      replaceContent.indent += 1;

      store.commit('blocks/editBlockData', {
        id: block.id,
        key: 'content',
        value: replaceContent,
      });
    }
  };

  const subIndent = (block) => {
    if (block.content.indent > 0) {
      const replaceContent = { ...block.content };
      replaceContent.indent -= 1;

      store.commit('blocks/editBlockData', {
        id: block.id,
        key: 'content',
        value: replaceContent,
      });
    }
  };

  const handleIndent = (e, block) => {
    e.preventDefault();
    if (e.shiftKey) {
      subIndent(block);
    } else {
      addIndent(block);
    }
  };

  return {
    isSameType,
    isSameIndent,
    getPrevBlockById,
    isAIndentNoMoreThanB,
    handleIndent,
  };
};

export default useListBlockEffect;
