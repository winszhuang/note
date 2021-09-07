<template>
  <div class="block-style-editor"
      :style="{ width: `${currentSidebarWidth}px`,
          left: isShow ? '0' : `${-currentSidebarWidth || -600}px`}">
    <div class="style-editor-title">挑選顏色 :</div>
    <div class="style-editor-content d-flex flex-wrap">
      <div type="button"
          v-for="(color) in colors"
          :key="color.code"
          @click="setBlockColor(color.name)"
          :class="{ 'color-item': true,
                'color-item-active': blockDress.color === color.name }">
        <div type="button"
            class="color-item-circle"
            :style="{ 'background-color': `#${color.code}` }"></div>
      </div>
    </div>
    <div class="style-editor-title">區塊樣式 :</div>
    <div class="style-editor-content">
      <div :class="{ 'style-item': true,
            'style-item-active': blockDress.style === style.className }"
          type="button"
          v-for="(style) in styles"
          :key="style.name"
          @click="setBlockStyle(style.className)">
        <div class="style-name">{{ style.name }}</div>
        <div :class="style.className" class="my-2">text</div>
      </div>
    </div>

    <div class="style-check" type="button" @click="checkAction">確認修改</div>
  </div>
</template>

<script>
import { reactive, computed, watch } from 'vue';
import { useStore } from 'vuex';

const colors = [
  {
    name: 'default',
    code: '584d58',
  },
  {
    name: 'orange',
    code: 'eea14a',
  },
  {
    name: 'red',
    code: 'd13939',
  },
  {
    name: 'blue',
    code: '2a7eec',
  },
  {
    name: 'yellow',
    code: 'e0b833',
  },
  {
    name: 'green',
    code: '39d15f',
  },
  {
    name: 'purple',
    code: '9228e9',
  },
  {
    name: 'gray',
    code: 'c4c4c4',
  },
  {
    name: 'pink',
    code: 'db2571',
  },
];

const styles = [
  {
    name: '字體填色',
    className: 'style-text-color',
  },
  {
    name: '背景填色',
    className: 'style-bg-color',
  },
  {
    name: '外框填色',
    className: 'style-border',
  },
];

export default {
  name: 'BlockStyleEditor',
  props: ['isShow'],
  emits: ['hiddenStyleEditor'],
  setup(props, { emit }) {
    const store = useStore();
    const currentSidebarWidth = computed(() => store.state.sidebarState.currentWidth);
    const selectedBlocks = computed(() => store.getters['blocks/selectedBlocks']);

    const setClassNameToBlock = (block, className) => {
      store.commit('blocks/editBlockData', {
        id: block.id,
        key: 'className',
        value: className,
      });
    };

    const blockDress = reactive({
      style: '',
      color: '',
    });

    const setBlockColor = (color) => {
      blockDress.color = color;
    };

    const setBlockStyle = (style) => {
      blockDress.style = style;
    };

    const setBlockDressByClassName = (className) => {
      if (className === '') {
        blockDress.style = '';
        blockDress.color = '';
        return;
      }
      const style = className.split('__')[0];
      const color = className.split('__')[1];
      blockDress.style = style;
      blockDress.color = color;
    };

    // 剛進入BlockStyleEditor的處理程序
    watch(() => props.isShow, (curr, prev) => {
      if (prev === true || curr === false) return;

      if (selectedBlocks.value.length === 1) {
        const block = selectedBlocks.value[0];
        setBlockDressByClassName(block.className);
        return;
      }

      const classNameOfFirstBlock = selectedBlocks.value[0].className;

      // 所有選到的block的樣式都一樣 || 有不一樣的block樣式
      if (selectedBlocks.value.every((block) => block.className === classNameOfFirstBlock)) {
        setBlockDressByClassName(classNameOfFirstBlock);
      } else {
        setBlockDressByClassName('');
      }
    });

    watch(() => blockDress, (curr) => {
      if (blockDress.style === '' && blockDress.color === '') return;

      if (blockDress.color !== '' && blockDress.style === '') {
        setBlockStyle(styles[0].className);
        return;
      }

      if (blockDress.style !== '' && blockDress.color === '') {
        setBlockColor(colors[0].name);
        return;
      }

      selectedBlocks.value.forEach((block) => {
        setClassNameToBlock(block, `${curr.style}__${curr.color}`);
      });
    }, { deep: true });

    const checkAction = () => {
      emit('hiddenStyleEditor');
    };

    return {
      colors,
      styles,
      setBlockColor,
      setBlockStyle,
      blockDress,
      checkAction,
      currentSidebarWidth,
    };
  },
};
</script>

<style lang="scss" scoped>
.block-style-editor{
  box-sizing: border-box;
  background-color: #4d454e;
  position: fixed;
  left: -500px;
  bottom: 0;
  z-index: 30;
  border: .1rem solid #665c68;
  border-left: none;
  border-radius: .5rem;
  width: 300px;
  padding: 1.5rem;
  box-shadow: -3px -3px 5px 0 rgb(54, 54, 54);
  overflow: hidden;
  transition: left .2s ease-out;
}

.style-editor{
  &-title{
    transform: scale(.85);
    transform-origin: left;
    font-weight: 300;
    color: #f1a726;
    margin-bottom: .4rem;
    font-weight: 500;
  }
  &-content {
    border: .01rem solid #6b6b6b;
    margin-bottom: 2rem;
  }
}

.style{
  &-item{
    display: flex;
    align-items: center;
    padding: .3rem .8rem;
    &:hover{
      background-color: #5c545e;
    }
    &:active{
      background-color: #69606b;
    }
    &-active{
      background-color: #5c545e;
    }
  }
  &-name{
    color: #aea7af;
    margin-right: 1rem;
  }
  &-bg{
    flex: 1;
    background-color: rgb(226, 226, 226);
  }
  &-text-color{
    flex: 1;
    color: #cec2cf;
  }
  &-border{
    flex: 1;
    color: #aea7af;
    border: .1rem solid #aea7af;
  }
  &-bg-range{
    width: 2rem;
    background-color: rgb(226, 226, 226);
  }
  &-border-range{
    width: 2rem;
    color: #aea7af;
    border: .1rem solid #aea7af;
  }
  &-check{
    text-align: center;
    margin: 0 auto;
    padding: .5rem;
    color: #2e2e2e;
    border-radius: 2px;
    background-color: #f1a726;
    font-weight: 700;
    transition: background-color .1s ease-out;
    &:hover{
      background-color: #eeb451;
    }
  }
}

.color-item{
  flex-basis: auto;
  opacity: .3;
  transition: opacity .3s ease-out;
  &-circle{
    margin: .5rem;
    height: 2rem;
    width: 2rem;
    border-radius: 50%;
  }
  &:hover{
    opacity: .7;
  }
  &:active{
    opacity: 1;

  }
  &-active{
    background-color: #6c646e;
    opacity: 1;
  }
}

.bg{
  &-orange{
    background-color: #eea14a;
  }
  &-yellow{
    background-color: #e0b833;
  }
  &-blue{
    background-color: #2a7eec;
  }
  &-red{
    background-color: #d13939;
  }
  &-green{
    background-color: #39d15f;
  }
  &-purple{
    background-color: #9228e9;
  }
  &-gray{
    background-color: #c4c4c4;
  }
  &-pink{
    background-color: #db2571;
  }
}

</style>
