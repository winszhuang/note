<template>
  <div class="sidebar">
      <UserInfo/>
      <div class="customlist-group bb">
        <div class="customlist-group-item customlist-group-item-action"
              type="button"
              v-for="item in pages"
              :key="item.id"
              @click="goCurrentPage(item.id)"
        >
          <div class="customlist-item">
            <font-awesome-icon icon="angle-double-right" />
          </div>
          <div class="customlist-item">{{ item.name }}</div>
        </div>
        <div class="customlist-group-item customlist-group-item-action"
          @click="addPage"
        >+ 增加頁面</div>
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
        <div class="addpage" type="button">
          <div class="addpage-text">+ 新頁面</div>
        </div>
      </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { onBeforeMount, toRefs } from 'vue';
import UserInfo from './UserInfo.vue';

export default {
  name: 'Sidebar',
  components: { UserInfo },
  setup() {
    const store = useStore();
    onBeforeMount(() => {
      store.dispatch('getAllData', 'pages');
      store.dispatch('getAllData', 'blocks');
      store.dispatch('getAllData', 'blocktype');
    });

    const { pages, blocks, blocktype } = toRefs(store.state);

    const addPage = () => {
      store.commit('addPage');
    };
    const goCurrentPage = (id) => {
      store.commit('changeCurrentPage', id);
    };

    const addBlock = (typeName) => {
      store.commit('addBlock', typeName);
    };

    return {
      pages,
      blocks,
      blocktype,
      addPage,
      goCurrentPage,
      addBlock,
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
.customlist-group{
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  overflow: auto;
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
.bb{
  border-bottom: .02rem solid #e4e4e4;
}
</style>
