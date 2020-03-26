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
            <li @click.stop="clickSearchItem(val)" class="search-item ub-box ub-ver z-box-sizing-border" v-for="(val, i) in currSearchList" :key="i">
              <van-icon name="search" class="z-margin-right-10-px z-color-999"/>
              <p class="ub-flex-1 z-color-333 z-font-size-14">{{val.val}}</p>
              <span class="z-font-size-12 z-color-999">约{{val.num}}个结果</span>
            </li>
            <li @click.stop="clickSearchItem(searchVal)" v-if="currSearchList.length===0" class="search-item ub-box ub-ver z-box-sizing-border">
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
            <li @click.stop="clickSearchItem(val)" v-for="(val, idx) in guess" :key="idx" class="item z-font-size-13 z-color-333">{{val.name}}</li>
          </ul>
        </dd>
        <dd class="z-margin-h-8-px z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box ub-between">
          <p class="z-font-size-14 z-color-888">历史搜索</p>
        </dd>
        <dd class="z-margin-h-8-px z-width-100-percent z-box-sizing-border z-bg-color-fff z-padding-all-8-px ub-box">
          <ul class="ub-box ub-wrap">
            <li @click.stop="clickSearchItem(val)" v-for="(val, idx) in history" :key="idx" class="item z-font-size-13 z-color-333">{{val.name}}</li>
          </ul>
        </dd>
      </div>
    </dl>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        searchVal: '',
        // 测试搜索结果集
        searchAllList: [
          {id: '1', val: '我呀便当', num: '7'},
          {id: '2', val: '我家黑鱼馆', num: '5'},
          {id: '3', val: '我家酸菜鱼', num: '3'},
          {id: '4', val: '我家厨房', num: '1'},
          {id: '5', val: '我家吃铺', num: '1'},
          {id: '6', val: '我的店', num: '2'},
          {id: '7', val: '我爱水果', num: '3'},
          {id: '8', val: '我家美蛙鱼头', num: '1'},
          {id: '9', val: '我家黑鱼', num: '2'},
          {id: '10', val: '我的巧克力', num: '1'},
          {id: '11', val: '我的公寓', num: '1'},
          {id: '12', val: '我香我逸西餐厅', num: '1'}
        ],
        currSearchList: [], // 当前根据搜索关键词搜索到的列表
        guess: [
          {goodId: '1', name: '牛肉'}, {goodId: '2', name: '猪肉'},
          {goodId: '3', name: '草莓'}, {goodId: '4', name: '西瓜'},
          {goodId: '5', name: '车厘子'}, {goodId: '6', name: '芒果'}
        ],
        history: [
          {goodId: '6', name: '草莓'},
          {goodId: '3', name: '葡萄'}
        ]
      }
    },
    methods: {
      doInput (e) {
        this.searchVal = e.mp.detail.value
        this.filterList()
      },
      doSearch (e) {
        this.searchVal = e.mp.detail.value
      },
      filterList () {
        this.currSearchList = this.searchAllList.filter(item => {
          if (item.val.indexOf(this.searchVal) >= 0) return item
        })
      },
      clickSearchItem (val) {
        this.$redirectTo('/pages/searchFood/main')
      }
    },
    mounted () {
      this.searchVal = ''
      this.currSearchList = JSON.parse(JSON.stringify(this.searchAllList))
    },
    onShow () {
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
