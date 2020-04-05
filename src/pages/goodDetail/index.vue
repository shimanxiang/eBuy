<template>
  <div class="detail-container ub-box ub-col ub-ver">
	<scroll-view scroll-y scroll-top="0">
	   <div class="ub-box ub-ver z-bg-color-fff">
        <swiper class="swiper" current="0" @change="slidechange">
          <block v-for="(item, idx) in imgUrls" :key="idx">
            <swiper-item>
              <image @click.stop="previewImage([item])" class="z-width-100-percent z-img-cover indexImg" :src="item">
				<div class="indexImg-bk ub-box ub-col">
					<span class="z-font-size-12 z-color-fff z-box-sizing-border">{{curIndex}}/{{imgUrls.length}}</span>
				</div>
			</image>
            </swiper-item>
          </block>
        </swiper>
      </div>
	  <dl class="ub-box ub-col foodDetail">
		<!-- <dd class="discount"><span>限时八折</span></dd> -->
		<dd class="z-width-100-percent z-box-sizing-border z-bg-color-fff ub-box ub-between">
			<p class="ub-box ub-ver">
				<span class="z-font-size-20">{{productDetail.prodName}}</span>
			</p>
			<p class="ub-box ub-ver b5Color">
				<span class="z-font-size-11">已售 {{productDetail.sellCount}}份</span>
			</p>
		</dd>
		<dd class="z-width-100-percent z-box-sizing-border z-bg-color-fff ub-box ub-between">
			<p class="ub-box ub-ver z-margin-top-8-px" >
				<span class="z-font-size-13 b5Color">{{productDetail.prodDesc}}</span>
			</p>
			<!-- <p class="ub-box ub-ver">
				<span class="z-font-size-11 b5Color">剩 420份</span>
			</p> -->
		</dd>
		<dd class="z-margin-top-15-px z-margin-bottom-15-px">
			<div>
				<span class="food-price">¥{{presentPrice}}</span>
				<span class="food-weight">/{{activeSpec}}</span>
				<span v-if="originalPrice != presentPrice">
					<span class="food-price-origin">¥{{originalPrice}}</span>
				</span>
			</div>
		</dd>
		<dd class="title-small">
			<span>规格选择</span>
		</dd>
		<dd>
			<button :class="activeIndex == index ? 'btnSelect active' : 'btnSelect' " v-for="(item, index) in productDetail.specList" :key="item.id" @click="setIndex(index, item)">{{item.specDesc}}</button>
		</dd>
		<dd class="z-margin-top-10-px z-margin-bottom-10-px">
			<span class="title-small">数量选择</span>
			<div class="stepper ub-box ub-ver">  
				<!-- 减号 -->  
				<text class="num <= 1 ? 'disabled sign del' : 'sign del'" @click="delCount">-</text>  
				<!-- 数值 -->  
				<input class="number" type="number" :value="num"  disabled="disabled"/>  
				<!-- 加号 -->  
				<text :class="num >= 10 ? 'disabled sign add' : 'sign add'" @click="addCount($event)">+</text>  
			</div> 
		</dd>						
	  </dl>
	  <div class="split"></div>
	  <dl class="z-padding-all-15-px">
		  <dd>
			  <span class="title-header">商品详情</span>
		  </dd>
		  <dd class="detail-content">
			  <div>
				<span class="left-label">{{productDetail.details}}</span>
				<!-- <span class="right-label">500g/750g/600g</span> -->
			  </div>
				<!-- <div class="z-margin-bottom-10-px"><span class="left-label">规格</span><span class="right-label">500g/750g/600g</span></div> -->
			  <!-- <div><span class="left-label">规格</span><span class="right-label">500g/750g/600g</span></div> -->
		  </dd>
	  </dl>
	  <div class="split"></div>
	  <dl class="z-padding-all-15-px">
		<dd class="z-width-100-percent z-box-sizing-border z-bg-color-fff ub-box ub-between">
			<p class="ub-box ub-ver">
				<span class="title-header">商品评价</span>
			</p>
			<!-- <p @click.stop="$openWin('/pages/comment/main')" class="ub-box ub-ver comment-all-color">
				<span class="z-padding-right-7-px">查看全部</span>
				<van-icon name="arrow" class="icon-color-custom" style="margin-top:3px;"/>
			</p> -->
		</dd>
		<dd class="z-box-sizing-border z-bg-color-fff ub-box ub-between" style="margin-bottom: 30px">
			<ul class="ub-flex-1 ub-box ub-col" v-if="comments.length > 0">
				<li v-for="(val, idx) in comments" :key="idx">
					<comment :comment="val" :isShowLike="false"></comment>
				</li>
			</ul>
			<div class="z-color-888 z-font-size-12 noComment" v-else>暂无任何评价</div>
		</dd>
	  </dl>
	</scroll-view>
	<div class="bottom-card">
		<div class="left-bottom">
			<div>
				<image src="/static/images/shopcar.png" />
				<!-- <span class="bus-num">22</span> -->
			</div>
			<span class="shop-price"><span class="z-font-size-12 red">¥</span><span class="z-font-size-18 red">{{totalMoney}}</span></span>
		</div>
		<div class="right-bottom" @click="addShoppingCar">加入购物车</div>
	</div>
  </div>
