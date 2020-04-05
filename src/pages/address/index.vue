<template>
  <div class="address-container">
    <!-- 输入任意文本 -->
    <van-field  @change="changeName" :value="name" label="收货人" placeholder="填写收货人的姓名"/>
    <!-- 输入手机号，调起手机号键盘 -->
    <van-field  @change="changeTel" :value="telephone" type="tel" label="手机号" placeholder="填写收货人的联系方式" />

    <van-field v-model="region" label="所在地区" placeholder="选择收货人所在地区" right-icon="arrow" readonly @click="selectAddress" />
    <!-- 允许输入数字，调起全键盘 -->
    <van-field @change="changeDetail" :value="addressDetails" type="text" label="详细地址" placeholder="所在的街道、门牌号、小区等"/>

    <van-cell center title="设置为默认地址">
      <van-switch @click="switchChange" :value="isDefault" size="18px" class="switch"/>
      <!-- <switch :checked="isDefault" @change="switchChange" class="switch"/> -->
    </van-cell>
    <button class="btn-box btn-green" @click="saveAddress">立即保存</button>
    <button class="btn-box btn-red" @click="deleteAddress" v-show="addressId">删除</button>
    <van-overlay :show="isShow">
      <van-area :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']" @confirm="selectedRegion" @cancel="cancelArea"/>
    </van-overlay>
  </div>
</template>
<script>
  import cityData from '../../utils/cityData.js'
  import { apiAddAddress, apiUpdateAddress, apiDeleteAddress } from '@/request/api.js'
  export default {
    data () {
      return {
        name: '',
        telephone: '',
        code1: '', // 省
        code2: '', // 市
        code3: '', // 县/区
        code4: '',
        code5: '',
        region: '',
        addressId: '',
        fromList: false,
        addressDetails: '',
        isDefault: true,
        areaList: {},
        isShow: false
      }
    },
    methods: {
      switchChange (e) {
        this.isDefault = !this.isDefault
      },
      changeName (event) {
        this.name = event.mp.detail
      },
      changeTel (event) {
        this.telephone = event.mp.detail
      },
      changeDetail (event) {
        this.addressDetails = event.mp.detail
      },
      selectAddress () {
        this.isShow = true
      },
      selectedRegion (e) {
        if (e.target.values[0].name && e.target.values[1].name && e.target.values[2].name) {
          this.code1 = e.target.values[0].name
          this.code2 = e.target.values[1].name
          this.code3 = e.target.values[2].name
          this.region = e.target.values[0].name + e.target.values[1].name + e.target.values[2].name
          this.isShow = false
        } else {
          wx.showToast({
            title: '请选择完整',
            icon: 'none'
          })
        }
      },
      cancelArea () {
        this.isShow = false
      },
      saveAddress () {
        if (!(/^1[3|4|5|8|7|9|6][0-9]\d{4,8}$/.test(this.telephone))) {
          wx.showToast({
            title: '手机号格式错误',
            icon: 'none'
          })
          return false
        }
        if (this.addressId) {
          // 修改地址
          this.updateAddress()
        } else {
          this.addAddress()
        }
      },
      async deleteAddress () {
        let ret = await apiDeleteAddress({
          addressId: this.addressId
        })
        if (ret.data.resultCode === '000001') {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          })
        }
      },
      async updateAddress () {
        let ret = await apiUpdateAddress({
          id: this.addressId,
          addressDetails: this.addressDetails,
          code1: this.code1,
          code2: this.code2,
          code3: this.code3,
          name: this.name,
          telephone: this.telephone,
          isDefault: this.isDefault ? 1 : 0
        })
        if (ret.data.resultCode === '000001') {
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '更新失败',
            icon: 'none'
          })
        }
      },
      async addAddress () {
        let ret = await apiAddAddress({
          addressDetails: this.addressDetails,
          code1: this.code1,
          code2: this.code2,
          code3: this.code3,
          name: this.name,
          telephone: this.telephone,
          isDefault: this.isDefault ? 1 : 0
        })
        if (ret.data.resultCode === '000001') {
          if (this.fromList) {
            wx.navigateBack()
          } else {
            wx.redirectTo({url: '/pages/order/main?addressDetails=' + this.addressDetails +
            '&code1=' + this.code1 + '&code2=' + this.code2 + '&code3=' + this.code3 +
            '&name=' + this.name + '&telephone=' + this.telephone + '&isDefault=' + this.isDefault + '&id=' + ret.data.resultObject.id})
          }
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      },
      resetAddress () {
        this.name = ''
        this.telephone = ''
        this.code1 = '' // 省
        this.code2 = '' // 市
        this.code3 = '' // 县/区
        this.code4 = ''
        this.code5 = ''
        this.region = ''
        this.addressId = ''
        this.addressDetails = ''
        this.isDefault = false
        this.fromList = false
      }
    },
    mounted () {
      this.areaList = cityData
    },
    onLoad (options) {
      if (options.id) {
        wx.setNavigationBarTitle({title: '修改地址'})
        this.code1 = options.code1
        this.code2 = options.code2
        this.code3 = options.code3
        this.name = options.name
        this.telephone = options.telephone
        this.addressDetails = options.addressDetails
        if (options.isDefault === 'true') {
          this.isDefault = true
        } else {
          this.isDefault = false
        }
        this.addressId = options.id
        this.region = this.code1 + this.code2 + this.code3
      } else {
        this.resetAddress()
      }
      if (options.list === '1') {
        this.fromList = true
      } else {
        this.fromList = false
      }
    }
  }
</script>
<style lang="less">
.address-container{
  width:100%;
  background:white;
  padding: 15px;
  box-sizing: border-box;
  .van-cell:after{
    border-bottom: 0;
  }
  .van-cell__title{
    font-size:13px;
    font-weight:bold;
    color:rgba(34,34,34,1);
  }
  .switch{
    transform: scale(0.65);
  }
  ._van-area{
    position: absolute;
    width: 100%;
    bottom: 0;
  }
  .btn-box{
    font-size:15px;
    border-radius:6px;
    color: white;
    margin-top: 30px;
  }
  .btn-red{
    margin-top: 10px;
    background: #E43A4B;
  }
  button::after{
    border: 0;
  }
}

</style>
