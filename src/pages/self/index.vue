<template>
  <div class="my-container ub-box ub-col">
    <image src="/static/images/BG.png" mode="aspectFill" class="bgImg"/>
    <dl class="ub-box z-padding-all-10-px account-info">
      <!-- <dd class="ub-box ub-ver">
         
      </dd> -->
      <dd class="ub-flex-1 z-font-size-18 ub-box ub-ver-v z-padding-h-10-px">
        <image :src="userInfo.headImg" class="head-img" mode="aspectFill"></image>
        <ul v-if="isLogin===true" class="ub-box z-margin-left-10-px ub-col account-name">
          <li class="z-font-size-16 z-margin-bottom-5-px">{{userInfo.nickName || '无'}}</li>
        </ul>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-if="isAuthorize===true">
        <div @click.stop="clickSignIn()" class="exitBtn ub-box ub-ver">{{canSignIn ? '签到' : '已签到'}}</div>
      </dd>
      <dd class="z-font-size-18 z-color-333 ub-box ub-ver-v" v-else>
        <button v-if="isAuthorize===false" class="loginBtn ub-box ub-ver" lang="zh_CN" open-type="getUserInfo" @getuserinfo="onGetUserInfo">授权</button>
      </dd>
    </dl>
    <div class="discount-box">
      <ul class="list">
        <li class="li-box" @click.stop="clickCoupon" >
          <span class="couponTotalNum">{{couponTotalNum}}<i class="tip" v-if="couponNewNum > 0"></i></span>
          <p>优惠券</p>
        </li>
        <li class="li-box">
          <span>{{integral}}</span>
          <p>积分</p>
        </li>
      </ul>
    </div>
    <div class="ul-box">
      <ul class="list">
        <li class="li-box" @click.stop="clickOrder(1)">
          <van-tag round type="danger" v-if="waitPay > 0">{{waitPay}}</van-tag>
          <i class="icon-pay"></i>
          <p>待付款</p>
        </li>
        <li class="li-box" @click.stop="clickOrder(2)">
          <van-tag round type="danger" v-if="waitDeliver > 0">{{waitDeliver}}</van-tag>
          <i class="icon-recevie"></i>
          <p>待发货</p>
        </li>
        <li class="li-box" @click.stop="clickOrder(3)">
          <van-tag round type="danger" v-if="waitHarvest > 0">{{waitHarvest}}</van-tag>
          <i class="icon-confirmed"></i>
          <p>待收货</p>
        </li>
        <li class="li-box" @click.stop="clickOrder(4)">
          <van-tag round type="danger" v-if="waitComment > 0">{{waitComment}}</van-tag>
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
      <!-- <dd class="ub-box ub-between z-margin-bottom-20-px">
        <p class="ub-box ub-ver">
        <i class="icon-star"></i>
        <span class="z-font-size-12 my-setting-text">我的收藏</span>
        </p>
        <p class="ub-box ub-ver">
        </p>
      </dd> -->
      <dd @click.stop="exitLogin()" class="ub-box ub-between">
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

import { apiLogin, apiCheckSignIn, apiSignIn, apigetOpenId, apiQueryNum, apiUpdateUser } from '@/request/api.js'

