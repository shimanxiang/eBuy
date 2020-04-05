<script>
import { apiLogin, apigetOpenId } from '@/request/api.js'
export default {
  data () {
    return {
      openId: ''
    }
  },
  methods: {
    async getOpenId (code) {
      let ret = await apigetOpenId({
        code: code
      })
      if (ret.data.resultCode === '000001') {
        this.openId = ret.data.resultObject
        this.login()
      }
    },
    async login () {
      let ret = await apiLogin({
        openId: this.openId
      })
      if (ret.data.resultCode === '000001') {
        if (ret.header['Set-Cookie']) {
          wx.removeStorageSync('sessionid')
          wx.setStorageSync('sessionid', ret.header['Set-Cookie'])
        }
        wx.removeStorageSync('userInfo')
        wx.setStorageSync('userInfo', ret.data.resultObject)
        this.$store.commit('updateIsLogin', true)
        this.$store.commit('updateUser', ret.data.resultObject)
      } else {
        wx.showToast({
          title: '创建用户失败',
          icon: 'none'
        })
      }
    }
  },
  created () {
    let _this = this
    wx.login({
      success (res) {
        if (res.code) {
          // 发起网络请求
          _this.getOpenId(res.code)
        } else {
          wx.showToast({
            title: '登录失败！',
            icon: 'none'
          })
        }
      }
    })
  }
}
</script>
<style lang="less">
@import "css/theme.less";
.theme(#29C387,rgba(41,195,135,0.1),#13BE7B, #E43A4B);

/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
.order-confirm{
  .van-tabs__wrap{
    font-weight: bold;
  }
  .van-tab--active{
    font-weight: bold;
  }
}
.van-picker__columns{
  font-size: 13px;
}
.van-picker__toolbar{
  font-size: 13px;
  &.van-hairline--top-bottom:after{
    border-width: 0;
  }
  .van-picker__cancel{
    color: #707070;
  }
}
._van-overlay .van-sidebar-item{
  border-left: 0;
  background-color: white;
}
._van-overlay .van-hairline--top-bottom:after{
  border-width: 0;
}
._van-overlay .van-sidebar-item--selected{
  font-weight:bold;
  font-size: 13px;
}
._van-overlay .van-tree-select__nav{
 background-color: white;
}
.van-tag{
  padding: .2em .6em !important;
}
</style>
