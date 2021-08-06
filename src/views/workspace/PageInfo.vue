<template>
  <div class="pageinfo" v-if="page">
    <div class="pageinfo-item">
      <div class="pageinfo-item-name">
        <div class="pageinfo-item-icon">
          <font-awesome-icon :icon="['fas', 'clock']"/>
        </div>
        創建於</div>
      <div class="pageinfo-item-content">{{ createdTime || '顯示出錯' }}</div>
    </div>
    <div class="pageinfo-item">
      <div class="pageinfo-item-name">
        <div class="pageinfo-item-icon">
          <font-awesome-icon :icon="['far', 'clock']"/>
        </div>
        上次編輯</div>
      <div class="pageinfo-item-content">{{ editTime || '顯示出錯' }}</div>
    </div>
    <div class="pageinfo-item" id="tagsfield">
      <div class="pageinfo-item-name addtag" type="button" @click="showTagNameInput">
        <div class="pageinfo-item-icon">
          <font-awesome-icon :icon="['fas', 'tags']"/>
        </div>
        <span >標籤</span>
        <div class="ms-2">+</div>
      </div>

      <div class="pageinfo-item-content"
          @keydown="handleKeyDownIntagInput($event)">
        <template v-if="page.tags.length !== 0">
          <div class="tag" type="button"
              :style="{ 'background-color': `${tag.color}` }"
              v-for="(tag) in page.tags"
              :key="page.id + tag"
              @click="deleteTag($event, tag)">
            <div class="tag-content">
              {{ tag.name }}
              <div class="tag-content-delete">X</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="color: #777;">
            None
          </div>
        </template>
        <input type="text" placeholder="輸入標籤名稱後按下Enter鍵創建"
            v-show="isShow"
            id="tagNameInput">
      </div>
    </div>
  </div>
</template>

<script>
import { computed, nextTick } from 'vue';
import { useStore } from 'vuex';
import { showEffect, transTimeStampToLocalTime } from '../../components/commonEffect';

const usePageTagEffect = () => {
  const store = useStore();

  const { isShow, handleShow } = showEffect();

  const handleKeyDownIntagInput = (e) => {
    if (e.keyCode === 13) {
      store.commit('pages/addTag', e.target.value);
      e.target.value = '';
    }
    if (e.keyCode === 8 && e.target.value === '') {
      handleShow(false);
    }
  };

  const focusToTagInput = () => {
    nextTick(() => {
      document.getElementById('tagNameInput').focus();
    });
  };

  const showTagNameInput = () => {
    handleShow(true);
    focusToTagInput();
  };

  const deleteTag = (e, tag) => {
    store.commit('pages/deleteTag', tag);
    focusToTagInput();
  };

  const hiddenTagNameInputByClick = (e) => {
    if (!isShow.value) return;
    if (e.target.closest('#tagsfield') || e.target.closest('.tag')) return;
    handleShow(false);
  };

  return {
    isShow,
    handleKeyDownIntagInput,
    showTagNameInput,
    hiddenTagNameInputByClick,
    deleteTag,
  };
};

export default {
  name: 'PageInfo',
  props: ['page'],
  setup(props) {
    const createdTime = computed(() => transTimeStampToLocalTime(props.page.createdTime));
    const editTime = computed(() => transTimeStampToLocalTime(props.page.editTime));

    const {
      isShow,
      handleKeyDownIntagInput,
      showTagNameInput,
      hiddenTagNameInputByClick,
      deleteTag,
    } = usePageTagEffect();

    document.addEventListener('click', (e) => hiddenTagNameInputByClick(e));

    return {
      createdTime,
      editTime,
      handleKeyDownIntagInput,
      isShow,
      showTagNameInput,
      hiddenTagNameInputByClick,
      deleteTag,
    };
  },
};
</script>

<style lang="scss" scoped>
.pageinfo{
  font-size: 13px;
  border-bottom: 1px solid #dbdbdb;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: .5rem;
  &-item{
    display: flex;
    min-height: 2.5rem;
    &-icon{
      width: 1.7rem;
    }
    &-name{
      margin-left: .3rem;
      margin-right: .5rem;
      display: flex;
      color: #adadad;
      min-width: 8rem;
    }
    &-content{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      color: #646464;
      input{
        width: 100%;
        &::placeholder{
          color: #c4c4c4;
        }
      }
    }
  }
}
.tag{
      line-height: 1.5rem;
      height: 1.5rem;
      border-radius: .3rem;
      padding: 0 .4rem;
      margin-right: .4rem;
      margin-bottom: .4rem;
      color: #525252;
      background: #dfdfdf;
      display: flex;
      &-content{
        position: relative;
        &-delete{
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          transform: translate(-50%, -50%);
          color: transparent;
          text-align: center;
          font-weight: 700;
          &:hover{
            color: #636363;
          }
        }
      }
      &:hover{
        color: #c5c5c5;
      }
    }
.addtag{
  color: #adadad;
  transition: color .3s ease-out ;
  &:hover{
    color: #7e7e7e;
  }
}

</style>
