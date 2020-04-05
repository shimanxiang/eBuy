<template>
  <div class="notice-container">
    <div class="title">{{title}}</div>
    <div>{{content}}</div>
  </div>
</template>
<script>
import { apiGetNotice } from '@/request/api.js'
export default {
  data () {
    return {
      noticeId: '',
      loading: false,
      content: '',
      title: '',
      createTime: ''
    }
  },
  methods: {
    async getNotice () {
      if (this.loading) return false
      this.loading = true
      let ret = await apiGetNotice({
        noticeId: this.noticeId
      })
      if (ret.data.resultCode !== '000001') {
        wx.showToast({
          title: '公告查询失败~',
          icon: 'none'
        })
        this.loading = false
      } else {
        this.title = ret.data.resultObject.title
        this.content = ret.data.resultObject.content
        this.loading = false
      }
    }
  },
  onShow () {
    wx.setNavigationBarTitle({title: '公告'})
  },
  onLoad (options) {
    if (options.id) {
      this.noticeId = options.id
    }
    this.getNotice()
  }
}
</script>
<style lang="less">
.notice-container{
    width:100%;
    min-height:100%;
    background:#fff;
    padding: 20px 15px 20px 15px;
    box-sizing: border-box;
    .title{
        text-align: center;
        font-size: 17px;
        font-weight: bold;
        margin-bottom: 10px;
    }
}
</style>
