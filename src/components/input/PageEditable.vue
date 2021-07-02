<template>
    <ContentEditable
        :placeholder="placeholder"
        :className="className"
        :id="noId ? '' : page.id"
        :value="page.name"
        @input="inputToPageContent"
        @keydown="keydownAction"
        @focus="setFocusBlock('')"/>
</template>

<script>
import commonUpdateEffect from '../../views/commonUpdataEffect';
import ContentEditable from './ContentEditable.vue';

export default {
  components: { ContentEditable },
  name: 'PageEditable',
  props: [
    'page',
    'placeholder',
    'className',
    'noId',
  ],
  setup(props) {
    const { editPageData, checkKeydownInPageData, setFocusBlock } = commonUpdateEffect();

    const inputToPageContent = (e) => {
      editPageData('name', e.target.innerHTML);
    };

    const keydownAction = (e) => {
      checkKeydownInPageData(props.page, e);
    };

    return {
      inputToPageContent,
      keydownAction,
      setFocusBlock,
    };
  },
};
</script>
