<template>
  <div class="search">
    <div class="search-input">
      <div class="me-2 search-icon">
        <font-awesome-icon :icon="['fas', 'search']" size="1x"/>
      </div>
      <input type="text" v-model="searchInput" placeholder="輸入搜尋內容">
    </div>
    <div class="search-divide"></div>
    <template v-if="searchBlocks">
      <div class="search-list" >
        <div class="search-item"
              type="button"
              @click="goBlockPosition(getPage(block.id), block)"
              v-for="(block) in searchBlocks"
              :key="block.id">
          <div class="d-flex">
            <div class="search-item-page-icon">
              <font-awesome-icon :icon="['far', 'file']" size="1x"/>
            </div>
            <div class="search-item-page">
              {{ getPage(block.id).name }}
            </div>
          </div>
          {{ block.content }}
        </div>
      </div>
    </template>
    <template v-else>
      <div class="recent">
        <div class="recent-subtitle">最近造訪</div>
        <div class="recent-page">
          <div class="search-item-page-icon">
            <font-awesome-icon :icon="['far', 'file']" size="1x"/>
          </div>
          <div class="search-item-page">
            javascript筆記
          </div>
        </div>
        <div class="recent-page">
          <div class="search-item-page-icon">
            <font-awesome-icon :icon="['far', 'file']" size="1x"/>
          </div>
          <div class="search-item-page">
            javascript筆記
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Search',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const searchInput = ref('');
    const searchBlocks = computed(() => store.getters.searchBlocks(searchInput.value));
    const getPage = (blockId) => computed(() => store.getters.getPageByBlockId(blockId)).value;

    const goBlockPosition = (page, block) => {
      emit('close');
      store.dispatch('goBlockPosition', {
        page,
        block,
      });
    };

    return {
      searchInput,
      searchBlocks,
      getPage,
      goBlockPosition,
    };
  },
};
</script>

<style lang="scss" scoped>
.search{
  padding: .8rem 1.5rem;
  &-icon{
    color: rgb(167, 167, 167);
  }
  &-input{
    display: flex;
    padding-top: .4rem;
    margin-bottom: 1rem;
  }
  &-divide{
    height: .05rem;
    width: 100;
    background: rgb(212, 212, 212);
    margin: 0 -1.5rem;
  }
  &-item{
    margin: 0 -1.5rem 0 -1.5rem;
    padding: .4rem 2rem;
    border-bottom: .05rem solid rgb(212, 212, 212);
    &:hover{
      background: rgb(221, 221, 221);
    }
    &-page{
      color: rgb(122, 122, 122);
      &-icon{
        margin-right: .6rem;
        color: rgb(122, 122, 122);
      }
    }
  }
}

.recent{
  margin-top: 1rem;
  &-page{
    display: flex;
    line-height: 2rem;
    font-weight: 700;
  }
  &-subtitle{
    font-size: 1rem;
    transform: scale(.8);
    transform-origin: left;
    color: #4e95e6;
  }
}

.bb-light{
  border-bottom: .2px solid rgb(146, 146, 146);
}

</style>
