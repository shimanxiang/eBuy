<template>
  <div class="address-container">
    <!-- 输入任意文本 -->
    <van-field  @change="changeName" :value="name" label="收货人" placeholder="填写收货人的姓名"/>
    <!-- 输入手机号，调起手机号键盘 -->
    <van-field  @change="changeTel" :value="tel" type="tel" label="手机号" placeholder="填写收货人的联系方式" />

    <van-field v-model="region" label="所在地区" placeholder="选择收货人所在地区" right-icon="arrow" readonly @click="selectAddress" />
    <!-- 允许输入数字，调起全键盘 -->
    <van-field v-model="address" type="text" label="详细地址" placeholder="所在的街道、门牌号、小区等"/>

    <van-cell center title="设置为默认地址">
      <van-switch @click="switchChange" :value="isDefalut" size="18px" class="switch"/>
      <!-- <switch :checked="isDefalut" @change="switchChange" class="switch"/> -->
    </van-cell>
    <button class="btn-green" @click="saveAddress">立即保存</button>
    <van-overlay :show="isShow">
      <van-area :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']" @confirm="selectedRegion" @cancel="cancelArea"/>
    </van-overlay>
  </div>
</template>
<script>
  import cityData from '../../utils/cityData.js'
  export default {
    data () {
      return {
        name: '',
        tel: '',
        region: '',
        address: '',
        isDefalut: true,
        areaList: {},
        isShow: false
      }
    },
    methods: {
      switchChange (e) {
        this.isDefalut = !this.isDefalut
      },
      changeName (event) {
        this.name = event.mp.detail
      },
      changeTel (event) {
        this.tel = event.mp.detail
      },
      selectAddress () {
        this.isShow = true
      },
      selectedRegion (e) {
        if (e.target.values[0].name && e.target.values[1].name && e.target.values[2].name) {
          this.region = e.target.values[0].name + e.target.values[1].name + e.target.values[2].name
          this.isShow = false
        } else {
          console.log('要选择完整')
        }
      },
      cancelArea () {
        this.isShow = false
      },
      saveAddress () {
        let address = this.region + this.address
        wx.redirectTo({url: '/pages/order/main?address=' + address + '&name=' + this.name + '&tel=' + this.tel + '&isDefalut=' + this.isDefalut + '&id=' + 34})
      }
    },
    mounted () {
      this.areaList = cityData
    },
    onUnload: function () {
      this.$redirectTo({url: '/pages/order/main'})
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
  .btn-green{
    font-size:15px;
    border-radius:6px;
    color: white;
    margin-top: 30px;
  }
  button::after{
    border: 0;
  }
}

</style>
