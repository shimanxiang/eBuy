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
      <scroll-view scroll-y scroll-top="0" class="z-margin-all-10-px">
      <dl class="z-width-100-percent ub-box ub-col">
       <dd v-for="list in filterList" :key="list.orderId" class="order z-width-100-percent ub-box z-box-sizing-border">
         <img class="z-img-cover" :src="list.img" />
         <div class="ub-flex-1 z-padding-left-10-px ub-box ub-col">
           <span class="z-font-size-13 z-color-333 z-margin-bottom-5-px z-margin-top-8-px z-font-weight-bold">{{list.name}}</span>
           <span class="z-font-size-11 z-color-888 z-margin-bottom-10-px">{{list.price}}*{{list.num}}</span>
           <span class="z-font-size-11 z-margin-bottom-10-px order-status z-font-weight-bold">{{orderStatusTxt[list.status]}}</span>
         </div>
         <div class="z-font-size-11 order-operate" v-if="orderStatusOpreate[list.status]">{{orderStatusOpreate[list.status]}}</div>
       </dd>
       <dd v-show="filterList.length == 0" class="no-order">
         您还没有相关的订单
       </dd>
     </dl>
    </scroll-view>
    </div>
  </div>
</template>
<script>
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
        orderList: [{
          status: 2,
          orderId: '100',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          name: '有机西蓝花',
          num: '1',
          price: '500g'
        }, {
          status: 1,
          orderId: '101',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          name: '有机西蓝花',
          num: '1',
          price: '500g'
        }, {
          status: 0,
          orderId: '102',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          name: '有机西蓝花',
          num: '1',
          price: '500g'
        }, {
          status: 3,
          orderId: '103',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          name: '有机西蓝花',
          num: '1',
          price: '500g'
        }],
        filterList: []
      }
    },
    watch: {
      activeStatus () {
        let res = this.orderList.filter((item) => {
          return item.status === this.activeStatus
        })
        this.filterList = []
        if (this.activeStatus === 0) {
          this.filterList = this.orderList
          return
        }
        this.filterList = res
      }
    },
    methods: {
      tabsChange (e) {
        this.activeStatus = e.target.index
      },
      tabsClick () {
        console.log('click')
      }
    },
    mounted () {
      if (this.activeStatus === 0) this.filterList = this.orderList
    },
    onShow () {
      wx.setNavigationBarTitle({title: '订单'})
    },
    onLoad (options) {
      if (options.status) {
        this.defaluts = options.status.toString()
        this.activeStatus = +options.status
      }
    }
  }
</script>
<style lang="less">
.allOrder-container{
    width:100%;
    background:rgba(248,248,248,1);
    height: 100%;
    .van-tab--active{
        font-size: 13px;
    }
    .order{margin-bottom: 10px; padding-left: 15px; padding-right:15px; padding-top: 7px;padding-bottom: 6px; border-radius: 6px;background:#fff}
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
