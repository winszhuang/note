/* eslint-disable max-classes-per-file */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { generateRandomString } from './commonEffect';

// class BlockList {
//   constructor() {
//     this.blocks = [];
//   }

//   addBlock(block) {
//     this.blocks.push(block);
//   }
// }

// class MediaBlock extends Block {
//   constructor() {
//     super('img');
//     this.content = {
//       url: '',
//       compressionWidth: '',
//     };
//   }
// }

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

  const getBlockWidthById = (id) => {
    const blockEl = document.querySelector(`[data-block-id="${id}"]`);
    console.log(blockEl);
    const blockWidth = blockEl.getBoundingClientRect().width;
    console.log(blockWidth);
    return blockWidth;
  };

  class Block {
    constructor(type) {
      this.type = type;
      this.id = generateRandomString();
      this.parentId = '';
      this.content = '';
      this.className = 'style-text-color__default';
    }

    addContent(content) {
      this.content = content;
      return this;
    }

    addBlocks(blocks) {
      this.blocks = blocks;
      return this;
    }

    addParentId(parentId) {
      this.parentId = parentId;
      return this;
    }

    addClassName(className) {
      this.className = className;
      return this;
    }
  }

  const getCopyBlockWithNewId = (block) => {
    const newBlock = JSON.parse(JSON.stringify(block));
    newBlock.id = generateRandomString();
    return newBlock;
  };

  const getCopyBlocksWithNewId = (blocks) => {
    const copyBlocks = JSON.parse(JSON.stringify(blocks));
    return copyBlocks.map((block) => {
      const newBlock = { ...block };
      newBlock.id = generateRandomString();
      return newBlock;
    });
  };

  return {
    Block,
    getLevelOfBlock,
    getCopyBlockWithNewId,
    getCopyBlocksWithNewId,
    getBlockWidthById,
  };
};

export default commonBlockEffect;
