<template>
  <div class="search-container-params">
    <dl class="searchBox ub-box ub-col">
      <dd class="z-width-100-percent z-padding-all-8-px z-bg-color-fff ub-box ub-ver z-box-sizing-border" style="80px;">
        <div class="ub-flex-1 search ub-box ub-ver-v">
          <van-icon name="search" />
          <input @input="doInput" @confirm="doSearch" class="ub-flex-1 z-padding-v-5-px z-margin-left-8-px" placeholder="西红柿炒蛋"/>
        </div>
        <span @click.stop="$backBeaforWin()" class="z-font-size-13 z-margin-left-8-px rightOpr">取消</span>
      </dd>
      <!--搜索值不为空的时候，显示搜索列表-->
      <div v-if="searchVal.length>0" class="ub-box ub-col" style="padding:8px 8px 0 8px">
        <scroll-view scroll-y style="height: calc(100vh - 80px)" scroll-top="0">
          <ul class="ub-box ub-col">
            <li @click.stop="clickSearchItem(searchVal)" class="search-item ub-box ub-ver z-box-sizing-border">
              <van-icon name="search" class="z-margin-right-10-px z-color-999"/>
              <p class="ub-flex-1 z-color-333 z-font-size-14">搜索"{{searchVal}}"</p>
              <van-icon name="arrow" class="z-color-999"/>
            </li>
          </ul>
         </scroll-view>
      </div>
      <!--搜索值为空的时候，显示猜你想找和历史搜索-->
      <div v-if="searchVal.length===0" class="ub-box ub-col">
        <dd class="z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box">
          <p class="z-font-size-14 z-color-888">猜你想找</p>
        </dd>
        <dd class="z-margin-h-8-px z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box">
          <ul class="ub-box ub-wrap">
            <li @click.stop="clickSearchItem(val)" v-for="(val, idx) in hotSearch" :key="idx" class="item z-font-size-13 z-color-333">{{val}}</li>
          </ul>
        </dd>
        <div v-if="history.length > 0">
          <dd class="z-margin-h-8-px z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box ub-between">
            <p class="z-font-size-14 z-color-888">历史搜索</p>
          </dd>
          <dd class="z-margin-h-8-px z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box">
            <ul class="ub-box ub-wrap">
              <li @click.stop="clickSearchItem(val)" v-for="(val, idx) in history" :key="idx" class="item z-font-size-13 z-color-333">{{val}}</li>
            </ul>
          </dd>
        </div>
      </div>
    </dl>
  </div>
</template>
<script>
  import { apiSearchList } from '@/request/api.js'
  export default {
    data () {
      return {
        searchVal: '',
        hotSearch: [],
        history: []
      }
    },
    methods: {
      async searchList () {
        let ret = await apiSearchList()
        this.hotSearch = []
        this.history = []
        if (ret.data.resultCode === '000001') {
          this.hotSearch = ret.data.resultObject.hotSearch.slice()
          this.history = ret.data.resultObject.searchHistory.slice()
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          })
        }
      },
      doInput (e) {
        this.searchVal = e.mp.detail.value
      },
      doSearch (e) {
        this.searchVal = e.mp.detail.value
      },
      clickSearchItem (val) {
        wx.navigateTo({url: '/pages/searchFood/main?search=' + val})
      }
    },
    mounted () {
      this.searchVal = ''
    },
    onShow () {
      this.searchList()
      wx.setNavigationBarTitle({title: '搜索'})
    }
  }
</script>
<style lang="less">
.searchBox {
  font-size: 12px;
  .search{
    height:28px;
    background:rgba(247,247,247,1);
    border-radius:6px;
    color: #D0D0D0;
  }
  .rightOpr{
    font-weight: bold;
    font-size: 13px;
  }
}
  .search-container-params{width:100%;height:100vh;background:#fff}
  .search{background: #f5f5f5;border-radius: 15px;padding: 0 10px}
  .search-item{border-bottom: 1px solid #eee;padding: 15px 0px;}
  .item{padding: 8px 10px;background: #f5f5f5;border-radius: 3px;margin: 0 8px 8px 0}
</style>
