<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('app created and cache logs by setStorageSync')
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
</style>
