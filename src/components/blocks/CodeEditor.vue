<template>
  <!--只能一行，否則會有留白text-->
  <!-- eslint-disable-next-line max-len -->
  <pre class='language-javascript' id="code-editor"><code class='language-javascript' v-text="codeText"></code>
    <div class="code-input"
        :id="block.id"
        contenteditable="plaintext-only"
        spellcheck="false"
        @input="editCodeText($event)"
        @keydown="handleCodeEditInKeyDown($event)"></div>
  </pre>
  <!-- <div class="code-input"
        :id="block.id"
        contenteditable="plaintext-only"
        spellcheck="false"
        @input="editCodeText($event)"
        @keydown="handleCodeEditInKeyDown($event)"></div> -->
</template>

<script>
import Prism from 'prismjs';
import '../../style/prism.css';
import { nextTick, onMounted, ref } from 'vue';

export default {
  name: 'CodeEditor',
  props: ['block'],
  setup() {
    // const adjustCodeInputHeight = () => {

    // }
    onMounted(() => {
      Prism.highlightAll();
      const codeInput = document.querySelector('.code-input');
      const codeTag = codeInput.previousElementSibling;
      console.log(codeTag.clientHeight);
      if (codeTag.clientHeight < 40) {
        codeInput.style.height = '60px';
      } else {
        codeInput.style.height = `${codeTag.clientHeight}px`;
      }
      // console.log(editor.clientHeight);
    });

    const codeText = ref('');

    const editCodeText = (e) => {
      // console.log(e.target.textContent);
      // console.log(e.target.innerText);
      // console.log(e.target.innerText);
      codeText.value = e.target.innerText;
      nextTick(() => {
        Prism.highlightAll();
      });
      console.log(e.target.innerText);
    };

    const handleCodeEditInKeyDown = (e) => {
      // const el = document.getElementsByClassName('code-input')[0];
      // 處理tab
      if (e.keyCode === 9) {
        e.preventDefault();
        // const currentText = e.target.innerText;
        // const selection = window.getSelection();
        // console.log(selection);
        // console.log(selection.focusNode, selection.focusOffset);
        // if (selection.isCollapsed) { // 沒有選到的情況
        //   const divideIndex = selection.focusOffset;
        //   console.log(divideIndex);
        //   const last = currentText.substring(0, selection.anchorOffset);
        //   const next = currentText.substring(divideIndex, currentText.length);
        //   const newNode = document.createTextNode(`${last}  ${next}`);
        //   console.log(newNode);
        //   e.target.innerHTML = '';
        //   e.target.appendChild(newNode);
        //   selection.collapse(newNode, divideIndex + 2);
        //   // console.log(e.target.innerText);
        //   editCodeText(e);
        // }
      }
    };

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
      languages,
      codeText,
      editCodeText,
      handleCodeEditInKeyDown,
    };
  },
};
</script>

<style lang="scss" scoped>
#code-editor{
  width: 100%;
  position: relative;
  padding: 1rem 2rem;
  & > .code-input{
    position: absolute;
    // padding: 1rem 0 1rem 2rem;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem 2rem;
    height: auto;
    color: transparent;
    text-shadow: none;
    bottom: 0;
    caret-color: rgb(43, 43, 43);
    &::selection{
      // background: #777;
      color: #777
    }
  }
}

// .code-input{

//   // opacity: 0.1;
// }
</style>
