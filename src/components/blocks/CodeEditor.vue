<template>
  <div class="code-container" :style="{ height: `${editorHeight}px` }">
    <pre class='language-javascript'
        id="code-editor"
        :scrollLeft="scrollLeft"
        :style="{ height: `${editorHeight}px`,  }"
        ><code class='language-javascript' v-text="codeText"></code>
    </pre>
    <ContentEditable
      :placeholder="placeholderInfo"
      :id="block.id"
      :className="'editor'"
      :value="block.content.text"
      @input="editCodeText"
      @keydown="tabAction"
      @paste="pasteAction"
      @focus="() => setFocusBlock(block.id)"
      @scroll="setScrollLeft"/>
  </div>
</template>

<script>
import Prism from 'prismjs';
import '../../style/prism.css';
import {
  // computed,
  nextTick,
  onMounted,
  ref,
  watch,
} from 'vue';
import ContentEditable from '../input/ContentEditable.vue';
import codeEditorEffect from '../codeEditorEffect';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'CodeEditor',
  props: ['block'],
  components: { ContentEditable },
  setup(props) {
    const placeholderInfo = '輸入或貼上code...\ntab鍵往前縮排、shift + tab往後縮排\n搭配反白文字範圍可以多行縮排';

    const {
      editBlockData,
      setFocusBlock,
    } = commonUpdateEffect();

    const {
      handleIndent,
      handlePaste,
      generateTextAndWrapNodes,
    } = codeEditorEffect();

    const scrollLeft = ref('');
    const setScrollLeft = (e) => {
      scrollLeft.value = e.target.scrollLeft;
    };

    const editorHeight = ref(0);
    const setEditorHeight = (height) => {
      editorHeight.value = height;
    };

    const codeText = ref('');
    const setCodeText = (text) => {
      codeText.value = text;
    };

    const updateCodeTextAndEditorHeight = (container) => {
      nextTick(() => {
        setCodeText(container.innerText);
        setEditorHeight(container.getBoundingClientRect().height);
      });
    };

    const tabAction = (e) => {
      if (e.key !== 'Tab') return;
      handleIndent(e);
      updateCodeTextAndEditorHeight(e.currentTarget);
    };

    const pasteAction = (e) => {
      handlePaste(e);
      updateCodeTextAndEditorHeight(e.currentTarget);
    };

    const changeToMultiNode = (container) => {
      if (container.childNodes.length > 1) return;
      const fragment = generateTextAndWrapNodes(container.innerText);
      container.replaceChildren();
      container.appendChild(fragment);
    };

    onMounted(() => {
      const editor = document.getElementById(props.block.id);
      changeToMultiNode(editor);

      updateCodeTextAndEditorHeight(editor);
    });

    const editCodeText = (e) => {
      const container = e.target;
      updateCodeTextAndEditorHeight(container);
    };

    watch(codeText, (curr) => {
      nextTick(() => {
        Prism.highlightAll();
        editBlockData(props.block.id, {
          text: curr,
          html: curr,
        }, 'content');
      });
    });

    const languages = [
      'Javascript',
      'Css',
      'Sass',
      'Scss',
      'SQL',
      'C-like',
      'HTML',
      'Arduino',
      'C',
      'C#',
      'C++',
      'Java',
      'Kotlin',
      'Python',
    ];

    return {
      placeholderInfo,
      scrollLeft,
      setScrollLeft,
      editorHeight,
      tabAction,
      pasteAction,
      handlePaste,
      languages,
      codeText,
      editCodeText,
      setFocusBlock,
      // handleCodeEditInKeyDown,
    };
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&display=swap');

$code-font: 'Courier New', Courier, monospace;
// pre和code標籤都要放同樣的字體
.language-javascript {
  margin: 0;
  font-family:$code-font;
}

.code-container {
  position: relative;
}

.editor {
  z-index: 1;
  font-family:$code-font;

  color: rgba($color: #000000, $alpha: 0.3);
  color: transparent;
  background-color: transparent;
  caret-color: black;

  overflow: auto;
  // top: 200px !important;
}

#code-editor {
  z-index: 0;
  overflow: hidden !important;
  code {
    overflow: auto;
  }
}

.editor, #code-editor {
  padding: 1rem;
  width: 100%;

  white-space: pre;

  font-size: 1rem;
  line-height: 1.5rem;
  // letter-spacing: .1rem;

  position: absolute;
  top: 0;
  left: 0;

  min-height: 100px;
}

</style>
