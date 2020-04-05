<template>
  <div class="receive-address">
    <scroll-view scroll-y scroll-top="0" class="address-scroll">
        <div class="ub-box ub-col address-box">
            <div class="address-list" v-for="item in addressList" :key="item.id">
                <div>
                  <div class="address">{{item.code1}}{{item.code2}}{{item.code3}}{{item.addressDetails}}<span class="address-defalut" v-if="item.isDefault == true">默认</span></div>
                  <div class="address-tel"><span class="address-name">{{item.name}}</span><span>{{item.telephone}}</span></div>
                </div>
                <div>
                  <i class="edit-icon" @click.stop="editAddress(item)"></i>
                </div>
            </div>
        </div>
    </scroll-view>
    <div class="no-address" v-if="addressList.length == 0">暂时没有任何地址~</div>
    <div class="add-address" @click.stop="$openWin('/pages/address/main?list=1')">
      新增收货地址
    </div>
  </div>
</template>
<script>
import { apigetAddress } from '@/request/api.js'
export default {
  data () {
    return {
      addressList: []
    }
  },
  methods: {
    async getAddress () {
      let ret = await apigetAddress()
      this.addressList = []
      if (ret.data.resultCode === '000001') {
        for (let i = 0; i < ret.data.resultObject.length; i++) {
          const element = ret.data.resultObject[i]
          if (element.isDefault === '1') {
            element.isDefault = true
          } else {
            element.isDefault = false
          }
          this.addressList.push(element)
        }
      } else {
        wx.showToast({
          title: '查询失败',
          icon: 'none'
        })
      }
    },
    editAddress (data) {
      this.$openWin('/pages/address/main?addressDetails=' + data.addressDetails +
          '&code1=' + data.code1 + '&code2=' + data.code2 + '&code3=' + data.code3 +
          '&name=' + data.name + '&telephone=' + data.telephone + '&isDefault=' + data.isDefault + '&id=' + data.id)
    }
  },
  onShow () {
    this.getAddress()
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
  .address-box{
    margin-bottom: 50px;
  }
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
  .no-address{
    color: #888;
    text-align: center;
    position: absolute;
    top: 20px;
    width: 100%;
  }
}  
</style>
