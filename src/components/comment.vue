<template>
  <div class="z-width-100-percent ub-box z-padding-v-15-px">
    <div class="z-margin-right-10-px">
      <img class="z-img-cover" :src="comment['userHeadImg']" style="width:26px;height:26px;border-radius:50%">
    </div>
    <ul class="ub-flex-1 ub-box ub-col">
      <li class="ub-box ub-between z-margin-bottom-3-px">
        <span class="z-font-size-12 z-color-222">{{comment.userName}}</span>
        <span class="z-font-size-12 z-color-b5">{{comment.createTime}}</span>
      </li>
      <li class="ub-box ub-between z-margin-bottom-3-px">
        <van-rate v-model="comment.level" :size="12"/>
      </li>
      <li class="ub-box z-margin-bottom-8-px">
        <p class="z-font-size-12 z-color-222 z-lineHeight-22">{{comment.content}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      comment: {
        type: Object
      },
      isShowLike: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {}
    },
    mounted () {},
    methods: {
      previewImage (imgs = [], curIdx = 0) {
        wx.previewImage({current: imgs[curIdx], urls: imgs})
      }
    }
  }
</script>
<style scoped>
  .like{border-radius: 10px; padding: 2px 13px;border:1px solid #eee;}
  .z-color-222{
    color:#222;
  }
  .z-color-b5{
    color:#b5b5b5;
  }
</style>