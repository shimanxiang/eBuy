<template>
  <div class="card-container ub-box ub-col">
    <scroll-view scroll-x="true" class="card-srcoll">
      <div :class="item.status == 1 ? 'card-box green' : item.status == 2 ? 'card-box red' : 'card-box grey'" v-for="(item, index) in couponList" :key="item.id">
        <div class="card-status"></div>
        <div class="card-top">
          <div class="money">¥{{item.denomination}}</div>
          <div class="desc">
            <div class="desc-head"><span class="desc-name">{{item.name}}</span>
            <span class="desc-status" v-if="item.status == 1">待使用</span>
            <span class="desc-status" v-else-if="item.status == 2">即将过期</span>
            <span class="desc-status" v-else-if="item.status == 5">不满足条件</span>
            <span class="desc-status" v-else>已失效</span>
            </div>
            <div class="desc-rule">{{item.ruleDesc}}</div>
            <div class="desc-time">{{item.effTime}} ~ {{item.expTime}}</div>
          </div> 
        </div>
        <div class="radio-custom" v-if="(item.status == 1 || item.status == 2) && showOpreate"><van-checkbox v-model="item.checked" @click="changeStatus(index)"></van-checkbox></div> 
        <!-- <div class="card-bottom">
          <span>使用规则</span>
          <van-icon name="arrow-down" class="bottom-icon" @click="showDetail(0)" v-if="!item.isExpand"/>
          <van-icon name="arrow-up" class="bottom-icon" @click="hideDetail(0)" v-else/>
          <div class="card-limit" v-show="item.isExpand">
            <div>仅限海鲜水产专区使用;</div>
            <div>不可与其他优惠券</div>
          </div>
        </div> -->
      </div>
    </scroll-view>
    <button class="btn-green" v-if="showOpreate" @click="clickConfrim">确认</button>
  </div>
</template>
<script>
import { apiQueryCoupon, apiUpdateNewCoupon } from '@/request/api.js'

export default {
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  data () {
    return {
      checked: true,
      showOpreate: false,
      defaultCouponId: '',
      defaultFee: 0,
      couponList: []
    }
  },
  methods: {
    showDetail (index) {
      this.couponList[index].isExpand = true
    },
    hideDetail (index) {
      this.couponList[index].isExpand = false
    },
    changeStatus (index) {
      let initCheck = this.couponList[index].checked
      for (let i = 0; i < this.couponList.length; i++) {
        this.couponList[i].checked = false
      }
      this.couponList[index].checked = !initCheck
      if (this.couponList[index].checked) {
        wx.removeStorageSync('couponInfo')
        wx.setStorageSync('couponInfo', {
          denomination: this.couponList[index].denomination,
          id: this.couponList[index].id,
          couponName: this.couponList[index].name
        })
      }
    },
    clickConfrim () {
      wx.navigateBack()
    },
    findCouponId (id) {
      let arr = wx.getStorageSync('proIds')
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === id) {
          return true
        }
      }
      return false
    },
    async getCoupon () {
      let ret = await apiQueryCoupon()
      let canUsed = []
      let noUsed = []
      this.couponList = []
      if (ret.data.resultCode === '000001') {
        for (let i = 0; i < ret.data.resultObject.length; i++) {
          const element = ret.data.resultObject[i]
          element.isExpand = false
          if (element.id === this.defaultCouponId) {
            element.checked = true
          } else {
            element.checked = false
          }
          if (this.showOpreate) {
            if (element.type === '1') {
              // 价格限制
              if (this.defaultFee < element.limitPrice) {
                // 不满足条件
                element.status = 5
                noUsed.push(element)
                continue
              }
            } else if (element.type === '2') {
              // 产品限制
              if (!this.findCouponId(element.limitProductId)) {
                // 不符合规则
                element.status = 5
                noUsed.push(element)
                continue
              }
            }
          }
          canUsed.push(element)
        }
        this.couponList = canUsed.concat(noUsed)
      }
    },
    async updateNewCoupon () {
      let ret = await apiUpdateNewCoupon()
      if (ret.data.resultCode !== '000001') {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    }
  },
  onShow () {
    wx.setNavigationBarTitle({title: '我的卡劵'})
  },
  onLoad (options) {
    if (options.canUse) {
      this.showOpreate = true
      this.defaultCouponId = options.couponId
      this.defaultFee = options.fee
    } else {
      this.showOpreate = false
    }
    this.updateNewCoupon()
    this.getCoupon()
  }
}
</script>
<style scoped lang="less">
.card-container{
  width:100%;
  background:rgba(247,247,247,1);
  object-fit: cover;
  box-sizing: border-box;
  padding: 10px;
  min-height: 100%;
  .card-srcoll{
    margin-bottom: 45px;
  }
  .card-box{
    background:rgba(255,255,255,1);
    border-radius:6px;
    box-sizing: border-box;
    margin-bottom: 10px;
    position: relative;
    &.grey{
      .card-status{
        background-color: #D0D0D0;
      }
      .card-top{
        color: #D0D0D0;
        .desc{
          color: #D0D0D0;
          .desc-time{
            color: #D0D0D0;
          }
        }
      }
      .card-bottom{
        color: #D0D0D0;
        .card-limit{
          color: #D0D0D0;
        }
      }
    }
    .card-status{
      height: 7px;
      width: 100%;
      border-top-right-radius: 7px;
      border-top-left-radius: 7px;
    }
    .radio-custom{
      position: absolute;
      right: 20px;
      top: 60px;
    }
    .card-top{
      padding: 15px 15px 10px 15px;
      .money{
        display: inline-block;
        font-size:30px;
        font-weight:bold;
        position: relative;
        top: -16px;
        width: 80px;
      }
      .desc{
        display: inline-block;
        color: #222222;
        font-size: 11px;
        margin-left: 26px;
        .desc-rule{
          margin-top: 6px;
          margin-bottom: 6px;
        }
        .desc-head{
          .desc-status{
            position: absolute;
            right: 20px;
            font-weight: bold;
          }
          .desc-name{
            font-size: 13px;
            font-weight: bold;
          }
        }
        .desc-time{
          color: #888888;
        }
      }
    }
    .card-bottom{
      font-size: 11px;
      border-top: 1px dashed #ebedf0;
      padding: 9px 15px;
      position: relative;
      .bottom-icon{
        position: absolute;
        right: 15px;
        top: 10px;
      }
      .card-limit{
        margin-top: 5px;
        color: #888888;
      }
    }
  }
  .btn-green{
    font-size:15px;
    border-radius:6px;
    color: white;
    position: fixed;
    bottom: 20px;
    width: 95%;
  }
  button::after{
    border: 0;
  }
}
</style>
