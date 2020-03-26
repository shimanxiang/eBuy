<template>
  <div class="order-confirm">
    <van-tabs v-model="activeName" title-inactive-color="#888888" :border="false" line-width="22">
      <van-tab title="配送">
        <div class="content">
        <div class="select-box">
          <div class="select-address" @click="selectAddress" v-if="!selectedAddressInfo.id">选择收货地址 ></div>
          <div class="select-address" @click="selectAddress" v-else>
            {{selectedAddressInfo.address}} >
            <div class="address-tel"><span class="address-name">{{selectedAddressInfo.name}}</span><span>{{selectedAddressInfo.tel}}</span></div>
          </div>
          <van-divider :style="{ padding: '0px' }"/>
          <div @click="showTimeSelected"><span>配送时间</span><span class="send-time">{{time}} ></span></div>
        </div>
      </div>
      </van-tab>
      <van-tab title="自提">
        <div class="content">
          <div class="select-box">
            <div class="select-address" @click="selectAddress">南京市鼓楼区农贸市场</div>
            <van-divider :style="{ padding: '0px' }"/>
            <div><span>自提时间</span><span class="send-time">10:00 - 11:00 ></span></div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <scroll-view scroll-y scroll-top="0">
      <div class="order-food">
        <dl class="z-width-100-percent ub-box ub-col">
          <dd v-for="(val, idx) in 3" :key="idx" class="order z-width-100-percent ub-box z-box-sizing-border">
            <img class="z-img-cover" :src="order.img" />
            <div class="ub-flex-1 z-padding-left-10-px ub-box ub-col">
              <span class="z-font-size-13 z-color-333 z-margin-bottom-10-px z-margin-top-12-px z-font-weight-bold">{{order.name}}</span>
              <span class="z-font-size-11 z-color-888 z-margin-bottom-3-px">总价：{{order.price}}</span>
            </div>
            <span class="z-font-size-15 z-margin-top-12-px z-font-weight-bold">{{order.type}}</span>
          </dd>
        </dl>
        <div class="line-box z-margin-top-10-px"><span>包装费</span><span class="fr">¥1.5</span></div>
        <div class="line-box"><span>配送费</span><span class="fr">¥1.5</span></div>
        <div class="line-box"><span>优惠券</span><span v-if="hasCoupon" class="fr red">-9.9</span><span v-else class="fr flex-middle-center z-color-888" @click="chooseCoupon">2张可用 <van-icon name="arrow" /></span></div>
      </div>
    </scroll-view>
    <div class="bottom-card">
		<div class="left-bottom">
			<span class="total-name">合计</span>
			<span class="shop-price"><span class="z-font-size-12 red">¥</span><span class="z-font-size-18 red">39.9</span></span>
		</div>
		<div class="right-bottom">提交订单</div>
	</div>
  <van-overlay :show="isShow" @click="isShow = false">
    <div class="wrapper" @click.stop>
      <scroll-view scroll-y scroll-top="0" class="address-scroll">
        <div class="ub-box ub-col">
          <div class="address-list" @click="selectedAddress(index)" v-for="(item, index) in address" :key="item.id">
            <div class="address">{{item.address}}<span class="address-defalut" v-if="item.isDefalut">默认</span></div>
            <div class="address-tel"><span class="address-name">{{item.name}}</span><span>{{item.tel}}</span></div>
          </div>
        </div>
      </scroll-view>
      <div class="add-address" @click="gotoaddAddress">+ 新增收货地址</div>
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
            <ul class="list" @click="handTime(index)" v-for="(item, index) in timeData" :key="item.id">
              <li :class="selectedIndex == item.index ? 'active' : ''">{{item.text}}
                <van-checkbox v-model="checked" class="vant-checkbox-custom" v-if="selectedIndex == item.index"></van-checkbox>
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
  export default {
    data () {
      return {
        checked: true,
        time: '选择时间',
        hasCoupon: false,
        selectedIndex: 0,
        timeData: [{
          text: '10:00 - 11:00', id: 2456, index: 0
        }, { text: '11:00 - 12:00', id: 256, index: 1
        }, { text: '11:00 - 12:00', id: 2561, index: 2
        }, { text: '11:00 - 12:00', id: 2562, index: 3
        }, { text: '11:00 - 12:00', id: 2563, index: 4
        }, { text: '11:00 - 12:00', id: 2564, index: 5
        }, { text: '11:00 - 12:00', id: 2565, index: 6
        }, { text: '11:00 - 12:00', id: 2566, index: 7
        }, { text: '11:00 - 12:00', id: 2567, index: 8
        }, { text: '11:00 - 12:00', id: 2568, index: 9
        }, { text: '11:00 - 12:00', id: 2569, index: 10
        }, { text: '11:00 - 12:00', id: 2510, index: 11
        }],
        activeId: 256,
        activeIndex: 0,
        isShow: false,
        isShowTime: false,
        activeName: 1,
        selectedAddressInfo: {},
        address: [{
          address: '南京市鼓楼区清江花园三单元',
          name: '北洛',
          tel: '18380405938',
          id: 356,
          isDefalut: true
        }, {
          address: '南京市鼓楼区清江花园三单元南京市鼓楼区清江花园三单元',
          name: '北洛',
          tel: '18380405938',
          id: 546,
          isDefalut: false
        }, {
          address: '南京市鼓楼区清江花园三单元',
          name: '北洛',
          tel: '18380405938',
          id: 779,
          isDefalut: false
        }, {
          address: '南京市鼓楼区清江花园三单元',
          name: '北洛',
          tel: '18380405938',
          id: 342,
          isDefalut: false
        }],
        order: {
          orderId: '100',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          name: '索菲特大酒店锦厨',
          num: '1',
          price: '500g*1',
          type: '¥11.9'
        },
        actions: [
          { name: '选项' },
          { name: '选项' },
          { name: '选项', subname: '描述信息' }
        ]
      }
    },
    watch: {
      $route (to, from) {
        console.log(to, from)
      }
    },
    methods: {
      selectAddress () {
        this.isShow = true
      },
      onSelect (item) {
        console.log('xxx')
      },
      selectedAddress (index) {
        this.selectedAddressInfo = this.address[index]
        this.isShow = false
      },
      showTimeSelected () {
        this.isShowTime = true
      },
      clickItem () {
        console.log('xxx')
      },
      handTime (index) {
        this.selectedIndex = index
        this.isShowTime = false
        this.time = this.timeData[index].text
      },
      gotoaddAddress () {
        wx.navigateTo({url: '/pages/address/main'})
      },
      chooseCoupon () {
        wx.navigateTo({url: '/pages/card/main?canUse=1'})
      }
    },
    mounted () {
      this.isShow = false
      this.isShowTime = false
    },
    onShow () {
      wx.setNavigationBarTitle({title: '提交订单'})
    },
    onLoad (options) {
      if (options.id) {
        this.selectedAddressInfo = {
          id: options.id,
          address: options.address,
          tel: options.tel,
          name: options.name
        }
      }
      console.log(options)
    }
  }
</script>
<style lang="less" scoped>
.order-confirm{
  height: 100%;
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
