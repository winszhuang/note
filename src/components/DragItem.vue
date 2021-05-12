<template>
  <div class="dragicon"
      draggable="true"
      @dragend="handleDrop($event)"
  >
    <font-awesome-icon :icon="['fas', 'expand-arrows-alt']" size="xs"/>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'DragItem',
  props: ['block'],
  setup() {
    const store = useStore();
    const currentPage = computed(() => store.getters.currentPage);
    const handleDrop = (e) => {
      e.preventDefault();
      const x = e.clientX;
      const y = e.clientY;
      const chooseItem = document.elementFromPoint(x, y);
      // const chooseItemBottom = rect.bottom;

      const originalItem = e.target.parentElement.nextElementSibling.children[0];

      if (chooseItem.hasAttribute('id') && chooseItem !== originalItem) {
        const rect = chooseItem.getBoundingClientRect();
        const chooseItemMidline = rect.top + rect.height / 2; // 找選到的元素的中線位置

        const blocks = [...currentPage.value.blocks];
        const originalIndex = blocks.indexOf(originalItem.id);
        blocks.splice(originalIndex, 1); // 先刪除原本的位置的lbockID

        const newIndex = blocks.indexOf(chooseItem.id);
        if (y < chooseItemMidline) {
          blocks.splice(newIndex, 0, originalItem.id);
        } else {
          blocks.splice(newIndex + 1, 0, originalItem.id);
        }

        store.commit('editPageData', {
          property: 'blocks',
          value: blocks,
        });
      }

      if (chooseItem.hasAttribute('data-pageid') && chooseItem !== originalItem) {
        const blocks = [...currentPage.value.blocks];
        const originalIndex = blocks.indexOf(originalItem.id);
        blocks.splice(originalIndex, 1);

        store.commit('editPageData', {
          property: 'blocks',
          value: blocks,
        });

        const childrenPageId = chooseItem.getAttribute('data-pageid');
        const childrenPage = computed(() => store.getters.choosePage(childrenPageId)).value;
        const childrenPageBlocks = [...childrenPage.blocks];

        childrenPageBlocks.push(originalItem.id);

        store.commit('editPageData', {
          property: 'blocks',
          value: childrenPageBlocks,
          pageId: childrenPage.id,
        });
      }
    };

    return { handleDrop };
  },
};
</script>

<style lang="scss">
.dragicon{
  width: 1rem;

  color: #c0c0c0;
  &:hover{
    color: #747474;
  }
}
</style>
