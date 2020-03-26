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
				<span class="food-price">¥{{productDetail.presentPrice}}</span>
				<span class="food-weight">/{{productDetail.unitDesc}}</span>
				<span v-if="productDetail.presentPrice != productDetail.originalPrice">
					<span class="food-price-origin">¥{{productDetail.originalPrice}}</span>
				</span>
			</div>
		</dd>
		<dd class="title-small">
			<span>规格选择</span>
		</dd>
		<dd>
			<button :class="activeIndex == index ? 'btnSelect active' : 'btnSelect' " v-for="(item, index) in specInventorys" :key="item.id" @click="setIndex(index, item)">{{item.specDesc}}</button>
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
			<ul class="ub-flex-1 ub-box ub-col">
				<li v-for="(val, idx) in comments" :key="idx">
					<comment :comment="val" :isShowLike="false"></comment>
				</li>
			</ul>
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
		<div class="right-bottom">加入购物车</div>
	</div>
  </div>
</template>
<script>
	import comment from '../../components/comment.vue'
	import { apiProductDetails } from '@/request/api.js'
	export default {
	  components: {comment},
	  data () {
	    return {
	      curIndex: 1,
		  num: 1,
		  productDetail: {}, // 商品信息
		  specInventorys: [], // 规格
		  proId: '',
		  activeIndex: 0,
		  activeSpec: 0, // 单位
	      imgUrls: [
	        'http://p1.meituan.net/codeman/826a5ed09dab49af658c34624d75491861404.jpg',
	        'http://p0.meituan.net/codeman/a97baf515235f4c5a2b1323a741e577185048.jpg',
	        'http://p0.meituan.net/codeman/daa73310c9e57454dc97f0146640fd9f69772.jpg'
	      ],
	      comments: [
	        {
	          header: 'https://img.meituan.net/avatar/855458f5c24ab19951f382ee99533ad981495.jpg@37w_37h_1e_1c',
	          name: 'AqU753874254',
	          time: '2018-05-07',
	          star: '4.0',
	          say: '菜品很多，强烈推荐龙虾，超级棒！每次来都吃撑！很满意的一家自主餐！生日当天海送了蛋糕、服务员“代玉琳”美女，服务态度超级好，热情，人也长的美美哒，给她一个赞！ ',
	          imgs: [
	            'http://p0.meituan.net/shaitu/40b07a385f90bca838efa48a911bf491253024.jpg',
	            'http://p0.meituan.net/shaitu/f6af829ff902040fb3225643b2775c1f111115.jpg',
	            'http://p0.meituan.net/shaitu/e96132da9f76af022d6e521b2265ad70204304.jpg',
	            'http://p0.meituan.net/shaitu/307d287b8d55f1d67dab188502a684ec158341.jpg'
	          ]
	        },
	        {
	          header: 'https://p0.meituan.net/122.74/mmc/35ad1f9253761ea6ff822b5e659f234f3758.png',
	          name: 'PPL546030823',
	          time: '2018-05-06',
	          star: '4.5',
	          say: '环境很好，有昆明的夕阳相伴，谢谢美女服务员代玉琳的热忱服务，度过和朋友悠闲的晚餐时光🎈 #煎鹅肝# ',
	          imgs: [
	            'http://p0.meituan.net/400.0/shaitu/bc52b03f7f091d6711b8a1ec024a0e6a83730.jpg',
	            'http://p0.meituan.net/400.0/shaitu/053247a6b8ede53824435f23196971d2124167.jpg',
	            'http://p0.meituan.net/400.0/shaitu/0783b3f70ab47607593dcba906c7d570147806.jpg'

	          ]
	        }
	      ]
	    }
	  },
	  computed: {
		  totalMoney () {
			  return (+this.productDetail.presentPrice * this.activeSpec * this.num).toFixed(2)
		  }
	  },
	  methods: {
	    previewImage (imgs = [], curIdx = 0) {
	      wx.previewImage({current: imgs[curIdx], urls: imgs})
	    },
	    slidechange (e) {
	      console.log(e)
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
	      this.activeSpec = +item.spec
	    },
    	async getProductDetails () {
		  let ret = await apiProductDetails({prodId: 1})
		  this.productDetail = {}
		  this.imgUrls = []
		  this.specInventorys = []
		  this.comments = []
		  if (ret.data.resultCode === '000001') {
			  this.productDetail = ret.data.resultObject.productVO
			  // this.categories = ret.data.resultObject.slice()
			  this.imgUrls = [this.productDetail.mainImg, this.productDetail.secondImg]
			  this.specInventorys = ret.data.resultObject.specInventorys
			  this.activeSpec = this.specInventorys[0].spec
			  this.comments = ret.data.resultObject.comments
		  }
		  console.log(ret)
		  // console.log(this.categories)
	    }
	  },
	  mounted () {
	    this.getProductDetails()
	  },
	  onLoad (options) {
	    if (options.id) {
		  this.proId = options.id
    	}
	    console.log(options)
	  }
	}
</script>
<style scoped lang="less">
.detail-container{
	width:100%;
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