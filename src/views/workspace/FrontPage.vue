<template>
  <div class="base">
  <div class="base-container">
    <div class="base-title">
      <div class="base-title-first">N</div>
      <!-- <div class="base-title-second">ote</div> -->
    </div>
    <div class="base-small">區塊構成的世界...</div>
    <div class="base-intro">
      <div class="base-intro-quote">Note是一個筆記軟體</div>
      <br>
      <br>
      <div class="base-intro-text">
        <p>使用不同的區塊工具</p>
        <p>來記錄<span>文字</span>、影片、圖像等載體...</p>
        <p></p>
        <p></p>
        <!-- <p>使用區塊工具</p>
        <p>來記錄文字、影片</p>
        <p>圖像等載體...</p> -->
        <br>
        <!-- <br> -->
        <p>也能夠創建頁面</p>
        <p>來為多個不同區塊分類</p>
        <br>
        <br>
        <!-- <p>更多說明參考</p> -->

      </div>
      <!-- <p>左方側邊欄可以創建頁面、區塊</p>
      <p>在頁面中，可以創建無數的區塊</p>
      <p>甚至是内嵌頁</p>
      <p>而不同種類的區塊有不同的功能</p> -->
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'FrontPage',
};
</script>

<style lang="scss" scoped>
.base{
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  &-title{
    width: 100%;
    color: #685d68;
    color: #504952;
    height: 12rem;
    // margin-top: 12rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    &-first{
      // background: #504952;
      // background: #645b66;
      // background: #584d58;
      // background: #685d68;
      background: #575157;
      color: #F1F0EA;
      // color: #645b66;
      font-size: 8rem;
      font-weight: bold;
      line-height: 9rem;
      box-shadow: 2px 1px 6px 0 #afafaf;
      border-radius: .5rem;
      // margin: 0 .1rem 0 1.5rem;
      padding: 0 .7rem;
    }
    &-second{
      box-shadow: .1rem .1rem .3rem .1rem #858585;
      font-size: 2rem;
      font-weight: 900;
      padding: 0 .5rem;
      border-radius: .5rem;
      color: #645b66;
    }
  }
  &-small{
    margin: .7rem;
    padding-left: .7rem;
    text-align: center;
    color: #999999;
    transform: scale(.85);
  }
  &-intro{
    text-align: center;
    color: #5f5661;
    margin-top: 3rem;
    &-quote{
      margin-left: .5rem;
      font-size: 1.3rem;
      font-weight: bold;
      color: #69646b;
    }
    &-text{
      color: #807883;
      p {
        margin-bottom: .5rem;
      }
    }
  }
}
</style>
