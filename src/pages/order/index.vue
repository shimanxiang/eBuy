<template>
  <div class="order-confirm">
    <van-tabs :value="activeName" :active="defaults" title-inactive-color="#888888" :border="false" line-width="22" @change="clickTabs">
      <van-tab title="配送" name="1">
        <div class="content">
        <div class="select-box">
          <div class="select-address" @click="selectAddress" v-if="!selectedAddressInfo.id">选择收货地址 ></div>
          <div class="select-address" @click="selectAddress" v-else>
            {{selectedAddressInfo.code1}}{{selectedAddressInfo.code2}}{{selectedAddressInfo.code3}}{{selectedAddressInfo.addressDetails}} >
            <div class="address-tel"><span class="address-name">{{selectedAddressInfo.name}}</span><span>{{selectedAddressInfo.telephone}}</span></div>
          </div>
          <van-divider :style="{ padding: '0px' }"/>
          <div @click="showTimeSelected"><span>配送时间</span><span class="send-time">{{time}}></span></div>
        </div>
      </div>
      </van-tab>
      <van-tab title="自提" name="2">
        <div class="content">
          <div class="select-box" v-show="listSites[defalutSitesIndex]">
            <div class="select-address" @click="selectAddress">
               {{listSites[defalutSitesIndex].code1}}{{listSites[defalutSitesIndex].code2}}{{listSites[defalutSitesIndex].code3}}{{listSites[defalutSitesIndex].addressDetails}} >
                <div class="address-tel"><span class="address-name">{{listSites[defalutSitesIndex].name}}</span><span>{{listSites[defalutSitesIndex].telephone}}</span></div>
            </div>
            <van-divider :style="{ padding: '0px' }"/>
            <div @click="showTimeSelected"><span>自提时间</span><span class="send-time">{{time}} ></span></div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <scroll-view scroll-y scroll-top="0">
      <div class="order-food">
        <dl class="z-width-100-percent ub-box ub-col">
          <dd v-for="item in shopList" :key="item.id" class="order z-width-100-percent ub-box z-box-sizing-border">
            <img class="z-img-cover" :src="item.image" />
            <div class="ub-flex-1 z-padding-left-10-px ub-box ub-col">
              <span class="z-font-size-13 z-color-333 z-margin-bottom-10-px z-margin-top-12-px z-font-weight-bold">{{item.prodName}}</span>
              <span class="z-font-size-11 z-color-888 z-margin-bottom-3-px">规格：{{item.specDesc}}&nbsp;&nbsp;&nbsp;{{item.price}}x{{item.num}}</span>
            </div>
            <span class="z-font-size-15 z-margin-top-12-px z-font-weight-bold">¥{{item.total}}</span>
          </dd>
        </dl>
        <div class="line-box z-margin-top-10-px"><span>包装费</span><span class="fr">¥{{orderInfo.packingCharges}}</span></div>
        <div class="line-box"><span>配送费</span><span class="fr">¥{{orderInfo.distributionFee}}</span></div>
        <div class="line-box"><span>优惠券</span><span v-if="hasCoupon">
          <!-- <span @click="chooseCoupon" v-if="1" class="fr flex-middle-center z-color-888">2张可用 <van-icon name="arrow" /></span> -->
          <span class="fr red" @click="chooseCoupon(orderInfo.couponId)">{{orderInfo.couponName}}&nbsp;&nbsp;&nbsp;&nbsp;-{{orderInfo.couponDenomination}}<span class="z-color-888" style="vertical-align: middle;margin-left: 5px;"><van-icon name="arrow" /></span></span>
        </span>
        <span v-else class="fr flex-middle-center z-color-888">暂无可用优惠券</span></div>
      </div>
    </scroll-view>
    <div class="bottom-card">
		<div class="left-bottom">
			<span class="total-name">合计</span>
			<span class="shop-price"><span class="z-font-size-12 red">¥</span><span class="z-font-size-18 red">{{orderInfo.orderFee}}</span></span>
		</div>
		<div class="right-bottom" @click="clickSubmitOrder">提交订单</div>
	</div>
  <van-overlay :show="isShow" @click="isShow = false">
    <div class="wrapper" @click.stop>
      <scroll-view scroll-y scroll-top="0" class="address-scroll">
        <div class="ub-box ub-col">
          <div class="address-list" @click="selectedAddress(index)" v-for="(item, index) in maskAddressList" :key="item.id">
            <div class="address">{{item.code1}}{{item.code2}}{{item.code3}}{{item.addressDetails}}<span class="address-defalut" v-if="item.isDefault == '1'">默认</span></div>
            <div class="address-tel"><span class="address-name">{{item.name}}</span><span>{{item.telephone}}</span></div>
          </div>
        </div>
      </scroll-view>
      <div class="add-address" @click="gotoaddAddress" v-show="activeName == 0">+ 新增收货地址</div>
    </div>
  </van-overlay>
  <van-overlay :show="isShowTime" @click="isShowTime = false">
    <div class="wrapper" @click.stop>
      <div class="wrapper-content">
        <ul class="left">
          <li>今天</li>
        </ul>
        <div class="right">
          <scroll-view scroll-y scroll-top="0" class="address-scroll">
            <ul class="list" @click="handTime(index)" v-for="(item, index) in deliverTime" :key="index">
              <li :class="selectedIndex == index ? 'active' : ''">{{item}}
                <van-checkbox v-model="checked" class="vant-checkbox-custom" v-if="selectedIndex == index"></van-checkbox>
              </li>
            </ul>
          </scroll-view>
        </div>
      </div>
    </div>
  </van-overlay>
  </div>