export default {
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    userInfo () {
      return this.$store.state.userInfo || wx.getStorageSync('userInfo')
    },
    openId () {
      return this.$store.state.userInfo.openId
    }
  },
  data () {
    return {
      couponNewNum: 0,
      couponTotalNum: 0,
      loading: false,
      isAuthorize: false,
      integral: 0,
      waitComment: 0,
      waitHarvest: 0,
      waitDeliver: 0,
      waitPay: 0,
      canSignIn: false,
      isSigned: false,
      openId: ''
    }
  },
  methods: {
    clickOrder (status) {
      if (!this.isLogin) {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      } else {
        this.$openWin('/pages/allOrder/main?status=' + status)
      }
    },
    onGetUserInfo (e) {
      if (!this.userInfo.openId) {
        let _this = this
        wx.login({
          success (res) {
            if (res.code) {
              // 发起网络请求
              _this.getOpenId(res.code, e.mp.detail.userInfo)
            } else {
              wx.showToast({
                title: '登录失败！',
                icon: 'none'
              })
            }
          }
        })
      } else {
        let data = e.mp.detail.userInfo
        this.isAuthorize = true
        this.updateUser(data.avatarUrl, data.nickName)
        this.getNum()
      }
      this.checkSignIn()
    },
    async updateUser (headImg, nickName) {
      let ret = await apiUpdateUser({
        headImg: headImg,
        nickName: nickName,
        openId: this.openId
      })
      if (ret.data.resultCode === '000001') {
        let userInfo = wx.getStorageSync('userInfo')
        userInfo.headImg = headImg
        userInfo.nickName = nickName
        wx.removeStorageSync('userInfo')
        wx.setStorageSync('userInfo', userInfo)
        this.$store.commit('updateIsLogin', true)
        this.$store.commit('updateUser', userInfo)
      }
    },
    clickCoupon () {
      if (this.isLogin) {
        this.$openWin('/pages/card/main')
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
      }
    },
    async getNum () {
      let ret = await apiQueryNum()
      if (ret.data.resultCode === '000001') {
        this.couponNewNum = ret.data.resultObject.couponNewNum
        this.couponTotalNum = ret.data.resultObject.couponTotalNum
        this.integral = ret.data.resultObject.integral
        this.waitComment = ret.data.resultObject.orderStatusWaitComment || 0
        this.waitDeliver = ret.data.resultObject.orderStatusWaitDeliver || 0
        this.waitHarvest = ret.data.resultObject.orderStatusWaitHarvest || 0
        this.waitPay = ret.data.resultObject.orderStatusWaitPay || 0
      } else {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    },
    resetNum () {
      this.couponTotalNum = 0
      this.integral = 0
      this.waitComment = 0
      this.waitDeliver = 0
      this.waitPay = 0
      this.waitHarvest = 0
    },
    async login (data) {
      let ret = await apiLogin({
        headImg: data.avatarUrl,
        nickName: data.nickName,
        openId: this.openId
      })
      if (ret.data.resultCode === '000001') {
        if (ret.header['Set-Cookie']) {
          wx.removeStorageSync('sessionid')
          wx.setStorageSync('sessionid', ret.header['Set-Cookie'])
        }
        let ans = Object.assign(data, ret.data.resultObject)
        wx.removeStorageSync('userInfo')
        wx.setStorageSync('userInfo', ans)
        this.$store.commit('updateIsLogin', true)
        this.$store.commit('updateUser', ans)
        this.isAuthorize = true
        this.getNum()
      } else {
        wx.showToast({
          title: '创建用户失败',
          icon: 'none'
        })
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
    async getOpenId (code, userInfo) {
      let ret = await apigetOpenId({
        code: code
      })
      if (ret.data.resultCode === '000001') {
        this.openId = ret.data.resultObject
        this.login(userInfo)
      }
    },
    exitLogin () {
      this.$store.commit('updateIsLogin', false)
      this.$store.commit('cleanUserInfo')
      this.resetNum()
    },
    clickSignIn () {
      if (this.canSignIn) {
        this.signIn()
      }
    },
    async signIn () {
      if (this.isSigned) {
        wx.showToast({
          title: '无需重复签到',
          icon: 'none'
        })
      }
      if (this.loading) return false
      this.loading = true
      let ret = await apiSignIn()
      if (ret.statusCode === 200) {
        this.loading = false
        this.integral = +ret.data.resultObject
        this.isSigned = true
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
  mounted () {
    if (wx.getStorageSync('userInfo').nickName) {
      this.isAuthorize = true
    } else {
      this.isAuthorize = false
    }
  },
  onShow () {
    if (this.isLogin) {
      this.getNum()
    } else {
      this.resetNum()
    }
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
    top: 0px;
    height: 160px;
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
    margin-top: 70px;
    padding-top: 5px;
    .couponTotalNum{
      position: relative;
      .tip {
        display:block;
        background:#f00;
        border-radius:50%;
        width:8px;
        height:8px;
        top: 2px;
        right: -6px;
        position:absolute;
      }
    }
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
      ._van-tag{
        position: absolute;
        top: -32px;
        z-index: 999;
      }
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
