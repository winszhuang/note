<template>
  <div class="search">
    <div class="search-input">
      <div class="search-icon">
        <font-awesome-icon :icon="['fas', 'search']" size="1x"/>
      </div>
      <input type="text" v-model="searchInput" placeholder="輸入搜尋內容">
    </div>
    <div class="search-divide"></div>
    <div class="search-select">
      <template v-if="searchPages">
        <div class="search-list" >
          <div class="search-item"
                type="button"
                @click="goPageAndCloseModal(page.id)"
                v-for="(page) in searchPages"
                :key="page.id">
            <div class="d-flex">
              <div class="search-item-page-icon">
                <font-awesome-icon :icon="['far', 'file']" size="1x"/>
              </div>
              <div class="search-item-page" v-html="getContentWithKeyword(page.name)">
              </div>
            </div>
          </div>
        </div>
      </template>
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
            <div class="search-content" v-html="getContentWithKeyword(block.content?.text)"></div>
          </div>
        </div>
      </template>
      <!-- <template v-else>
        <div class="recent">
          <div class="recent-subtitle">最近造訪</div>
          <div class="recent-page" v-for="(page, index) in recentPages"
              :key="name + index">
            <div class="search-item-page-icon">
              <font-awesome-icon :icon="['far', 'file']" size="1x"/>
            </div>
            <div class="search-item-page" type="button" @click="goPageAndCloseModal(page.id)">
              {{ page.name }}
            </div>
          </div>
        </div>
      </template> -->
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import commonUpdateEffect from './commonUpdataEffect';

export default {
  name: 'Search',
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const { goCurrentPage } = commonUpdateEffect();
    const searchInput = ref('');
    const searchBlocks = computed(() => store.getters['blocks/searchBlocks'](searchInput.value));
    const searchPages = computed(() => store.getters['pages/searchPages'](searchInput.value));
    const recentPages = computed(() => store.getters['userInfo/getPagesInRecentPageIds']);

    const getPage = (blockId) => computed(() => store.getters['pages/getPageByBlockId'](blockId)).value;

    const goBlockPosition = (page, block) => {
      emit('close');
      store.dispatch('blocks/goBlockPosition', {
        page,
        block,
      });
    };

    const goPageAndCloseModal = (id) => {
      emit('close');
      goCurrentPage(id);
    };

    const getContentWithKeyword = (str) => computed(() => {
      const keyword = searchInput.value;
      if (!str.includes(keyword)) return '';
      const strArr = str.split(keyword);
      let contentHtml = '';
      for (let i = 0; i < strArr.length; i += 1) {
        if (i === strArr.length - 1) {
          contentHtml += strArr[i];
          break;
        }
        contentHtml += (`${strArr[i]}<span style="font-weight: 900; color: #131313;">${keyword}</span>`);
      }
      return contentHtml;
    }).value;

    return {
      searchInput,
      searchPages,
      searchBlocks,
      getPage,
      goPageAndCloseModal,
      goBlockPosition,
      getContentWithKeyword,
      recentPages,
    };
  },
};
</script>

<style lang="scss" scoped>
@mixin icon{
  width: 1.5rem;
  text-align: left;
}

$search-border-bottom: .05rem solid rgb(212, 212, 212);
.search{
  height: 55vh;
  width: 50vw;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  background: #faf9f2;
  border-radius: .3rem;
  padding-top: .8rem;
  padding-bottom: .8rem;
  display: flex;
  flex-direction: column;
  transition: width .3s ease-in;
  @media (max-width: 992px) {
    height: 55vh;
    width: 60vw;
  }
  @media (max-width: 450px) {
    height: 65vh;
    width: 80vw;
  }
  &-input{
    box-sizing: border-box;
    display: flex;
    padding: .4rem 1.5rem 1rem 1.5rem;
    padding-top: .4rem;
    border-bottom: $search-border-bottom;
  }
  &-select{
    height: 100%;
    padding: 0 1.5rem;
    overflow-y: auto;
    background: #faf9f2;
    &::-webkit-scrollbar {
      width: 8px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: #faf9f2;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: #bebeb9;
      border-radius: 4px;
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #a3a39e;
    }
  }
  &-icon{
    @include icon;
    color: rgb(167, 167, 167);
  }

  &-item{
    margin: 0 -1.5rem 0 -1.5rem;
    padding: .7rem 1.5rem;
    border-bottom: $search-border-bottom;
    &:hover{
      background: rgb(221, 221, 221);
    }
    &-page{
      font-size: 1.1rem;
      color: rgb(122, 122, 122);
      &-icon{
        @include icon;
        font-size: 1.1rem;
        color: rgb(122, 122, 122);
      }
    }
  }
  &-content{
    font-size: 12px;
    font-weight: 300;
    color: #92918b;
    span{
      color: aqua;
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
