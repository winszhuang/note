<template>
    <ContentEditable
        :placeholder="placeholder"
        :className="className"
        :id="noId ? '' : page.id"
        :value="page.name"
        @input="inputToPageContent"
        @keydown="keydownAction"
        @focus="focusEvent"/>
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
    const { editPageData, checkKeydownInPageData, getFocusBlock } = commonUpdateEffect();

    const inputToPageContent = (e) => {
      editPageData('name', e.target.innerHTML);
    };

    const keydownAction = (e) => {
      checkKeydownInPageData(props.page, e);
    };

    const focusEvent = () => {
      getFocusBlock('');
    };

    return {
      inputToPageContent,
      keydownAction,
      focusEvent,
    };
  },
};
</script>
