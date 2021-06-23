/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
<template>
  <Modal v-if="isShow"
        @close="handleShow(false)"
        :mode="'component'"
        :container-class="'search-container'"
        :is-bg-static="false">
    <template #component>
      <Search @close="handleShow(false)"/>
    </template>
  </Modal>
  <div class="sidebar" :style="{ width: isSidebarCollapse === true ? '0' : '23rem' }">
      <UserField/>
      <div class="field-title">通用 :</div>
      <div class="customlist-group">
        <div class="customlist-group-item"
              type="button"
              @click="handleShow(true)">
          <div class="customlist-item-1 ms-4" style="margin-left: 1rem;">
            <font-awesome-icon
                :icon="['fas', 'search']" />
          </div>
          <div class="customlist-item-6 block-name ">搜尋區塊</div>
        </div>
      </div>
      <div class="scollitem">
        <!-- <div v-if="currentPage">
          {{ currentPage.blocks }}
        </div> -->
        <div class="field-title">頁面 :</div>
        <div class="customlist-group">
          <CustomList
            v-for="item in rootPages"
            :key="item.id"
            :page="item"/>
          <div class="customlist-group-item"
              type="button"
              @click="addPage">
              <div class="ms-4 customlist-item-1">+</div>
              <div class="customlist-item-6">增加頁面</div>
          </div>
        </div>
        <div class="field-title">區塊 :</div>
        <div class="customlist-group">
          <div class="customlist-group-item"
                type="button"
                v-for="item in blocktype"
                :key="item.type"
                @click="addBlock(item.type)">
            <div class="customlist-item-1 ms-4">
              <font-awesome-icon
                  :icon="[style[item.style], item.icon || 'heading']" :size="item.size || 'xs'"/>
              <!-- {{ item.type }} -->
            </div>
            <div class="customlist-item-6 block-name">{{ item.name }}</div>
          </div>
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
  toRefs, computed, onMounted, // reactive
} from 'vue';
import UserField from './UserField.vue';
import CustomList from '../../components/CustomList.vue';
import Modal from '../../components/Modal.vue';
import Search from '../Search.vue';
import { showEffect } from '../../components/commonEffect';

export default {
  name: 'Sidebar',
  components: {
    UserField,
    CustomList,
    Modal,
    Search,
  },
  setup() {
    const store = useStore();
    const currentPage = computed(() => store.getters['pages/currentPage']);
    const rootPages = computed(() => store.getters['pages/childrenPages'](''));
    const { isShow, handleShow } = showEffect();
    const { blocktype, isSidebarCollapse } = toRefs(store.state);
    const { blocks } = toRefs(store.state.blocks);
    const { currentPageId, currentPageIdOnMouse } = toRefs(store.state.pages);
    // const {
    //   blocks,
    //   blocktype,
    //   isSidebarCollapse,
    //   currentPageId,
    //   currentPageIdOnMouse,
    // } = toRefs(store.state);

    onMounted(() => {
      handleShow(false);
      // const sidebar = document.getElementsByClassName('sidebar')[0];
      window.addEventListener('resize', () => {
        if (window.innerWidth < 900) {
          if (isSidebarCollapse.value === true) return;
          store.commit('setSidebarCollapse', true);
        } else {
          if (isSidebarCollapse.value === false) return;
          store.commit('setSidebarCollapse', false);
        }
      });
    });

    const style = {
      solid: 'fas',
      regular: 'far',
    };

    const addPage = () => {
      store.commit('pages/addPage', {});
    };

    const addBlock = (type) => {
      if (currentPageId.value === '') {
        console.log('請先選擇頁面');
        return;
      }

      if (type === 'page') {
        store.dispatch('pages/addPageInside');
        return;
      }

      if (type === 'numberItem' || type === 'bulletItem') {
        const groupId = (new Date().getTime() - 2).toString();
        store.commit('groups/addGroup', groupId);
        store.dispatch('blocks/addBlockInGroup', {
          type,
          groupId,
        });
        return;
      }

      store.dispatch('blocks/addBlock', {
        type,
      });
    };

    return {
      rootPages,
      blocks,
      blocktype,
      addPage,
      currentPage,
      currentPageId,
      currentPageIdOnMouse,
      addBlock,
      style,
      isShow,
      handleShow,
      isSidebarCollapse,
    };
  },
};
</script>

<style lang="scss" >
@import '../../style/component/_sidebar.scss';
.sidebar{
  transition: width .2s ease-out .1s;
}

.search-container{
  width: 30%;
  height: 50%;
}
.addpage{
  line-height: 2.5rem;
  // height: 2.5rem;
  color: #909090;
  &-text{
    padding-left: 35%;
  }
  &:hover{
    background: #5c525e;
    color: #c9c0c2;
  }
}
.caret-right{
  margin-right: .3rem;
}
// .block-icon{
//   width: 1.3rem;
// }
.block-name{
  padding-top: .05rem;
}

</style>
