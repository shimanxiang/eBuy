<template>
  <div class="my-container ub-box ub-col">
    <image src="/static/images/BG.png" mode="aspectFill" class="bgImg"/>
    <dl class="ub-box z-padding-all-10-px account-info">
      <dd class="ub-box ub-ver">
         <image :src="userInfo.avatarUrl" class="head-img" mode="aspectFill"></image>
      </dd>
      <dd class="ub-flex-1 z-font-size-18 ub-box ub-ver-v z-padding-h-10-px">
        <ul v-if="isLogin===true" class="ub-box z-margin-left-10-px ub-col account-name">
          <li class="z-font-size-16 z-margin-bottom-5-px">{{userInfo.nickName}}</li>
          <li class="z-font-size-14 ">{{userInfo.province}} {{userInfo.city}} {{userInfo.gender}}</li>
        </ul>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-if="isLogin===true">
        <div @click.stop="clickSignIn()" class="exitBtn ub-box ub-ver">签到</div>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-else>
        <!-- <div v-if="isLogin===false" class="exitBtn ub-box ub-ver" open-type="getUserInfo" @getuserinfo="onGetUserInfo">登录</div> -->
        <button v-if="isLogin===false" class="loginBtn ub-box ub-ver" lang="zh_CN" open-type="getUserInfo" @getuserinfo="onGetUserInfo">登录</button>
      </dd>
    </dl>
    <div class="discount-box">
      <ul class="list">
        <li class="li-box" @click.stop="$openWin('/pages/card/main')" >
          <span>12</span>
          <p>优惠券</p>
        </li>
        <li class="li-box">
          <span>{{signInNum}}</span>
          <p>积分</p>
        </li>
      </ul>
    </div>
    <div class="ul-box">
      <ul class="list">
        <li class="li-box" @click.stop="$openWin('/pages/allOrder/main?status=1')">
          <i class="icon-pay"></i>
          <p>待付款</p>
        </li>
        <li class="li-box" @click.stop="$openWin('/pages/allOrder/main?status=2')">
          <i class="icon-recevie"></i>
          <p>待发货</p>
        </li>
        <li class="li-box" @click.stop="$openWin('/pages/allOrder/main?status=3')">
          <i class="icon-confirmed"></i>
          <p>待收货</p>
        </li>
        <li class="li-box" @click.stop="$openWin('/pages/allOrder/main?status=4')">
          <i class="icon-evaluate"></i>
          <p>待评价</p>
        </li>
      </ul>
    </div>
    
    <dl class="ub-box ub-col my-setting">
      <dd @click.stop="$openWin('/pages/receiveAddress/main')" class="ub-box ub-between z-margin-bottom-20-px">
        <p class="ub-box ub-ver">
        <i class="icon-address"></i>
        <span class="z-font-size-12 my-setting-text">收货地址</span>
        </p>
        <p class="ub-box ub-ver">
        </p>
      </dd>
      <dd class="ub-box ub-between z-margin-bottom-20-px">
        <p class="ub-box ub-ver">
        <i class="icon-star"></i>
        <span class="z-font-size-12 my-setting-text">我的收藏</span>
        </p>
        <p class="ub-box ub-ver">
        </p>
      </dd>
      <dd @click.stop="gotoOrderList()" class="ub-box ub-between">
        <p class="ub-box ub-ver">
        <i class="icon-tel"></i>
        <span class="z-font-size-12 my-setting-text">联系客服</span>
        </p>
        <p class="ub-box ub-ver">
        </p>
      </dd>
    </dl>
  </div>
</template>
<script>

import { apiLogin, apiCheckSignIn, apiSignIn } from '@/request/api.js'

