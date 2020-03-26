<template>
  <div class="home-container ub-box ub-col">
    <scroll-view scroll-y scroll-top="0">
      <!--轮播图-->
      <div class="ub-box ub-ver z-bg-color-fff">
        <swiper class="swiper" indicator-dots="true" autoplay="true" interval="5000" duration="500">
          <block v-for="item in carouselList" :key="item.id">
            <swiper-item>
              <image :src="item.image" class="z-width-100-percent" mode="widthFix"/>
            </swiper-item>
          </block>
        </swiper>
      </div>
      <div class="recommend-box" v-for="item in productInfo" :key="item.categoryId">
        <div class="food-title">{{item.categoryName}}</div>
        <scroll-view scroll-x="true">
          <div class="food-box" v-for="(list, subIndex) in item.productList" :key="list.id" @click.stop="goDetail(list.id)">
            <div class="food-img"><image :src="list.mainImg" class="z-width-100-percent" mode="widthFix" /></div>
            <div class="food-name">{{list.prodName}}</div>
            <div class="food-desc">{{list.prodDesc}}</div>
            <div><span class="food-price">¥{{list.presentPrice}}&nbsp;</span><span class="food-weight">/{{list.unitDesc}}</span>
              <div class="editIcon" @click.stop="addCart(list)"><img src="/static/images/edit.png" alt="" srcset="" /></div>
            </div>
          </div>
        </scroll-view>
      </div>
      <!--每日精品-->
      <!-- <dl class="recommend-box ub-box ub-col newer-list">
        <div class="food-title">新人专享</div>
        <dd class="ub-box ub-col">
          <good v-for="(val, idx) in 7" :key="idx" :isLast="idx===6"></good>
        </dd>
      </dl> -->
    </scroll-view>
  </div>
</template>
<script>
  import good from '../../components/good.vue'
  import { apiProduct, apiCarousel, apiAddShoppingCar } from '@/request/api.js'
  export default {
    components: {good},
    data () {
      return {
        imgUrls: [
          'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg',
          'http://p0.meituan.net/codeman/a97baf515235f4c5a2b1323a741e577185048.jpg',
          'http://p0.meituan.net/codeman/daa73310c9e57454dc97f0146640fd9f69772.jpg'
        ],
        carouselList: [],
        productInfo: []
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    // watch: {
    //   userInfo () {
    //     if (this.userInfo.nickName) {
    //       this.getProduct()
    //     }
    //   }
    // },
    methods: {
      goDetail (id) {
        wx.navigateTo({url: '/pages/goodDetail/main?id=' + id})
      },
      async getProduct () {
        let ret = await apiProduct()
        this.productInfo = []
        if (ret.data.resultCode === '000001') {
          this.productInfo = ret.data.resultObject.slice()
        }
      },
      async getCarousel () {
        let ret = await apiCarousel()
        this.carouselList = []
        if (ret.data.resultCode === '000001') {
          this.carouselList = ret.data.resultObject.slice()
        }
      },
      addCart (data) {
        this.addShoppingCar(data)
      },
      async addShoppingCar (data) {
        let ret = await apiAddShoppingCar({
          num: 1,
          productId: data.id,
          spec: 1
        })
        if (ret.data.resultCode === '000001') {
          wx.showToast({
            title: '添加成功~',
            icon: 'success'
          })
        }
      }
    },
    mounted () {
      this.getProduct()
      this.getCarousel()
    },
    onPullDownRefresh () {
      console.log('onPullDownRefresh')
      setTimeout(() => { wx.stopPullDownRefresh() }, 600)
    },
    onShow () {
      wx.setNavigationBarTitle({title: '生鲜'})
    }
  }
</script>
<style lang="less">
.recommend-box{
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
  white-space: nowrap;
  .food-title{
    font-size:15px;
    font-weight:bold;
    color:rgba(34,34,34,1);
    margin-bottom: 10px;
  }
  .food-box{
    background-color: #fff;
    width: 99px;
    height: 168px;
    display: inline-block;
    margin-right: 10px;
    border-radius:3px;
    padding-left: 10px;
    .food-img{
      width: 90px;
      height: 77px;
      background:rgba(248,248,248,1);
      margin-top: 11px;
      image{
        width: 90px;
        height: 77px;
      }
    }
    .food-name{
      font-size:13px;
      font-weight:bold;
      color:rgba(34,34,34,1);
      margin-top: 10px;
    }
    .food-desc{
      font-size:11px;
      font-weight:bold;
      color:rgba(181,181,181,1);
      margin-top: 3px;
      margin-bottom: 5px;
      white-space: nospace;
      text-overflow: ellipsi;
      overflow: hidden;
      width: 95px;
    }
    .food-price{
      font-size:13px;
      font-weight:bold;
      color:rgba(228,58,75,1);
    }
    .food-weight{
      font-size:10px;
      font-weight:bold;
      color:rgba(136,136,136,1);
    }
    .editIcon{
      position: relative;
      img{
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        right: 9px;
        z-index: 9999;
        top: -34rpx;
      }
    }
  }
}
.home-container{
  width:100%;
  background:#F8F6F9;
  min-height: 100%;
  padding-bottom: 30px;
}
.search{background: #f5f5f5;border-radius: 12px;padding: 5px 10px}
.swiper{height: 165px;width: calc(100%)}
.icon-item{width:20%;padding: 10px 13px 0 13px;box-sizing: border-box;}
.icon{width: 38px;height: 38px;border-radius: 50%;color: #fff;font-size: 24px}
.adv{border-right: 2px solid #eee}
.adv img{width: 50px;height: 50px}
.good{border-bottom: 1px solid #DDD8CE}
.good img{width: 80px;height: 80px}
</style>
