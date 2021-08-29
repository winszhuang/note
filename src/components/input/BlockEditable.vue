<template>
    <ContentEditable
        :placeholder="placeholder"
        :className="className"
        :id="noId ? '' : block.id"
        :value="block.content.text"
        @input="inputToBlockContent"
        @focus="focusToBlock"
        @keydown.stop="keydownAction"
        @paste.stop="pasteBlocksAction"/>
</template>

<script>
// import { computed } from 'vue';
// import { useStore } from 'vuex';
import ContentEditable from './ContentEditable.vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  components: { ContentEditable },
  name: 'BlockEditable',
  props: ['block', 'placeholder', 'className', 'noId'],
  setup(props) {
    const {
      editBlockData,
      setFocusBlock,
      pasteBlocksAction,
      checkKeydownInBlockContent,
    } = commonUpdateEffect();

    const inputToBlockContent = (e) => {
      // console.log(e.target.innerText);
      editBlockData(props.block.id, {
        text: e.target.innerText,
        html: e.target.innerHTML,
      }, 'content');
    };

    const keydownAction = (e) => {
      checkKeydownInBlockContent(props.block, e);
    };

    const focusToBlock = () => {
      setFocusBlock(props.block.id);
    };

    return {
      inputToBlockContent,
      keydownAction,
      focusToBlock,
      pasteBlocksAction,
      // unFocusToBlock,
    };
  },
};
</script>
