<template>
  <div class="search-container">
    <div>
      <van-tabs v-model="active" title-active-color="#222222" title-inactive-color="#B5B5B5">
        <van-tab title="默认"></van-tab>
        <van-tab title="价格"></van-tab>
        <van-tab title="销量"></van-tab>
        <van-tab title="筛选"></van-tab>
      </van-tabs>
    </div>
    <scroll-view scroll-x="true" class="food-scroll">
        <div :class="index % 2 == 0 ? 'food-box mr10' : 'food-box'" v-for="(list, index) in foodList" :key="list.id" @click.stop="goDetail(list.id)">
            <div class="food-img"><img src="/static/images/index1.png" alt=""></div>
            <div class="food-name">{{list.name}}</div>
            <div class="food-desc">{{list.desc}}</div>
            <div class="tl"><span class="food-price">¥{{list.price}}&nbsp;</span><span class="food-weight">/{{list.weight}}g</span></div>
        </div>
    </scroll-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        active: 2,
        foodList: [
          {name: '美食', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 1},
          {name: '猫眼电影', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 2},
          {name: '酒店住宿', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 3},
          {name: '休闲娱乐', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 4},
          {name: '外卖', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 5},
          {name: 'KTV', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 6},
          {name: '丽人', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 7},
          {name: '景点门票', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 8},
          {name: '火车票', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 9},
          {name: '民宿', desc: '肉质松嫩 雪花丰富', price: '39.9', weight: 500, id: 10}
        ]
      }
    },
    methods: {

    },
    onShow () {
      wx.setNavigationBarTitle({title: '搜索'})
    }
  }
</script>
<style lang="less">
.search-container{
    width:100%;
    background:rgba(248,248,248,1);
    .van-hairline--top-bottom:after{
        border-width: 0;
    }
    .van-tabs__line{
        display: none;
    }
    .van-tab--active{
        font-size: 13px;
    }
    .food-scroll{
      padding: 15px;
      box-sizing: border-box;
      text-align: center;
    }
    .mr10{
      margin-right: 10px;
    }
    .food-box{
        background-color: #fff;
        width: 165px;
        height: 220px;
        display: inline-block;
        border-radius:3px;
        padding-left: 10px;
        box-sizing: border-box;
        margin-bottom: 15px;
        .food-img{
            width: 139px;
            height: 122px;
            background:rgba(248,248,248,1);
            margin-top: 11px;
        img{
            width: 115px;
            height: 105px;
            margin-top: 10px;
        }
        }
        .food-name{
            font-size:13px;
            font-weight:bold;
            color:rgba(34,34,34,1);
            margin-top: 10px;
            text-align: left;
        }
        .food-desc{
            font-size:11px;
            color:rgba(181,181,181,1);
            margin-top: 3px;
            margin-bottom: 5px;
            text-align: left;
        }
        .tl{
            text-align: left;
            margin-top: 10px;
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
    }
}
</style>
