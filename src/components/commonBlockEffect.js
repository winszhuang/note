/* eslint-disable max-classes-per-file */
import { computed } from 'vue';
import { useStore } from 'vuex';
import { generateRandomString } from './commonEffect';

const commonBlockEffect = () => {
  const store = useStore();
  const currentFocusBlock = computed(() => store.getters['blocks/currentFocusBlock']);

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
    const blockWidth = blockEl.getBoundingClientRect().width;
    return blockWidth;
  };

  const newTextContent = () => ({ text: '', html: '' });

  const newListContent = (type) => ({
    text: '',
    html: '',
    indent: currentFocusBlock.value.type === type
      ? currentFocusBlock.value.content.indent
      : 0,
  });

  const newMediaContent = () => ({ url: '', compressionWidth: '' });

  const newCheckBoxContent = () => ({ text: '', html: '', isChecked: false });

  const newToggleTypeContent = () => ({ text: '', html: '', isHidden: false });

  const newLinkContent = () => ({
    title: '',
    description: '',
    image: '',
    url: '',
  });

  class Block {
    constructor(type = 'p') {
      this.type = type;
      this.id = generateRandomString();
      this.parentId = '';
      this.content = '';
      this.className = 'style-text-color__default';
    }

    addType(type) {
      this.type = type;
      return this;
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

    copyBlock(block) {
      this.type = block.type;
      this.id = block.id;
      this.parentId = block.parentId;
      this.content = { ...block.content };
      return this;
    }
  }

  class BlockFactory {
    constructor(type) {
      const actions = {
        h1: () => new Block(type).addContent(newTextContent()),
        h2: () => new Block(type).addContent(newTextContent()),
        h3: () => new Block(type).addContent(newTextContent()),
        p: () => new Block(type).addContent(newTextContent()),
        quote: () => new Block(type).addContent(newTextContent()),
        codeEditor: () => new Block(type).addContent(newTextContent()),

        numberItem: () => new Block(type).addContent(newListContent('numberItem')),
        bulletItem: () => new Block(type).addContent(newListContent('bulletItem')),

        linkPreview: () => new Block(type).addContent(newLinkContent()),

        img: () => new Block(type).addContent(newMediaContent()),
        video: () => new Block(type).addContent(newMediaContent()),

        todoItem: () => new Block(type).addContent(newCheckBoxContent()),

        dividingLine: () => new Block(type),

        page: () => new Block(type),
      };

      return actions[type] ? actions[type]() : null;
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

  const hasBlockType = (type) => {
    const blocktypeList = computed(() => store.state.blocktype).value;

    const blockType = blocktypeList.find((block) => block.type === type);

    if (blockType) return true;
    return false;
  };

  const getTypeByHotKey = (callback) => {
    const blocktypeList = computed(() => store.state.blocktype).value;

    const blockType = blocktypeList.find((block) => callback(block.hotKey));

    if (blockType) return blockType.type;
    return null;
  };

  return {
    Block,
    BlockFactory,
    newTextContent,
    newListContent,
    newMediaContent,
    newCheckBoxContent,
    newToggleTypeContent,
    newLinkContent,
    getLevelOfBlock,
    getCopyBlockWithNewId,
    getCopyBlocksWithNewId,
    getBlockWidthById,
    getTypeByHotKey,
    hasBlockType,
  };
};

export default commonBlockEffect;
