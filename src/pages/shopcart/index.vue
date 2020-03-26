<template>
  <div class="shopcart-container ub-box" v-if="shopList.length > 0">
    <scroll-view scroll-y scroll-top="0" class="z-margin-all-10-px">
      <dl class="z-width-100-percent ub-box ub-col shopcart-dl">
       <dd v-for="(item, idx) in shopList" :key="item.orderId" @click="recover(idx)" @touchstart="touchStart($event)" @touchend="touchEnd($event,idx)" :data-type="item.slider" class="cart_shop_list order z-width-100-percent ub-box z-box-sizing-border">
         <van-checkbox v-model="item.isChecked" @click="checkChange(idx)" class="vant-checkbox-custom"></van-checkbox>
         <img class="z-img-cover" :src="item.image" />
         <div class="ub-flex-1 z-padding-left-10-px ub-box ub-col">
           <span class="z-font-size-13 z-color-333 z-margin-bottom-10-px z-margin-top-12-px z-font-weight-bold">{{item.prodName}}</span>
           <span class="z-font-size-11 z-color-888 z-margin-bottom-3-px">总价：{{item.weight}} * {{item.num}}</span>
         </div>
         <span class="z-font-size-15 z-margin-top-12-px z-font-weight-bold">¥{{item.price}}</span>
         <div class="delect" @click="delect(idx)">删除</div>
       </dd>
     </dl>
    </scroll-view>
    <div class="bottom-card">
		<div class="left-bottom">
			<span class="total-name">合计</span>
			<span class="shop-price"><span class="z-font-size-12 red">¥</span><span class="z-font-size-18 red">39.9</span></span>
		</div>
		<div class="right-bottom" @click="goOrder">提交订单</div>
	</div>
  </div>
  <div v-else>
    <div class="shopcart-empty">购物车空空如也~</div>
  </div>
</template>
<script>
import { apiListShoppingCar, apiDeleteShoppingCar } from '@/request/api.js'
export default {
  data () {
    return {
      isSelect: true,
      shopList: [{
        orderId: '101',
        img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
        name: '索菲特大酒店锦厨',
        num: '1',
        price: '11.0',
        weight: '500g',
        slider: 0,
        isChecked: false
      }, {
        orderId: '102',
        img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
        name: '索菲特大酒店锦厨',
        num: '1',
        price: '11.0',
        weight: '500g',
        isChecked: false,
        slider: 0
      }, {
        orderId: '103',
        img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
        name: '索菲特大酒店锦厨',
        num: '1',
        price: '11.0',
        weight: '500g',
        isChecked: false,
        slider: 0
      }, {
        orderId: '104',
        img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
        name: '索菲特大酒店锦厨',
        num: '1',
        price: '11.0',
        weight: '500g',
        isChecked: false,
        slider: 0
      }, {
        orderId: '105',
        img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
        name: '索菲特大酒店锦厨',
        num: '1',
        price: '11.0',
        weight: '500g',
        isChecked: false,
        slider: 0
      }],
      startX: 0,
      endX: 0
    }
  },
  methods: {
    checkChange (idx) {
      this.shopList[idx].isChecked = !this.shopList[idx].isChecked
    },
    goOrder () {
      let checkedList = []
      for (let i = 0; i < this.shopList.length; i++) {
        if (this.shopList[i].isChecked) {
          checkedList.push(this.shopList[i])
        }
      }
      wx.removeStorageSync('shopCartList')
      wx.setStorageSync('shopCartList', checkedList)
      wx.navigateTo({url: '/pages/order/main'})
    },
    // 滑动开始
    touchStart (e) {
      // 获取移动距离，可以通过打印出e，然后分析e的值得出
      console.log(e)
      this.startX = e.mp.changedTouches[0].clientX
    },
    // 滑动结束
    touchEnd (e, index) {
      // 获取移动距离
      console.log(e)
      this.endX = e.mp.changedTouches[0].clientX
      if (this.startX - this.endX > 10) {
        for (let i = 0; i < this.shopList.length; i++) {
          this.shopList[i].slider = 0
        }
        this.shopList[index].slider = 1
      } else if (this.startX - this.endX < -10) {
        for (let i = 0; i < this.shopList.length; i++) {
          this.shopList[i].slider = 0
        }
      }
    },
    delect (idx) {
      this.deleteShoppingCar(idx)
    },
    recover (idx) {
      this.shopList[idx].slider = 0
    },
    async getListShoppingCar () {
      let ret = await apiListShoppingCar()
      this.shopList = []
      if (ret.data.resultCode === '000001') {
        for (let i = 0; i < ret.data.resultObject.length; i++) {
          let obj = Object.assign({}, ret.data.resultObject[i])
          obj.isChecked = false
          obj.slider = 0
          this.shopList.push(obj)
        }
        console.log(this.shopList)
      }
    },
    async deleteShoppingCar (idx) {
      let ret = await apiDeleteShoppingCar()
      if (ret.data.resultCode === '000001') {
        this.shopList.splice(idx, 1)
      } else {
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    }
  },
  mounted () {
  },
  onShow () {
    wx.setNavigationBarTitle({title: '购物车'})
    this.getListShoppingCar()
  }
}
</script>
<style lang="less" scoped>
.shopcart-container{
  width:100%;
  height:100vh;
  background:rgba(247,247,247,1);
  .cart_shop_list[data-type="0"]{
      transform: translate3d(0,0,0);
      .delect{
        visibility: hidden;
      }
  }
  .cart_shop_list[data-type="1"]{
      transform: translate3d(-50px,0,0);
      .delect{
        visibility: show;
      }
  }
  .shopcart-dl{
    padding-bottom: 35px;
  }
  .delect{
    width: 50px;
    background-color: #FF4747;
    color: #fff;
    font-size: 26rpx;
    text-align: center;
    position: absolute;
    right: -43px;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
  .bottom-card{
    position: fixed;
    bottom: 0;
    width: 100%;
    height:44px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 3px 0px rgba(0,0,0,0.07);
    padding-bottom: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid rgba(0,0,0,0.07);
    .red{
      color: #E43A4B;
    }
    .shop-price{
      margin-left: 10px;
    }
    .left-bottom{
      width: 50%;
      display: inline-block;
      .total-name{
        font-size:10px;
        font-weight:bold;
        color:rgba(136,136,136,1);
        margin-left: 15px;
        line-height: 44px;
      }
    }
    .right-bottom{
      width: 50%;
      color: white;
      font-size: calc(15px);
      display: inline-block;
      height:calc(44px);
      text-align: center;
      line-height: 44px;
    }
  }
  .vant-checkbox-custom{
    width: 34px;
    position: relative;
    top: 26px;
    left: 3px;
  }
}
.order{margin-bottom: 10px; padding-left: 10px; padding-right:10px; padding-top: 7px;padding-bottom: 6px; border-radius: 6px;background:#fff}
.order img{width: 66px; height: 66px;}
.shopcart-empty{
  font-size: 13px;
  color: #b5b5b5;
  text-align: center;
  margin-top: 30%;
}
</style>
