<template>
  <div @click.stop="gotoDetail(good.goodId)" class="card ub-box newer-box" :class="{'z-border-bottom-1-eee':isLast==false}">
    <div class="imgBox"><img :src="good.img" class="z-img-cover"></div>
    <div class="z-padding-h-10-px ub-flex-1 ub-box ub-col">
      <div class="ub-flex-1 ub-box ub-ver ub-between">
        <span class="z-font-size-15 z-lines-1-overflow-hidden z-font-weight-bold">{{good.mainTitle}}</span>
      </div>
      <p class="z-font-size-12 subTitle">{{good.subTitle}}</p>
      <p class="ub-flex-1 ub-box ub-ver ub-between ub-flex-end">
        <span class="z-font-size-16 food-price">${{good.price}}<span class="food-weight"> /500g</span></span>
      </p>
      <div class="editIcon" @click.stop="addCart"><img src="../../static/images/edit.png" alt="" srcset="" /></div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['curGood', 'isLast'],
    data () {
      return {
        good: {
          goodId: '100',
          img: 'http://p0.meituan.net/200.0/deal/522fd16a9b25479496188b59476d1b941062402.jpg@206_0_828_828a%7C267h_267w_2e_90Q',
          mainTitle: '索菲特大酒店锦厨国际餐厅自助餐',
          subTitle: '单人自助晚餐',
          distance: '1.7',
          price: '308',
          sales: '42739'
        }
      }
    },
    methods: {
      gotoDetail (id) {
        wx.navigateTo({url: '/pages/goodDetail/main'})
      },
      addCart () {
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    }
  }
</script>
<style lang="less">
  .card img{width: 80px;height: 67px; margin-top: 12px;margin-left: 5px;}
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
    }
    .food-price{
      font-size:12px;
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
        right: 0px;
        z-index: 9999;
        top: -47px;
      }
    }
  }
</style>