export default {
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    userInfo () {
      return this.$store.state.userInfo || wx.getStorageSync('userInfo')
    }
  },
  data () {
    return {
      loading: false,
      signInNum: 0,
      canSignIn: false
    }
  },
  methods: {
    onGetUserInfo (e) {
      this.login(e.mp.detail.userInfo)
    },
    async login (data) {
      let ret = await apiLogin()
      if (ret.data.resultCode === '000001') {
        if (ret.header['Set-Cookie']) {
          wx.removeStorageSync('sessionid')
          wx.setStorageSync('sessionid', ret.header['Set-Cookie'])
        }
        wx.removeStorageSync('userInfo')
        wx.setStorageSync('userInfo', data)
        this.$store.commit('updateIsLogin', true)
        this.$store.commit('updateUser', data)
        this.checkSignIn()
      }
    },
    async checkSignIn (data) {
      let ret = await apiCheckSignIn()
      this.canSignIn = false
      if (ret.data.resultCode === '000001') {
        if (ret.data.resultObject === '1') {
          this.canSignIn = true
        }
      }
    },
    exitLogin () {
      this.$store.commit('updateIsLogin', false)
      this.$store.commit('cleanUserInfo')
    },
    clickSignIn () {
      if (this.signIn) {
        this.signIn()
      } else {
        wx.showToast({
          title: '无法签到',
          icon: 'none'
        })
      }
    },
    async signIn () {
      this.loading = true
      let ret = await apiSignIn()
      if (ret.statusCode === 200) {
        this.loading = false
        this.signInNum = +ret.data.resultObject
        wx.showToast({
          title: '签到成功',
          icon: 'success'
        })
      } else {
        this.loading = false
        wx.showToast({
          title: '签到失败',
          icon: 'none'
        })
      }
    },
    gotoOrderList () {
      wx.switchTab({url: '/pages/shopcart/main'})
    },
    clickCall () {
      wx.showActionSheet({
        itemList: ['客服电话：10107888'],
        success (res) {
          switch (res.tapIndex) {
            case 0:
              wx.makePhoneCall({phoneNumber: '10107888'})
              break
          }
        }
      })
    }
  },
  onShow () {
    console.log(this.userInfo)
    wx.setNavigationBarTitle({title: '我的'})
  }
}
</script>
<style scoped lang="less">
.my-container{
  width:100%;
  height:100vh;
  background:rgba(247,247,247,1);
  object-fit: cover;
  .account-info{
    padding-top: 25px;
    padding-left: 25px;
    .account-name{
      color: white;
      z-index: 2;
    }
  }
  .bgImg{
    width: 100%;
    position: absolute;
    top: -90px;
  }
  .my-setting{
    border-radius: 6px;
    background: white;
    margin: 10px;
    color: #222222;
    padding: 15px;
    font-weight: bold;
    .icon-address{
      background-image: url('../../../static/images/address.png');
      width: 73px;
      height: 67px;
      transform: scale(0.3);
      position: absolute;
      left: 0;
    }
    .icon-tel{
      background-image: url('../../../static/images/tel.png');
      width: 73px;
      height: 68px;
      transform: scale(0.3);
      position: absolute;
      left: 0;
    }
    .icon-star{
      background-image: url('../../../static/images/star.png');
      width: 73px;
      height: 68px;
      transform: scale(0.3);
      position: absolute;
      left: 0;
    }
    .my-setting-text{
      padding-left: 30px;
    }
  }
  .discount-box{
    background: white;
    padding-bottom: 15px;
    margin-top: 39px;
    padding-top: 5px;
    .list{
      display: flex;
      flex-wrap: wrap;
    }
    .li-box {
      width: 50%;
      text-align: center;
      position: relative;
      font-size: 18px;
      color: #222222;
      p {
        font-size: 11px;
        color: #B5B5B5;
      }
    }
  }
  .ul-box{
    background: white;
    padding: 15px;
    margin: 10px 10px 0 10px;
    border-radius:6px;
    .list {
      display: flex;
      flex-wrap: wrap;
      .li-box {
        width: 25%;
        text-align: center;
        position: relative;
        margin-top: 25px;
        .icon-pay{
          background-image: url('../../../static/images/pay.png');
          width: 80px;
          height: 96px;
          transform: scale(0.3);
          position: absolute;
          left: 0;
          top: -60px;
        }
        .icon-recevie{
          background-image: url('../../../static/images/recevie.png');
          width: 85px;
          height: 96px;
          transform: scale(0.3);
          position: absolute;
          left: -3px;
          top: -60px;
        }
        .icon-confirmed{
          background-image: url('../../../static/images/confirmed.png');
          width: 85px;
          height: 96px;
          transform: scale(0.3);
          position: absolute;
          left: -3px;
          top: -60px;
        }
        .icon-evaluate{
          background-image: url('../../../static/images/evaluate.png');
          width: 80px;
          height: 96px;
          transform: scale(0.3);
          position: absolute;
          left: 0;
          top: -59px;
        }
        p {
          font-size: 10px;
        }
      }
    }
  }
  
}
.head-img{width:54px;height:54px;border-radius:50%;background:#eee; z-index: 2;}
.loginBtn{
  padding:0px 15px;
  border-radius: 20px;
  z-index: 2;
  background-color: white;
  font-size: 12px;
  line-height: 32px;
  height: 30px;
  width: 60px;
}
.exitBtn{
  padding:7px 15px;
  border-radius: 20px;
  z-index: 2;
  background-color: white;
  font-size: 12px;
}
</style>
