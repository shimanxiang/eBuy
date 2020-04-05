<template>
  <div @click.stop="gotoDetail(curGood.id)" class="card ub-box newer-box" :class="{'z-border-bottom-1-eee':isLast==false}">
    <div class="imgBox"><img :src="curGood.mainImg" class="z-img-cover"></div>
    <div class="z-padding-h-10-px ub-flex-1 ub-box ub-col">
      <div class="ub-flex-1 ub-box ub-ver ub-between">
        <span class="z-font-size-15 z-lines-1-overflow-hidden z-font-weight-bold">{{curGood.prodName}}</span>
      </div>
      <p class="z-font-size-12 subTitle">{{curGood.prodDesc}}</p>
      <p class="ub-flex-1 ub-box ub-ver ub-between ub-flex-end z-margin-bottom-5-px">
        <span class="z-font-size-16 food-price">¥{{curGood.presentPrice}}<span class="food-weight"> /{{curGood.specList[0].specDesc}}</span></span>
      </p>
      <div class="editIcon" @click.stop="addCart"><img src="../../static/images/edit.png" alt="" srcset="" /></div>
    </div>
  </div>
</template>
<script>
  import { apiAddShoppingCar } from '@/request/api.js'
  export default {
    props: ['curGood', 'isLast'],
    data () {
      return {
        loading: false
      }
    },
    methods: {
      gotoDetail (id) {
        wx.navigateTo({url: '/pages/goodDetail/main?id=' + id})
      },
      addCart () {
        this.addShoppingCar()
      },
      async addShoppingCar () {
        if (this.loading) return false
        this.loading = true
        let ret = await apiAddShoppingCar({
          num: 1,
          productId: this.curGood.id,
          specId: this.curGood.specList[0].id
        })
        if (ret.data.resultCode === '000001') {
          wx.showToast({
            title: '添加成功~',
            icon: 'success'
          })
          this.loading = false
        } else {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
          this.loading = false
        }
      }
    }
  }
</script>
<style lang="less">
  .card img{width: 83px;height: 75px; margin-top: 8px;margin-left: 8px;}
  .imgBox{
    width: 98px;height: 90px;
    background-color: #F8F8F8;
  }
  .newer-box{
    margin-bottom: 10px;
    background-color: white;
    height: 88px;
    border-radius: 3px;
    padding: 10px;
    .subTitle{
      color: #b5b5b5;
      white-space: nospace;
      text-overflow: ellipsis;
      overflow: hidden;
      width: 100%;
    }
    .food-price{
      font-size:16px;
      font-weight:bold;
      color:rgba(228,58,75,1);
    }
    .food-weight{
      color:rgba(136,136,136,1);
      font-size: 11px;
    }
    .editIcon{
      position: relative;
      img{
        position: absolute;
        width: 31px;
        height: 31px;
        right: -8px;
        z-index: 9999;
        top: -41px;
      }
    }
  }
</style>
