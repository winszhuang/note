/* eslint-disable prefer-const */
/* eslint-disable no-restricted-syntax */
<template>
  <Modal v-if="isShow"
        @close="handleShow(false)"
        :mode="'component'"
        :is-bg-static="false">
    <template #component>
      <Search @close="handleShow(false)"/>
    </template>
  </Modal>
  <div class="sidebar" :style="{ width: isSidebarCollapse === true ? '0' : '18rem' }">
      <UserField/>
      <div class="customlist-group bb">
        <div class="customlist-group-item customlist-group-item-action"
              type="button"
              @click="handleShow(true)">
          <div class="customlist-item block-icon" style="margin-left: 1rem;">
            <font-awesome-icon
                :icon="['fas', 'search']" />
          </div>
          <div class="customlist-item block-name ">搜尋區塊</div>
        </div>
      </div>
      <div class="scollitem">
        <!-- <div v-if="currentPage">
          {{ currentPage.blocks }}
        </div> -->
        <div class="customlist-group bb mt-4">
          <CustomList
            v-for="item in rootPages"
            :key="item.id"
            :page="item"/>
          <div class="customlist-group-item customlist-group-item-action"
              type="button"
              @click="addPage">
            + <div class="ms-2">增加頁面</div>
          </div>
        </div>
        <div class="customlist-group bb">
          <div class="customlist-group-item customlist-group-item-action"
                type="button"
                v-for="item in blocktype"
                :key="item.type"
                @click="addBlock(item.type)">
            <div class="customlist-item block-icon ms-3">
              <font-awesome-icon
                  :icon="[style[item.style], item.icon || 'heading']" :size="item.size || 'xs'"/>
              <!-- {{ item.type }} -->
            </div>
            <div class="customlist-item block-name">{{ item.name }}</div>
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
  toRefs, ref, computed, onMounted, // reactive
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
    const list = ref(null);
    const store = useStore();
    const { isSidebarCollapse } = toRefs(store.state);
    const currentPage = computed(() => store.getters.currentPage);
    const rootPages = computed(() => store.getters.childrenPages(''));
    const { isShow, handleShow } = showEffect();
    const {
      pages, blocks, blocktype, currentPageId, currentPageIdOnMouse,
    } = toRefs(store.state);

    onMounted(() => {
      handleShow(false);
    });

    const style = {
      solid: 'fas',
      regular: 'far',
    };

    const addPage = () => {
      store.commit('addPage', {});
    };

    const addBlock = (type) => {
      if (currentPageId.value === '') {
        console.log('請先選擇頁面');
        return;
      }

      if (type === 'page') {
        store.dispatch('addPageInside');
        return;
      }

      if (type === 'numberItem' || type === 'bulletItem') {
        const groupId = (new Date().getTime() - 2).toString();
        store.commit('addGroup', groupId);
        store.dispatch('addBlockInGroup', {
          type,
          groupId,
        });
        return;
      }

      store.dispatch('addBlock', {
        type,
      });
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
      style,
      isShow,
      handleShow,
      isSidebarCollapse,
    };
  },
};
</script>

<style lang="scss">
@import '../../style/component/_sidebar.scss';
.sidebar{
  transition: width .2s ease-out .1s;
}
.addpage{
  line-height: 2.5rem;
  // height: 2.5rem;
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
