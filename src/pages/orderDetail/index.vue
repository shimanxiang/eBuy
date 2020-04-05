<template>
  <div class="order-confirm">
    <van-tabs v-model="activeName" :active="defaluts" title-inactive-color="#888888" :border="false" line-width="22">
      <van-tab title="配送" :disabled="!isDelivery" name="1">
       <div class="content">
        <div class="select-box z-margin-bottom-10-px">
            <div class="status-txt">{{orderStatus[orderInfo.orderStatus]}}</div>
            <div class="status-tips-txt">{{orderStatusTips[orderInfo.orderStatus]}}</div>
        </div>
        <div class="select-box" v-if="selectedAddressInfo.id">
            <div class="select-address">
            {{selectedAddressInfo.code1}}{{selectedAddressInfo.code2}}{{selectedAddressInfo.code3}}{{selectedAddressInfo.addressDetails}}
            <div class="address-tel"><span class="address-name">{{selectedAddressInfo.name}}</span><span>{{selectedAddressInfo.telephone}}</span></div>
            </div>
            <van-divider :style="{ padding: '0px' }"/>
            <div><span>配送时间</span><span class="send-time">{{orderInfo.userDeliveryTime}}</span></div>
        </div>
       </div>
      </van-tab>
      <van-tab title="自提" :disabled="!isSelf" name="2">
        <div class="content" v-if="siteAddress">
          <div class="select-box">
            <div class="select-address">
              {{siteAddress.code1}}{{siteAddress.code2}}{{siteAddress.code3}}{{siteAddress.addressDetails}}
              <div class="address-tel"><span class="address-name">{{siteAddress.name}}</span><span>{{siteAddress.telephone}}</span></div>
            </div>
            <van-divider :style="{ padding: '0px' }"/>
            <div><span>自提时间</span><span class="send-time">{{orderInfo.userDeliveryTime}}</span></div>
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
      </div>
      <div class="order-food order-info-box">
        <div class="order-info-line-box" v-if="orderInfo.orderId">
          <span class="txt">订单编号：</span>
          <span>{{orderInfo.orderId}}</span>
        </div>
        <div class="order-info-line-box" v-if="orderInfo.transactionId">
          <span class="txt">商户交易号：</span>
          <span>{{orderInfo.transactionId}}</span>
        </div>
        <div class="order-info-line-box" v-if="orderInfo.createTime">
          <span class="txt">创建时间：</span>
          <span>{{orderInfo.createTime}}</span>
        </div>
        <div class="order-info-line-box" v-if="orderInfo.payTime">
          <span class="txt">付款时间：</span>
          <span>{{orderInfo.payTime}}</span>
        </div>
      </div>
    </scroll-view>
    <div class="bottom-card">
		<div class="left-bottom">
        <span v-show="orderInfo.couponDenomination">已优惠 <span class="red">¥{{orderInfo.couponDenomination}}</span></span>
			  <span class="total-name">合计</span>
			  <span class="shop-price"><span class="z-font-size-12 red">¥</span><span class="z-font-size-18 red">{{orderInfo.orderFee}}</span></span>
		</div>
	</div>
  </div>
</template>
<script>
  import { apiQueryOrderInfoVOByOrderId } from '@/request/api.js'
  export default {
    data () {
      return {
        orderId: '',
        time: '选择时间',
        selectedIndex: -1,
        orderInfo: {},
        siteAddress: {},
        activeIndex: 0,
        activeName: 1,
        isDelivery: false, // 是否是配送
        isSelf: false, // 是否自提
        orderStatus: {
          '1': '待支付',
          '2': '待发货',
          '3': '待收货',
          '4': '待评价'
        },
        orderStatusTips: {
          '1': '请尽快完成付款，超时订单将自动关闭哦',
          '2': '商家正在努力备货中，请耐心等待',
          '3': '确认商品无误即可确认收货哦',
          '4': '写评价最高可获得3倍积分哦~'
        },
        selectedAddressInfo: {},
        shopList: []
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo || wx.getStorageSync('userInfo')
      },
      defaluts () {
        return this.orderInfo.deliveryType
      }
    },
    watch: {
      defaluts () {
        if (this.defaluts === '1' || this.defaluts === 1) {
          this.isSelf = false
          this.isDelivery = true
        }
        if (this.defaluts === '2' || this.defaluts === 2) {
          this.isSelf = true
          this.isDelivery = false
        }
      }
    },
    methods: {
      async queryOrderInfoVOByOrderId () {
        let ret = await apiQueryOrderInfoVOByOrderId({
          orderId: this.orderId
        })
        if (ret.data.resultCode === '000001') {
          this.orderInfo = ret.data.resultObject
          this.shopList = this.orderInfo.prodItemList
          this.selectedAddressInfo = this.orderInfo.address
          this.siteAddress = this.orderInfo.site
          for (let i = 0; i < this.shopList.length; i++) {
            this.shopList[i].total = (this.shopList[i].num * this.shopList[i].price * 100) / 100
          }
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'none'
          })
        }
      }
    },
    onShow () {
      wx.setNavigationBarTitle({title: '订单信息'})
    },
    onLoad (options) {
      if (options.id) {
        this.orderId = options.id
      }
      this.queryOrderInfoVOByOrderId()
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
      .status-txt{
        font-size:22px;
        font-weight:bold;
        color:rgba(41,195,135,1);
      }
      .status-tips-txt{
        font-size:13px;
        color:rgba(181,181,181,1);
        margin-top: 5px;
        font-weight: 500;
      }
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
  .order-info-box{
    margin: 0 10px 60px 10px;
    padding-bottom: 8px;
    .order-info-line-box{
      font-size: 11px;
      color: #b5b5b5;
      padding: 10px 15px 0px 15px;
      .txt{
        width: 120px;
      }
    }
  } 
}
.order-food{
  border-radius:6px;
  padding-bottom: 15px;
  background: white;
  margin: 0 10px 10px 10px;
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
    text-align: right;
	.red{
		color: #E43A4B;
    }
	.shop-price{
		margin-left: 10px;
	}
	.left-bottom{
        display: inline-block;
        margin-right: 20px;
        font-size:10px;
		.total-name{
            font-weight:bold;
            color:rgba(136,136,136,1);
            margin-left: 15px;
            line-height: 44px;
		}
	}
}  
</style>