</template>
<script>
  import { apigetAddress, apiPostOrderInfo, apiDoUnifiedOrder, apiGetListSites } from '@/request/api.js'
  export default {
    data () {
      return {
        checked: true,
        time: '选择时间',
        hasCoupon: false,
        selectedIndex: -1,
        deliverTime: [],
        orderInfo: {},
        defaults: '1',
        activeIndex: 0,
        isShow: false,
        isShowTime: false,
        activeName: 0,
        selectedAddressInfo: {},
        addressList: [],
        shoppingCarIds: '',
        shopList: [],
        loading: false,
        listSites: [],
        maskAddressList: [],
        defalutSitesIndex: 0
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo || wx.getStorageSync('userInfo')
      }
    },
    methods: {
      async getAddress () {
        let ret = await apigetAddress()
        this.addressList = []
        if (ret.data.resultCode === '000001') {
          this.addressList = ret.data.resultObject.slice()
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          })
        }
      },
      async getListSites () {
        let ret = await apiGetListSites()
        this.listSites = []
        if (ret.data.resultCode === '000001') {
          this.listSites = ret.data.resultObject.slice()
        } else {
          wx.showToast({
            title: '自提站点查询失败',
            icon: 'none'
          })
        }
      },
      clickTabs (e) {
        this.activeName = +e.target.index
      },
      selectAddress () {
        if (this.addressList.length === 0 && this.activeName === 0) {
          this.gotoaddAddress()
        } else {
          if (this.activeName === 0) {
            this.maskAddressList = this.addressList.slice()
          } else {
            this.maskAddressList = this.listSites.slice()
          }
          this.isShow = true
        }
      },
      selectedAddress (index) {
        if (this.activeName === 0) {
          // 配送
          this.selectedAddressInfo = this.addressList[index]
        } else {
          // 自提
          this.defalutSitesIndex = index
        }
        this.isShow = false
      },
      showTimeSelected () {
        this.isShowTime = true
      },
      handTime (index) {
        this.selectedIndex = index
        this.isShowTime = false
        this.time = this.deliverTime[index]
      },
      gotoaddAddress () {
        wx.navigateTo({url: '/pages/address/main'})
      },
      clickSubmitOrder () {
        if (!this.userInfo.openId) {
          wx.showToast({
            title: '请先登录',
            icon: 'none'
          })
          return false
        }
        if (this.selectedIndex < 0) {
          wx.showToast({
            title: '请先选择时间',
            icon: 'none'
          })
          return false
        }
        if (!this.selectedAddressInfo.id && this.activeName === 0) {
          wx.showToast({
            title: '请先选择地址',
            icon: 'none'
          })
          return false
        }
        if (this.shopList.length === 0) {
          wx.showToast({
            title: '请先选择商品',
            icon: 'none'
          })
          return false
        }
        let prodSpec = []
        for (let i = 0; i < this.shopList.length; i++) {
          const element = this.shopList[i]
          prodSpec.push({
            num: element.num,
            prodId: element.prodId,
            specId: element.specId
          })
        }
        if (this.loading) return false
        this.loading = true
        this.postOrderInfo(prodSpec)
      },
      async postOrderInfo (prodSpec) {
        let deliveryType = this.activeName === 0 ? 1 : 2
        let ret = await apiPostOrderInfo({
          addressId: this.activeName === 0 ? this.selectedAddressInfo.id : '',
          couponId: this.orderInfo.couponId,
          deliveryTime: this.time,
          deliveryType: deliveryType,
          integral: 0,
          prodSpec: prodSpec,
          shoppingCarIds: this.shoppingCarIds,
          siteId: this.activeName === 0 ? '' : this.listSites[this.defalutSitesIndex].id
        })
        if (ret.data.resultCode === '000001') {
          this.loading = false
          this.doUnifiedOrder(ret.data.resultObject)
        } else {
          this.loading = false
          wx.showToast({
            title: ret.data.resultObject,
            icon: 'none'
          })
        }
      },
      async doUnifiedOrder (orderId) {
        if (this.loading) return false
        this.loading = true
        let ret = await apiDoUnifiedOrder({
          openId: this.userInfo.openId,
          orderId: orderId
        })
        if (ret.data.resultCode === '000001') {
          this.loading = false
          let data = ret.data.resultObject
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: data.signType,
            paySign: data.paySign,
            success (res) {
              wx.showToast({
                title: '支付成功'
              })
              wx.redirectTo({
                url: '/pages/orderDetail/main?id=' + orderId
              })
            },
            fail (res) {
              wx.showToast({
                title: res,
                icon: 'none'
              })
            }
          })
        } else {
          this.loading = false
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      },
      chooseCoupon (couponId) {
        let arr = []
        for (let i = 0; i < this.shopList.length; i++) {
          const element = this.shopList[i].prodId
          arr.push(element)
        }
        wx.removeStorageSync('proIds')
        wx.setStorageSync('proIds', arr)
        wx.navigateTo({url: '/pages/card/main?canUse=1&couponId=' + couponId + '&fee=' + this.orderInfo.orderFee})
      }
    },
    mounted () {
      this.isShow = false
      this.isShowTime = false
    },
    onShow () {
      let couponInfo = wx.getStorageSync('couponInfo')
      if (couponInfo) {
        this.orderInfo.couponDenomination = couponInfo.denomination
        this.orderInfo.couponId = couponInfo.id
        this.orderInfo.couponName = couponInfo.couponName
      }
      wx.setNavigationBarTitle({title: '提交订单'})
    },
    onLoad (options) {
      if (options.id) {
        this.selectedAddressInfo = {
          id: options.id,
          code1: options.code1,
          code2: options.code2,
          code3: options.code3,
          addressDetails: options.addressDetails,
          telephone: options.telephone,
          name: options.name
        }
      } else {
        this.selectedAddressInfo = {}
      }
      this.orderInfo = wx.getStorageSync('shopCartList')
      this.shopList = this.orderInfo.prodItemList.slice()
      this.deliverTime = this.orderInfo.deliverTime.slice()
      this.shoppingCarIds = this.orderInfo.shoppingCarIds.join()
      if (this.orderInfo.availableCouponFlag === '1') {
        this.hasCoupon = true
      } else {
        this.hasCoupon = false
      }
      if (this.orderInfo.address) {
        this.selectedAddressInfo = {
          id: this.orderInfo.address.id,
          code1: this.orderInfo.address.code1,
          code2: this.orderInfo.address.code2,
          code3: this.orderInfo.address.code3,
          addressDetails: this.orderInfo.address.addressDetails,
          telephone: this.orderInfo.address.telephone,
          name: this.orderInfo.address.name
        }
      }
      for (let i = 0; i < this.shopList.length; i++) {
        this.shopList[i].total = (this.shopList[i].num * this.shopList[i].price * 100) / 100
      }
      this.getAddress()
      this.getListSites()
    }
  }
