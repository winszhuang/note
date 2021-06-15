<template>
    <ContentEditable
        :placeholder="placeholder"
        :className="className"
        :id="noId ? '' : block.id"
        :value="block.content"
        @input="inputToBlockContent"
        @keydown="keydownAction"
        @focus="focusToBlock"/>
</template>

<script>
import commonUpdateEffect from '../../views/commonUpdataEffect';
import ContentEditable from './ContentEditable.vue';

export default {
  components: { ContentEditable },
  name: 'BlockEditable',
  props: ['block', 'placeholder', 'className', 'noId'],
  setup(props) {
    const { editBlockData, getFocusBlock, checkKeydownInBlockContent } = commonUpdateEffect();

    const inputToBlockContent = (e) => {
      editBlockData(props.block.id, e.target.innerHTML);
    };

    const keydownAction = (e) => {
      checkKeydownInBlockContent(props.block, e);
    };

    const focusToBlock = () => {
      getFocusBlock(props.block.id);
    };

    return {
      inputToBlockContent,
      keydownAction,
      focusToBlock,
    };
  },
};
</script>
