/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
<template>
  <div class="sidebar">
      <Modal v-if="isOpenModal"
            :mode="'component'"
            :is-bg-static="false"
            @close="openModal(false)">
        <template #component>
          <Search/>
        </template>
      </Modal>
      <UserInfo/>
      <div class="customlist-group bb">
        <div class="customlist-group-item customlist-group-item-action"
              type="button"
              @click="openModal(true)">
          <div class="customlist-item block-icon me-1">
            <font-awesome-icon
                :icon="['fas', 'search']" />
          </div>
          <div class="customlist-item block-name">搜尋區塊</div>
        </div>
      </div>
      <!-- <div v-if="currentPage">
        {{ currentPage.blocks }}
      </div> -->
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
          <div class="customlist-item block-icon">
            <font-awesome-icon
                :icon="[style[item.style], item.icon || 'heading']" :size="item.size || 'xs'"/>
            <!-- {{ item.type }} -->
          </div>
          <div class="customlist-item block-name">{{ item.name }}</div>
        </div>
      </div>
      <div class="sidebar-footer">
        <div class="addpage bt" type="button" @click="addPage">
          <div class="addpage-text">+ 新頁面</div>
        </div>
      </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import {
  toRefs, ref, computed, onMounted, // reactive
} from 'vue';
import UserInfo from './UserInfo.vue';
import CustomList from '../../components/CustomList.vue';
import Modal from '../../components/Modal.vue';
import Search from '../Search.vue';

export default {
  name: 'Sidebar',
  components: {
    UserInfo,
    CustomList,
    Modal,
    Search,
  },
  setup() {
    const store = useStore();
    const list = ref(null);
    const isOpenModal = ref('false');
    const currentPage = computed(() => store.getters.currentPage);
    const rootPages = computed(() => store.getters.childrenPages(''));
    const {
      pages, blocks, blocktype, currentPageId, currentPageIdOnMouse,
    } = toRefs(store.state);

    onMounted(() => {
      isOpenModal.value = false;
    });

    const style = {
      solid: 'fas',
      regular: 'far',
    };

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
      } else {
        store.dispatch('addBlock', {
          typeName,
        });
      }
    };

    const openModal = (choose) => {
      isOpenModal.value = choose;
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
      openModal,
      list,
      style,
      isOpenModal,
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
.block-icon{
  width: 1.3rem;
}
.block-name{
  padding-top: .05rem;
}

</style>