</script>
<style lang="less" scoped>
.order-confirm{
  min-height: 100%;
  background:rgba(247,247,247,1);
  .line-box{
    font-size:78%;
    color:rgba(34,34,34,1);
    padding: 8px 15px 0px 15px;
    font-weight: 600;
    .red{
      color: #E43A4B;
    }
    .fr{
      float: right;
      font-weight: bold;
    }
  }
  .content {
    padding: 10px;
    .select-box{
      background:rgba(255,255,255,1);
      border-radius:6px;
      padding: 15px;
      color:rgba(34,34,34,1);
      font-size: 14px;
      font-weight: bold;
      .select-address{
        font-size:16px;
      }
      .address-tel{
        font-size: 13px;
        color: #222222;
        font-weight: normal;
        margin-top: 7px;
      }
      .send-time{
        font-size: 13px;
        float: right;
      }
    }
  } 
}
.order-food{
  border-radius:6px;
  padding-bottom: 15px;
  background: white;
  margin: 0 10px 60px 10px;
}
.wrapper{
  border-radius:16px 16px 0px 0px;
  height: 45%;
  width: 100%;
  position: absolute;
  bottom: 0;
  background: white;
  padding: 25px 15px 15px 15px;
  box-sizing: border-box;
  .wrapper-content {
    display: flex;
    overflow: hidden;
    position: relative;
    bottom: 10px;
    height: 100%;
    .left {
      width: 70px;
      overflow: auto;
      li {
        width: 100%;
        height: 90rpx;
        box-sizing: border-box;
        text-align: center;
        font-size: 13px;
      }
    }
    .right {
      flex: 1;
      padding: 0 16rpx;
      color: #888888;
      .list {
        li{
          padding-bottom: 15px;
        }
        .vant-checkbox-custom{
          margin-left: 5px;
          float: right;
          transform: scale(0.7);
          margin-top: -2px;
        }
      }
    }
  }
  .address-scroll{
    height: 80%;
    .address-list{
      margin-bottom: 20px;
      padding-left: 20px;
      padding-right: 20px;
      .address{
        font-size:15px;
        font-weight: bold;
        .address-defalut{
          display: inline-block;
          width:34px;
          height:20px;
          background:rgba(255,109,134,1);
          font-size:12px;
          color: white;
          margin-left: 15px;
          text-align: center;
          line-height: 20px;
        }
      }
      .address-tel{
        font-size: 13px;
        margin-top: 7px;
        .address-name{
          margin-right: 5px;
        }
      }
    }
  }
  .add-address{
    font-size:15px;
    font-weight:bold;
    padding-left: 20px;
    position: fixed;
    bottom: 25px;
  }
}
.order{padding: 15px 15px 0px 15px;}
.order img{width: 66px; height: 66px;}
.flex-middle-center{
  display: flex;
  justify-items: center;
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
</style>