</template>
<script>
import comment from '../../components/comment.vue'
import { apiProductDetails, apiAddShoppingCar } from '@/request/api.js'
export default {
  components: {comment},
  data () {
    return {
      curIndex: 1,
      num: 1,
      loading: false,
      productDetail: {}, // 商品信息
      specInventorys: [], // 规格
	  proId: '',
	  presentPrice: '', // 现价
	  originalPrice: '', // 原价
      activeIndex: 0,
	  activeSpec: 0, // 单位
	  activeSpecId: '',
      imgUrls: [],
      comments: []
    }
  },
  computed: {
    totalMoney () {
	  return (+this.presentPrice * this.num).toFixed(2)
    }
  },
  methods: {
    previewImage (imgs = [], curIdx = 0) {
      wx.previewImage({current: imgs[curIdx], urls: imgs})
    },
    slidechange (e) {
      this.curIndex = e.target.current + 1
    },
    /* 加数 */
    addCount () {
      this.num++
    },
    delCount () {
      if (this.num > 1) {
        this.num--
      }
    },
    setIndex (index, item) {
      this.activeIndex = index
	  this.activeSpec = item.specDesc
	  this.activeSpecId = item.id
	  this.originalPrice = item.originalPrice
	  this.presentPrice = item.presentPrice
    },
    async getProductDetails () {
      let ret = await apiProductDetails({prodId: this.proId})
      this.productDetail = {}
      this.imgUrls = []
      this.specInventorys = []
	  this.comments = []
	  this.activeIndex = 0
	  this.activeSpec = 0 // 单位
	  this.activeSpecId = ''
	  this.num = 1
      if (ret.data.resultCode === '000001') {
        this.productDetail = ret.data.resultObject.productVO
        // this.categories = ret.data.resultObject.slice()
        this.imgUrls = [this.productDetail.mainImg, this.productDetail.secondImg]
        this.specInventorys = this.productDetail.specList
        this.activeSpec = this.specInventorys[0].specDesc
        this.activeSpecId = this.specInventorys[0].id
        this.presentPrice = this.specInventorys[0].presentPrice
        this.originalPrice = this.specInventorys[0].originalPrice
        this.comments = ret.data.resultObject.comments
      }
    },
    async addShoppingCar () {
      if (this.loading) return false
      this.loading = true
      let ret = await apiAddShoppingCar({
        num: this.num,
        productId: this.proId,
        specId: this.activeSpecId
      })
      if (ret.data.resultCode === '000001') {
        wx.showToast({
          title: '添加成功~',
          icon: 'success'
        })
        this.loading = false
      } else {
        this.loading = false
      }
    }
  },
  mounted () {
  },
  onLoad (options) {
    if (options.id) {
      this.proId = options.id
    }
    this.getProductDetails()
  }
}
</script>
<style scoped lang="less">
.detail-container{
	width:100%;
	.noComment{
		text-align: center;
		margin: 20px 0;
		width: 100%;
	}
}
  .swiper{height: 270px;width: calc(100%)}
  .indexImg{height: 270px;position: relative;}
  .indexImg-bk{position: absolute;bottom: 10px;right: 10px;z-index: 1;width:35px;
	height:20px;
	background:rgba(181,181,181,.3);
	border-radius:14px;}
  .indexImg-bk span{
	padding-left: 9px;
	padding-top: 2px;
  }
  .b5Color{
	  color: #B5B5B5;
  }
  .foodDetail{
	  padding-left: 15px;
	  padding-right: 15px;
  }
  .discount{
	width:50px;
	height:15px;
	background:linear-gradient(88deg,rgba(255,135,98,1) 0%,rgba(255,71,71,1) 100%);
	border-radius:0px 0px 0px 3px;
	color: white;
	margin-top: 10px;
	margin-bottom: 5px;
	font-size: 11px;
	text-align: center;
  }
  .food-price-origin{
	  font-size: 11px;
	  color: #B5B5B5;
	  text-decoration: line-through;
	  margin-left: 8px;
  }
  .food-price{
	font-size:22px;
	font-weight:bold;
	color:rgba(228,58,75,1);
  }
  .food-weight{
	font-size:12px;
	font-weight:bold;
	color:rgba(136,136,136,1);
  }
  .title-header{
	font-size:15px;
	font-weight:bold;
	color:rgba(34,34,34,1);
  }
  .title-small{
	font-size:12px;
	font-family:PingFangSC-Bold,PingFang SC;
	font-weight:bold;
	color:rgba(34,34,34,1);
	margin-bottom: 5px;
  }
  .btnSelect{
	width:47px;
	height:26px;
	display: inline-block;
	font-size: 11px;
	border-radius: 0px;
	margin-right: 10px;
	text-align: center;
	padding: 0;
	&.active{
	  color: white;
	}
  }
  button::after{
	border-radius: 0px;
	border: 0px;
  }
  .split{
	width: 100%;
	height: 10px;
	background:rgba(247,247,247,1);
  }
  .detail-content{
	background:rgba(247,247,247,1);
	color:rgba(34,34,34,1);
	font-size: calc(12px);
	padding: calc(10px);
	margin-top: calc(10px);
	// .left-label{
	// 	color: #888888;
	// 	width: 90px;
	// 	display: inline-block;
	// }
	.left-label{
		color: #888888;
		display: inline-block;
	}
  }
  .comment-all-color{
	font-size: calc(13px);
  }
