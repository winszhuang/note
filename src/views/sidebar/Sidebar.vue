/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
<template>
  <div class="sidebar">
      <UserInfo/>
      <!-- {{ currentPage }} -->
      <div class="customlist-group bb">
        <CustomList
          v-for="item in rootPages"
          :key="item.id"
          :page="item"
        />
        <div class="customlist-group-item customlist-group-item-action"
            type="button"
            @click="addPage"
        >
          + <div class="ms-2">增加頁面</div>
        </div>
      </div>
      <div class="customlist-group bb">
        <div class="customlist-group-item customlist-group-item-action"
              type="button"
              v-for="item in blocktype"
              :key="item.type"
              @click="addBlock(item.type)"
        >
          <div class="customlist-item">
            {{ item.type }}
          </div>
          <div class="customlist-item mr-1">{{ item.name }}</div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="addpage" type="button" @click="addPage">
          <div class="addpage-text">+ 新頁面</div>
        </div>
      </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import {
  toRefs, ref, computed, // reactive
} from 'vue';
import UserInfo from './UserInfo.vue';
import CustomList from '../../components/CustomList.vue';

export default {
  name: 'Sidebar',
  components: { UserInfo, CustomList },
  setup() {
    const store = useStore();
    const list = ref(null);
    const currentPage = computed(() => store.getters.currentPage);
    const rootPages = computed(() => store.getters.childrenPages(''));
    const {
      pages, blocks, blocktype, currentPageId, currentPageIdOnMouse,
    } = toRefs(store.state);

    const addPage = () => {
      store.commit('addPage', {});
    };

    const addBlock = (typeName) => {
      if (currentPageId.value === '') {
        console.log('請先選擇頁面');
        return;
      }
      if (typeName === 'page') {
        store.dispatch('addPageInside');
      } else if (typeName === 'numberList') {
        store.commit('addBlock', {
          typeName,
          value: [],
        });
      } else {
        store.commit('addBlock', {
          typeName,
        });
      }
    };

    return {
      pages,
      rootPages,
      blocks,
      blocktype,
      addPage,
      currentPage,
      currentPageId,
      currentPageIdOnMouse,
      addBlock,
      list,
    };
  },
};
</script>

<style lang="scss">
.sidebar{
  position: absolute;
  background: #b1b1b1;
  bottom: 0;
  top: 0;
  width: 1rem;
}
.addpage{
  width: 100%;
  line-height: 2.5rem;
  border-top: .02rem solid #e4e4e4;
  color: #909090;
  &-text{
    padding-left: 35%;
  }
  &:hover{
    background: #ebebeb;
    color: #787878;
  }
}
.caret-right{
  margin-right: .3rem;
}

</style>
