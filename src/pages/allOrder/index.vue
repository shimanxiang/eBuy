<template>
  <div class="allOrder-container">
    <div>
      <van-tabs @change="tabsChange" :value="activeStatus" :active="defaluts" :border="false" title-active-color="#222222" title-inactive-color="#B5B5B5" line-width="22" :scrollspy="false">
        <van-tab title="所有" name="0"></van-tab>
        <van-tab title="待付款" name="1"></van-tab>
        <van-tab title="待发货" name="2"></van-tab>
        <van-tab title="待收货" name="3"></van-tab>
        <van-tab title="待评价" name="4"></van-tab>
      </van-tabs>
    </div>
    <div class="ub-box">
      <scroll-view scroll-y :scroll-top="scrollTop" class="z-margin-all-10-px scroll-list" @scrolltolower="scroll">
      <dl class="z-width-100-percent ub-box ub-col">
       <dd v-for="list in orderList" :key="list.orderInfoId" @click.stop="goDetail(list.orderInfoId)" class="order z-width-100-percent ub-box z-box-sizing-border">
         <img class="z-img-cover" :src="list.image" />
         <div class="ub-flex-1 z-padding-left-10-px ub-box ub-col">
           <span class="z-font-size-13 z-color-333 z-margin-bottom-5-px z-margin-top-8-px z-font-weight-bold">{{list.name}}&nbsp;&nbsp;&nbsp;<span v-show="list.num > 1">等{{list.num}}件</span></span>
           <span class="z-font-size-11 z-color-888 z-margin-bottom-10-px">{{list.createTime}}</span>
           <span class="z-font-size-11 z-margin-bottom-10-px order-status z-font-weight-bold">{{orderStatusTxt[list.status]}}</span>
         </div>
         <div class="order-price-box">
           <div class="order-price">¥{{list.payfee}}</div>
           <div class="z-font-size-11 z-margin-top-3-px" v-show="list.couponFee > 0"><span>已优惠&nbsp;<span class="red">¥{{list.couponFee}}</span></span></div>
           </div>
         <div>
           <div class="z-font-size-11 order-operate" v-if="orderStatusOpreate[list.status]" @click.stop="clickOrderOperate(list.status, list.orderInfoId)">{{orderStatusOpreate[list.status]}}</div>
         </div>
       </dd>
       <dd class="loading" v-show="showLoading && !fininshed">
         <van-loading size="24px" type="spinner">加载中...</van-loading>
       </dd>
       <dd class="divider" v-show="fininshed && orderList.length > 6">
         没有更多了
       </dd>
       <dd v-show="orderList.length == 0" class="no-order">
         您还没有相关的订单
       </dd>
     </dl>
    </scroll-view>
    </div>
  </div>
