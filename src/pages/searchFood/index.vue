<template>
  <div class="search-container">
    <van-tabs v-model="active" title-active-color="#222222" title-inactive-color="#B5B5B5" @change="clickTabs">
      <van-tab title="默认"></van-tab>
      <van-tab title="价格"></van-tab>
      <van-tab title="销量"></van-tab>
    </van-tabs>
    <scroll-view scroll-x="true" class="food-scroll" @scrolltolower="scroll" v-if="foodList.length > 0">
      <div :class="index % 2 == 0 ? 'food-box mr10' : 'food-box'" v-for="(list, index) in foodList" :key="list.id" @click.stop="goDetail(list.id)">
        <div class="food-img"><img :src="list.mainImg" alt="" class="z-img-cover"></div>
        <div class="food-name">{{list.prodName}}</div>
        <div class="food-desc">{{list.prodDesc}}</div>
        <div class="tl"><span class="food-price">¥{{list.presentPrice}}&nbsp;</span><span class="food-weight">/{{list.specList[0].specDesc}}</span>
          <div class="editIcon" @click.stop="addCart(list)"><img src="/static/images/edit.png" alt="" srcset="" /></div>
        </div>
      </div>
    </scroll-view>
    <dd v-else class="no-order">
      实在找不到您要的东西~
    </dd>
  </div>
</template>
<script>
  import { apiGetProductSortSearch, apiAddShoppingCar } from '@/request/api.js'
  export default {
    data () {
      return {
        active: 2,
        searchValue: '',
        pageIndex: 1,
        pageSize: 10,
        foodList: [],
        loading: false,
        fininshed: false,
        sortType: '',
        sortColumn: ''
      }
    },
    methods: {
      async getProductSearch () {
        if (this.loading) return false
        this.loading = true
        let ret = await apiGetProductSortSearch({
          searchValue: this.searchValue,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          sortColumn: this.sortColumn,
          sortType: this.sortType
        })
        this.foodList = []
        if (ret.data.resultCode === '000001') {
          if (this.pageIndex > 1) {
            this.foodList = this.foodList.concat(ret.data.resultObject)
          } else {
            this.foodList = ret.data.resultObject.slice()
          }
          if (ret.data.resultObject.length < this.pageSize) {
            this.fininshed = true
          }
          this.loading = false
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          })
          this.loading = false
        }
      },
      goDetail (id) {
        wx.navigateTo({url: '/pages/goodDetail/main?id=' + id})
      },
      clickTabs (e) {
        if (e.mp.detail.title === '销量') {
          this.sortType = 'S'
          this.sortColumn = ''
        } else if (e.mp.detail.title === '价格') {
          this.sortType = 'P'
          // let _this = this
          // wx.showActionSheet({
          //   itemList: ['升序', '降序'],
          //   success (res) {
          //     _this.sortColumn = 'D'
          //     console.log(res.tapIndex)
          //     if (_this.)
          //   },
          //   fail (res) {
          //     console.log(res.errMsg)
          //   }
          // })
        } else {
          this.sortType = ''
          this.sortColumn = ''
        }
        this.pageIndex = 1
        this.fininshed = false
        this.loading = false
        this.getProductSearch()
      },
      scroll () {
        if (this.loading) return false
        if (this.fininshed) return false
        this.pageIndex += 1
        this.getProductSearch()
      },
      addCart (list) {
        this.addShoppingCar(list)
      },
      async addShoppingCar (list) {
        if (this.loading) return false
        this.loading = true
        let ret = await apiAddShoppingCar({
          num: 1,
          productId: list.id,
          specId: list.specList[0].id
        })
        if (ret.data.resultCode === '000001') {
          wx.showToast({
            title: '添加成功~',
            icon: 'success'
          })
          this.loading = false
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
          this.loading = false
        }
      }
    },
    onShow () {
      this.pageIndex = 1
      this.fininshed = false
      this.loading = false
      this.getProductSearch()
      wx.setNavigationBarTitle({title: this.searchValue})
    },
    onLoad (options) {
      if (options.search) {
        this.searchValue = options.search
      }
    }
  }
</script>
<style lang="less">
.search-container{
    width:100%;
    background:rgba(248,248,248,1);
    min-height: 100%;
    .no-order{
      color: #888888;
      text-align: center;
      font-size: 13px;
      margin-top: 20px;
    }
    .van-hairline--top-bottom:after{
        border-width: 0;
    }
    .van-tabs__line{
        display: none;
    }
    .van-tab--active{
        font-size: 13px;
    }
    .food-scroll{
      padding: 15px;
      box-sizing: border-box;
      text-align: left;
      .editIcon{
        position: relative;
        img{
          position: absolute;
          width: 50rpx;
          height: 50rpx;
          right: 9px;
          z-index: 9999;
          top: -44rpx;
        }
      }
    }
    .mr10{
      margin-right: 10px;
    }
    .food-box{
        background-color: #fff;
        width: 165px;
        height: 220px;
        display: inline-block;
        border-radius:3px;
        padding-left: 10px;
        box-sizing: border-box;
        margin-bottom: 15px;
        white-space: nowrap;
        .food-img{
            width: 147px;
            height: 122px;
            background:rgba(248,248,248,1);
            margin-top: 11px;
            text-align: center;
        img{
            width: 128px;
            height: 102px;
            margin-top: 21rpx;
        }
        }
        .food-name{
            font-size:13px;
            font-weight:bold;
            color:rgba(34,34,34,1);
            margin-top: 10px;
            text-align: left;
        }
        .food-desc{
            font-size:11px;
            color:rgba(181,181,181,1);
            margin-top: 3px;
            margin-bottom: 5px;
            text-align: left;
            white-space: nospace;
            text-overflow: ellipsis;
            overflow: hidden;
            width: 130px;
        }
        .tl{
            text-align: left;
            margin-top: 10px;
        }
        .food-price{
            font-size:15px;
            font-weight:bold;
            color:rgba(228,58,75,1);
        }
        .food-weight{
            font-size:10px;
            font-weight:bold;
            color:rgba(136,136,136,1);
        }
    }
}
</style>