/*主容器*/  
.stepper {  
    width:75px;
	height:23px; 
    /*给主容器设一个边框*/  
	border:1px solid rgba(226,226,226,1);
	font-size: 15px;
	float: right;
}  
  
/*加号和减号*/  
.stepper .sign {  
    width:25px;
	height:23px;
	line-height: 23px;
    text-align: center;  
	float: left;
	background:rgba(247,247,247,1);
  
}
.stepper .add{
	font-weight: bold;
}  
.stepper .del{
	color: #D0D0D0;
}  
/*数值*/  
.stepper .number {  
    width:26px;
	height:23px;
	line-height: 23px;
	background:rgba(255,255,255,1);
    float: left;  
    margin: 0 auto;   
    text-align: center;  
    color: #222222;
}  
   
/*禁用样式*/  
.stepper .disabled{  
    color: #ccc;  
}
.bottom-card{
	position: fixed;
	bottom: 0;
	width: 100%;
	height:44px;
	background:rgba(255,255,255,1);
	box-shadow:0px 0px 3px 0px rgba(0,0,0,0.07);
	padding-bottom: 10px;
	box-sizing: border-box;
	.red{
		color: #E43A4B;
	}
	.shop-price{
		margin-left: 60px;
	}
	.left-bottom{
		width: 52%;
		display: inline-block;
		.bus-num{
			position: absolute;
			left: 82rpx;
			top: -26rpx;
			font-size: calc(9px);
			width:13px;
			height:13px;
			background:rgba(245,78,94,1);
			color: white;
			border-radius: 8px;
			padding-left: 3px;
			padding-top: 3px;
		}
		image{
			position: absolute;
			top: -10px;
			left: 15px;
			width:40px;
			height:40px;
		}
	}
	.right-bottom{
		width: 48%;
		color: white;
		font-size: calc(15px);
		display: inline-block;
		height:calc(44px);
		text-align: center;
		line-height: 44px;
	}
}  

</style>