</template>
<script>
  import { apiListSimpleOrderInfo, apiDoUnifiedOrder, apiConfirmReceipt } from '@/request/api.js'
  export default {
    data () {
      return {
        defaluts: 'b',
        activeStatus: 0,
        orderStatusTxt: {
          1: '待付款',
          2: '等待发货',
          3: '配送中',
          4: '已收货',
          5: '交易完成'
        },
        orderStatusOpreate: {
          1: '立即付款',
          3: '确认收货',
          4: '立即评价'
        },
        orderList: [],
        loading: false,
        pageIndex: 1,
        pageSize: 10,
        scrollTop: 0,
        showLoading: false,
        fininshed: false
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo || wx.getStorageSync('userInfo')
      }
    },
    methods: {
      tabsChange (e) {
        this.activeStatus = e.target.index
        this.pageIndex = 1
        this.fininshed = false
        this.loading = false
        this.scrollTop = 0
        if (this.activeStatus === 0) {
          this.getListSimpleOrderInfo(-1)
        } else {
          this.getListSimpleOrderInfo(this.activeStatus)
        }
      },
      clickOrderOperate (status, orderInfoId) {
        if (+status === 1) {
          // 待付款
          this.doUnifiedOrder(orderInfoId)
        } else if (+status === 3) {
          let _this = this
          wx.showModal({
            title: '提示',
            content: '确定收货？',
            success (res) {
              if (res.confirm) {
                _this.confirmReceipt(orderInfoId)
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      async confirmReceipt (id) {
        let ret = await apiConfirmReceipt({
          orderId: id
        })
        if (ret.data.resultCode === '000001') {
          for (let i = 0; i < this.orderList.length; i++) {
            if (this.orderList[i].orderInfoId === id) {
              this.orderList.splice(i, 1)
              break
            }
          }
        } else {
          wx.showToast({
            title: '确认失败',
            icon: 'none'
          })
        }
      },
      goDetail (id) {
        wx.navigateTo({
          url: '/pages/orderDetail/main?id=' + id
        })
      },
      scroll () {
        if (this.loading) return false
        if (this.fininshed) return false
        this.pageIndex += 1
        this.showLoading = true
        if (this.activeStatus === 0) {
          this.getListSimpleOrderInfo(-1)
        } else {
          this.getListSimpleOrderInfo(this.activeStatus)
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
      async getListSimpleOrderInfo (status) {
        if (this.loading) return false
        this.loading = true
        let ret = await apiListSimpleOrderInfo({
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          status: status
        })
        if (ret.data.resultCode === '000001') {
          if (this.pageIndex > 1) {
            this.orderList = this.orderList.concat(ret.data.resultObject)
          } else {
            this.orderList = ret.data.resultObject.slice()
          }
          if (ret.data.resultObject.length < this.pageSize) {
            this.fininshed = true
          }
          this.loading = false
          this.showLoading = false
        } else {
          wx.showToast({
            title: '订单查询失败',
            icon: 'none'
          })
          this.loading = false
          this.showLoading = false
        }
      }
    },
    onShow () {
      this.fininshed = false
      this.loading = false
      this.pageIndex = 1
      this.showLoading = false
      this.orderList = []
      if (this.activeStatus === 0) {
        this.getListSimpleOrderInfo(-1)
      } else {
        this.getListSimpleOrderInfo(this.activeStatus)
      }
      wx.setNavigationBarTitle({title: '订单'})
    },
    onLoad (options) {
      if (options.status) {
        this.defaluts = options.status.toString()
        this.activeStatus = +options.status
        this.getListSimpleOrderInfo(this.activeStatus)
      }
    }
  }
</script>
<style lang="less">
.allOrder-container{
    width:100%;
    background:rgba(248,248,248,1);
    height: 100%;
    overflow: hidden;
    .scroll-list{
      height: 100vh;
      dl{
        margin-bottom: 50px;
      }
      .divider{
        position:relative;
        text-align:center;
        width:100%;
        margin:10px 0 20px 0;
        font-size: 13px;
        color:#b5b5b5;
        &::before,&::after{
          content:"";
          position:absolute;
          top:50%;
          border:solid 1rpx #DCDCDC;
          width:40%;
        }
        &::before{
          left:0;
        }
        &::after{
          right:0;
        }
      }
      .loading{
        text-align: center;
      }
    }
    .van-tab--active{
        font-size: 13px;
    }
    .order-price-box{
      font-size: calc(10px);
      position: absolute;
      right: 25px;
      top: 10px;
      color: #222222;
      .red{
        color: #E43A4B;
      }
      .order-price{
        font-size: 14px;
        font-weight: bold;
        text-align: right;
      }
    }
    .order{position: relative; margin-bottom: 10px; padding-left: 15px; padding-right:15px; padding-top: 7px;padding-bottom: 6px; border-radius: 6px;background:#fff}
    .order img{width: 55px; height: 55px; margin-top: 11px;}
    .order-operate{
      width:64px;
      height:26px;
      background:rgba(233,249,243,1);
      border-radius:14px;
      color: #29C387;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 44px;
    }
    .van-tabs__wrap--scrollable .van-tab{
      -webkit-flex: 1;
      flex: 1;
    }
    .no-order{
      color: #888888;
      text-align: center;
      font-size: 13px;
      margin-top: 20px;
    }
}
</style>
