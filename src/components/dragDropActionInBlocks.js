import { computed } from 'vue';
import { useStore } from 'vuex';

const dragDropActionInBlocks = () => {
  const store = useStore();

  const cancelDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getVerticalDirByMousePosition = (dom, mouseY) => {
    const rect = dom.getBoundingClientRect();
    const domMidline = rect.top + rect.height / 2; // 找選到的元素的中線位置
    return mouseY < domMidline ? 'up' : 'down';
  };

  const handleBeforeDrop = (e) => {
    cancelDefault(e);
    const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
    const targetDOM = e.target; // 當前block的DOM元素

    if (targetDOM.id === catchBlockId) return; // 如果選到同個元素就不執行

    const y = e.clientY; // 取得滑鼠放開時候的Y位置
    const direction = getVerticalDirByMousePosition(targetDOM, y);
    const blockContentDom = targetDOM.closest('.block-content');
    if (direction === 'up') {
      blockContentDom.classList.remove('block-border-bottom');
      blockContentDom.classList.add('block-border-top');
    } else {
      blockContentDom.classList.remove('block-border-top');
      blockContentDom.classList.add('block-border-bottom');
    }
  };

  const handleLeave = (e) => {
    cancelDefault(e);
    const blockContentDom = e.target.closest('.block-content');
    if (blockContentDom.classList.contains('block-border-top')) {
      blockContentDom.classList.remove('block-border-top');
    }
    if (blockContentDom.classList.contains('block-border-bottom')) {
      blockContentDom.classList.remove('block-border-bottom');
    }
  };

  const deleteGroupIfEmptyByBlock = (block) => {
    const group = computed(() => store.getters['groups/getGroupByBlock'](block)).value;
    if (group.value.length === 0) {
      store.commit('groups/deleteGroup', group);
    }
  };

  const deleteIdToGroupAndDeleteGroupIfEmpty = (catchBlock) => {
    store.commit('groups/deleteIdToGroup', {
      groupId: catchBlock.group,
      id: catchBlock.id,
    });
    deleteGroupIfEmptyByBlock(catchBlock);
  };

  // 自定義判斷程式邏輯區域
  // .........................
  // .........................
  const catchFalseLastSameNextSame = (nextBlock) => {
    const nextBlockGroup = computed(() => store.getters['groups/getGroupByBlock'](nextBlock)).value;
    const index = nextBlockGroup.value.indexOf(nextBlock.id);

    const shiftIds = nextBlockGroup.value.slice(index);
    store.dispatch('groups/deleteIdsToGroup', {
      groupId: nextBlockGroup.id,
      ids: shiftIds,
    });

    const groupId = new Date().getTime().toString();
    store.commit('groups/addGroup', groupId);
    store.commit('groups/addIdsToGroup', {
      groupId,
      ids: shiftIds,
    });
    store.dispatch('blocks/changeGroupIdFromBlocksIds', {
      blocksIds: shiftIds,
      groupId,
    });
  };

  const catchTrueLastSameNextSame = (catchBlock, lastBlock) => {
    console.log('上有group 下沒有  或者上下都有');
    deleteIdToGroupAndDeleteGroupIfEmpty(catchBlock);
    const lastBlockGroup = computed(() => store.getters['groups/getGroupByBlock'](lastBlock)).value;
    const index = lastBlockGroup.value.indexOf(lastBlock.id);

    store.commit('blocks/changeGroupIdFromBlockId', {
      blockId: catchBlock.id,
      groupId: lastBlock.group,
    });

    store.commit('groups/addIdToGroup', {
      groupId: lastBlock.group,
      id: catchBlock.id,
      index: index + 1,
    });
  };

  const catchTrueLastFalseNextTrue = (catchBlock, nextBlock) => {
    console.log('上沒有group 下有');
    deleteIdToGroupAndDeleteGroupIfEmpty(catchBlock);
    const nextBlockGroup = computed(() => store.getters['groups/getGroupByBlock'](nextBlock)).value;
    const index = nextBlockGroup.value.indexOf(nextBlock.id);
    store.commit('blocks/changeGroupIdFromBlockId', {
      blockId: catchBlock.id,
      groupId: nextBlock.group,
    });

    store.commit('groups/addIdToGroup', {
      groupId: nextBlock.group,
      id: catchBlock.id,
      index,
    });
  };

  const catchTrueLastFalseNextFalse = (catchBlock) => {
    console.log('上下都沒有group');

    deleteIdToGroupAndDeleteGroupIfEmpty(catchBlock);
    const groupId = new Date().getTime().toString();
    store.commit('groups/addGroup', groupId);

    store.commit('groups/addIdToGroup', {
      groupId,
      id: catchBlock.id,
    });

    store.commit('blocks/changeGroupIdFromBlockId', {
      blockId: catchBlock.id,
      groupId,
    });
  };
  // .........................
  // .........................
  // 自定義判斷程式邏輯區域

  const handleIdDropInGroup = (catchBlock) => {
    const currentBlocks = computed(() => store.getters['blocks/currentBlocks']).value;
    const catchBlockIndex = currentBlocks.indexOf(catchBlock);
    const lastBlock = currentBlocks[catchBlockIndex - 1] || { group: '' };
    const nextBlock = currentBlocks[catchBlockIndex + 1] || { group: '' };

    // 根據對應判斷選擇要執行的方法
    // 篩選出執行的方法的命名說明
    // c表示catchBlock.group  l表示lastBlock.group  n表示nextBlock.group
    // F表示沒有值或者''  T表示有值  S表示有相同值(last和next相同)
    // 範例 : cF代表catchBlock.group沒有值或者是''
    const actions = new Map([
      [{
        catchB_g: false,
        lastB_g: true,
        nextB_g: true,
      }, () => catchFalseLastSameNextSame(nextBlock)],
      // catch沒group，last和next有同group

      [{
        catchB_g: true,
        lastB_g: true,
        nextB_g: true,
      }, () => catchTrueLastSameNextSame(catchBlock, lastBlock)],
      // catch有group，last和next有同group

      [{
        catchB_g: true,
        lastB_g: true,
        nextB_g: false,
      }, () => catchTrueLastSameNextSame(catchBlock, lastBlock)],
      // catch有group，last有group  next沒有group

      [{
        catchB_g: true,
        lastB_g: false,
        nextB_g: true,
      }, () => catchTrueLastFalseNextTrue(catchBlock, nextBlock)],
      // catch有group，last沒有group  next有group

      [{
        catchB_g: true,
        lastB_g: false,
        nextB_g: false,
      }, () => catchTrueLastFalseNextFalse(catchBlock)],
      // catch有group，last和next都沒有group

      [{
        catchB_g: false,
        lastB_g: false,
        nextB_g: false,
      }, () => false],
      // catch、last和next都沒有group
    ]);

    const selectAction = [...actions].find(([key]) => key.catchB_g === (catchBlock.group !== '')
      && key.lastB_g === (lastBlock.group !== '') && key.nextB_g === (nextBlock.group !== ''));
    console.log(selectAction);
    selectAction[1]();
  };

  const handleDrop = (e) => {
    console.log('插進來');
    const currentPage = computed(() => store.getters['pages/currentPage']).value;
    const catchBlockId = e.dataTransfer.getData('text/plain'); // 其他地方丟過來的blockId
    const catchBlock = computed(() => store.getters['blocks/chooseBlock'](catchBlockId)).value;
    const targetDOM = e.target; // 當前block的DOM元素

    handleLeave(e); // 刪除所有拖動過程會產生的邊線style

    if (targetDOM.id === catchBlockId) return; // 如果選到同個元素就不執行
    if (!(targetDOM.hasAttribute('id') || targetDOM.hasAttribute('data-pageid'))) return;

    // 先刪除原本的位置的blockID
    const direction = getVerticalDirByMousePosition(targetDOM, e.clientY); // 取得滑鼠放開時候的Y位置
    const newIndex = currentPage.blocks.indexOf(targetDOM.id); // 新的要插入的位置
    store.dispatch('pages/moveIdInBlocksOfPage', {
      page: currentPage,
      blockId: catchBlockId,
      index: direction === 'up' ? newIndex : newIndex + 1,
    });

    handleIdDropInGroup(catchBlock);
    handleLeave(e);
  };

  return {
    handleDrop,
    cancelDefault,
    handleLeave,
    handleBeforeDrop,
  };
};

export default dragDropActionInBlocks;
