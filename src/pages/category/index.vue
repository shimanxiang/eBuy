<template>
  <div class="category-container">
    <!-- 顶部搜索 -->
    <dl class="searchBox ub-box ub-ver">
      <dd class="ub-flex-1 ub-box ub-ver">
        <div @click.stop="$openWin('/pages/search/main')" class="search ub-box ub-ver-v z-width-93-percent z-box-sizing-border">
          <van-icon name="search" />
          <span class="z-font-size-13 z-margin-left-8-px">搜索你想要的生鲜</span>
        </div>
      </dd>
      <dd class="rightOpr z-font-size-13"><span>搜索</span></dd>
    </dl>
    <!-- 主体内容 -->
    <div class="content">
      <ul class="left">
        <li v-for="(cate1, index) in categories"
          :key="cate1.categoryId"
          @click="activeIndex = index"
          :class="{ active: activeIndex === index }">{{ cate1.categoryName }}</li>
      </ul>
      <div class="right" v-if="isInit">
        <ul class="list">
          <li class="cate3"
            v-for="(cate3, subIndex) in categories[activeIndex].productList"
            :key="cate3.id"
            @click="toSearch(cate3.id)"
          >
            <image :src="cate3.mainImg" alt="" class="z-width-100-percent z-img-cover"/>
            <p>{{ cate3.prodName }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { apiProductWithCategory } from '@/request/api.js'
export default {
  data () {
    return {
      activeIndex: 0,
      categories: [],
      isInit: false
    }
  },
  mounted () {
    this.getCategories()
  },
  methods: {
    // getCategories () {
    //   this.categories = [{
    //     categoryId: 1,
    //     categoryName: '热门推荐',
    //     pid: 0,
    //     icon: '',
    //     productList: [{
    //       categoryId: 12,
    //       categoryName: '排骨',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }, {
    //       categoryId: 13,
    //       categoryName: '腊肉',
    //       icon: 'http://p0.meituan.net/codeman/a97baf515235f4c5a2b1323a741e577185048.jpg'
    //     }, {
    //       categoryId: 14,
    //       categoryName: '冬笋',
    //       icon: 'http://p0.meituan.net/codeman/daa73310c9e57454dc97f0146640fd9f69772.jpg'
    //     }]
    //   }, {
    //     categoryId: 2,
    //     categoryName: '新鲜水果',
    //     pid: 0,
    //     icon: '',
    //     productList: [{
    //       categoryId: 15,
    //       categoryName: '草莓',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }, {
    //       categoryId: 16,
    //       categoryName: '车厘子',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }, {
    //       categoryId: 17,
    //       categoryName: '葡萄',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }]
    //   }, {
    //     categoryId: 3,
    //     categoryName: '时令蔬菜',
    //     pid: 0,
    //     icon: '',
    //     productList: [{
    //       categoryId: 18,
    //       categoryName: '菠菜',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }, {
    //       categoryId: 19,
    //       categoryName: '胡萝卜',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }, {
    //       categoryId: 20,
    //       categoryName: '卷心菜',
    //       icon: 'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg'
    //     }]
    //   }]
    //   this.isInit = true
    // },
    async getCategories () {
      let ret = await apiProductWithCategory()
      this.categories = []
      if (ret.data.resultCode === '000001') {
        this.categories = ret.data.resultObject.slice()
      }
      this.isInit = true
      console.log(this.categories)
    },
    toSearch (id) {
      wx.navigateTo({url: '/pages/goodDetail/main?id=' + id})
    }
  }
}
</script>

<style lang="less">
.searchBox {
  margin-right: 10px;
  .search{
    height:28px;
    background:rgba(247,247,247,1);
    border-radius:6px;
    color: #D0D0D0;
    padding-left: 10px;
  }
  .rightOpr{
    font-weight: bold;
  }
  .icon-sousuo{
    padding-left: 10px;
  }
}
.category-container{
  .content {
    display: flex;
    position: absolute;
    top: 60rpx;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    padding-top: 20rpx;
    .left {
      width: 102px;
      overflow: auto;
      border-top: 1px solid #F5F5F5;
      border-right: 1px solid #EDEDED;
      li {
        width: 100%;
        color: #B5B5B5;
        height: 90rpx;
        box-sizing: border-box;
        line-height: 90rpx;
        text-align: center;
        font-size: 13px;
        &.active {
          color: #222222;
          background-color: #F7F7F7;
          position: relative;
          font-weight: bold;
          &::before {
            position: absolute;
            content: "";
            width: 6rpx;
            height: 90rpx;
            left: 0;
            top: 0rpx;
          }
        }
      }
    }
    .right {
      flex: 1;
      height: 100%;
      padding: 0 16rpx;
      overflow: auto;
      border-top: 1px solid #F5F5F5;
      padding-top: 25px;
      color: #222222;
      font-weight: bold;
      .list {
        display: flex;
        flex-wrap: wrap;
        .cate3 {
          width: 50%;
          text-align: center;
          margin-bottom: 25px;
          image {
            width: 64px;
            height: 64px;
          }
          p {
            font-size: 24rpx;
            margin-top: 14rpx;
          }
        }
      }
    }
  }
}
</style>
