<template>
  <ContentEditable
      v-if="!block.content.url"
      :placeholder="'ctrl + v 貼上網址'"
      @paste.stop="pasteLinkAction"
      @keydown.stop="(e) => deleteInput(e, block)"
      @focus="() => setFocusBlock(block.id)"/>
  <div class="lp-container" v-if="block.content.url" @click="openInNewTab(block.content.url)">
    <div class="lp-img" :style="{ 'background-image': `url(${block.content.image})` }"></div>
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">{{ block.content.title }}</h6>
        <p class="card-text">{{ block.content.description }}</p>
        <p class="card-url">{{ block.content.url }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ContentEditable from '../input/ContentEditable.vue';
import commonUpdateEffect from '../../views/commonUpdataEffect';

export default {
  name: 'LinkPreview',
  props: ['block'],
  components: {
    ContentEditable,
  },
  setup(props) {
    const {
      editBlockData,
      deleteInput,
      setFocusBlock,
    } = commonUpdateEffect();

    const linkPreviewAPI = 'https://api.linkpreview.net';
    const MyLinkPreviewAPIKey = 'a1f90b74d8c73d2e2ca415e33bc74ae7';

    const getLinkData = async (link) => {
      const data = {
        key: MyLinkPreviewAPIKey,
        q: link,
      };

      try {
        const response = await fetch(linkPreviewAPI, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(data),
        });
        const result = await response.json();
        return result;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    const pasteLinkAction = async () => {
      try {
        const text = await navigator.clipboard.readText();
        editBlockData(props.block.id, {
          title: '',
          description: '',
          image: '',
          url: text,
        }, 'content');

        const data = await getLinkData(text);
        editBlockData(props.block.id, {
          title: data.title || '無法顯示',
          description: data.description || '',
          image: data.image || '',
          url: data.url || text,
        }, 'content');
      } catch (error) {
        console.log(error);
      }
    };

    const openInNewTab = (link) => {
      window.open(link, '_blank');
    };

    return {
      pasteLinkAction,
      deleteInput,
      setFocusBlock,
      openInNewTab,
    };
  },
};
</script>

<style lang="scss" scoped>
.lp {
  &-container {
    width: 100%;
    display: flex;
    border: 1px solid rgb(218, 218, 218);
    border-radius: 5px;

    :hover {
      background-color: rgb(238, 238, 238);
      cursor: pointer;
    }
    .card {
      flex: 1;
      border: none;
      &-title {
        font-weight: 700;
        height: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &-text {
        height: 50px;
        overflow: hidden;
        color: rgba($color: #626262, $alpha: .7);
        font-size: .6em;
        margin-bottom: 0;
      }
      &-url {
        margin-top: .5rem;
        font-size: .6em;
        height: 18px;
        margin-bottom: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  &-img {
    flex-basis: 200px;
    height: inherit;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;

    transition: display .5s ease-in-out;
    @media (max-width: 490px ) {
      display: none;
    }
  }
}

</style>
