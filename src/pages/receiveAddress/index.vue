<template>
  <div class="receive-address">
    <scroll-view scroll-y scroll-top="0" class="address-scroll">
        <div class="ub-box ub-col address-box">
            <div class="address-list" @click="selectedAddress(index)" v-for="(item, index) in address" :key="item.id">
                <div>
                  <div class="address">{{item.address}}<span class="address-defalut" v-if="item.isDefalut">默认</span></div>
                  <div class="address-tel"><span class="address-name">{{item.name}}</span><span>{{item.tel}}</span></div>
                </div>
                <div>
                  <i class="edit-icon" @click.stop="$openWin('/pages/address/main')"></i>
                </div>
            </div>
        </div>
    </scroll-view>
    <div class="add-address" @click.stop="$openWin('/pages/address/main')">
      新增收货地址
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
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
        }]
      }
    },
    methods: {
      selectAddress () {
        this.isShow = true
      },
      onSelect (item) {
        console.log('xxx')
        // 默认情况下点击选项时不会自动收起
        // 可以通过 close-on-click-action 属性开启自动收起
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
      }
    },
    onShow () {
      wx.setNavigationBarTitle({title: '收货地址'})
    }
  }
</script>
<style lang="less" scoped>
.receive-address{
  height: 100%;
  background:rgba(247,247,247,1);
  padding: 10px;
  box-sizing: border-box;
  .address-scroll{
    height: 100%;
    .address-list{
      margin-bottom: 10px;
      padding: 15px 30px 15px 15px;
      background:rgba(255,255,255,1);
      border-radius:6px;
      position: relative;
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
      .edit-icon{
        width: 33px;
        height: 33px;
        transform: scale(0.5);
        background-image: url('../../../static/images/edit-icon.png');
        position: absolute;
        right: 5px;
        top: 26%;
      }
    }
  }
  .add-address{
    position: relative;
    height:44px;
    border-radius:6px;
    font-size:15px;
    color: white;
    bottom: 45px;
    text-align: center;
    line-height: 44px;
  }
}  
</style>
