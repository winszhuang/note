<template>
  <div class="styletool" id="styletool" v-show="isShow" @click="addStyle($event)">
    <div class="styletool-icon" type="button" id="bold">
      <font-awesome-icon :icon="['fas', 'bold']"/>
    </div>
    <div class="styletool-icon" type="button" id="italic">
      <font-awesome-icon :icon="['fas', 'italic']"/>
    </div>
    <div class="styletool-icon" type="button" id="underline">
      <font-awesome-icon :icon="['fas', 'underline']"/>
    </div>
    <div class="styletool-icon" type="button" id="strikethrough">
      <font-awesome-icon :icon="['fas', 'strikethrough']"/>
    </div>
    <div class="styletool-divide"></div>
    <div class="styletool-icon" type="button" id="palette">
      <font-awesome-icon :icon="['fas', 'palette']"/>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { showEffect } from './commonEffect';
// import commonUpdateEffect from '../views/commonUpdataEffect';

export default {
  name: 'StyleTool',
  setup() {
    const store = useStore();
    const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);
    const { isShow, handleShow } = showEffect();
    const textSelection = reactive({
      focusEl: '',
      value: {
        anchorNode: '',
        anchorOffset: '',
        focusNode: '',
        focusOffset: '',
        selection: '',
      },
    });
    const changeSelectionValue = (selection) => {
      textSelection.value.anchorNode = selection.anchorNode;
      textSelection.value.anchorOffset = selection.anchorOffset;
      textSelection.value.focusNode = selection.focusNode;
      textSelection.value.focusOffset = selection.focusOffset;
      textSelection.value.selection = { ...selection };
    };

    const changeSelectionFocusEl = (el) => {
      textSelection.focusEl = el;
    };
    // const { editBlockData } = commonUpdateEffect();
    const addStyle = (e) => {
      if (!e.target.closest('#styletool')) return;

      const newEl = document.createElement('span');
      const addClass = {
        bold: () => { newEl.setAttribute('class', 'bold'); },
        italic: () => { newEl.setAttribute('class', 'italic'); },
        underline: () => { newEl.setAttribute('class', 'underline'); },
        strikethrough: () => { newEl.setAttribute('class', 'strikethrough'); },
        palette: () => { newEl.setAttribute('class', 'palette'); },
      };

      const className = e.target.closest('.styletool-icon').id;
      addClass[className]();

      const { content } = currentFocusBlock.value;
      console.log(content);
      console.log(textSelection);
      // const selectEl = document.activeElement;
      // console.log(selectEl);
    };

    onMounted(() => {
      handleShow(false);

      const styletool = document.getElementById('styletool');
      const setElementPosition = (el, left, top) => {
        // eslint-disable-next-line no-param-reassign
        el.style.left = `${left}px`;
        // eslint-disable-next-line no-param-reassign
        el.style.top = `${top}px`;
      };

      document.addEventListener('mouseup', (e) => {
        if (!e.target.closest('.block')) return;
        const selection = window.getSelection();
        // console.log(selection);
        changeSelectionFocusEl(document.activeElement);
        changeSelectionValue(selection);
        if (selection.isCollapsed) return;
        // console.log(range.anchorOffset);
        // console.log(range.focusOffset);
        setElementPosition(styletool, e.clientX, e.clientY - 70);
        handleShow(true);
      });

      document.addEventListener('mousedown', (e) => {
        if (e.target.closest('#styletool')) return;
        handleShow(false);
        setElementPosition(styletool, 0, 0);
      });
    });

    return { isShow, handleShow, addStyle };
  },
};
</script>

<style lang="scss" scoped>
.styletool{
  position: fixed;
  left: 0;
  top: 0;
  z-index: 4;
  display: flex;
  line-height: 2rem;
  height: 2rem;
  background: rgb(247, 247, 247);
  padding: 0 .5rem;
  border-radius: .2rem;
  // border: .05rem solid rgb(209, 209, 209);
  box-shadow: .1rem .15rem .4rem .05rem rgb(202, 202, 202);
  color: rgb(150, 150, 150);
  &-icon{
    width: 1.7rem;
    text-align: center;
    &:hover{
      color: rgb(87, 87, 87);
    }
  }
  &-divide{
    width: .05rem;
    height: 1.6rem;
    background: rgb(218, 218, 218);
    margin: .2rem .5rem;
  }
}

.bold{
  font-weight: bold;
}

.italic{
  font-style: italic;
}

.underline{
  text-decoration: underline;
}

.strikethrough{
  text-decoration: line-through;
}
</style>
