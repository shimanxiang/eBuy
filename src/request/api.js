
import { apiRequest } from './request'

const host = 'https://www.foodbuy.top/dragon-web'

// const host = 'https://dragon.free.idcfengye.com/dragon-web'

// 登录接口
export const apiLogin = (data) => {
  return apiRequest(host + '/user/login', 'get', data)
}

// 查询首页需要展示的商品列表
export const apiProduct = () => {
  return apiRequest(host + '/product', 'get')
}

// 查询商品分类页面的商品列表
export const apiProductWithCategory = () => {
  return apiRequest(host + '/product/listProductIndexVOWithCategoryPage', 'get')
}

// 查询商品详情
export const apiProductDetails = (data) => {
  return apiRequest(host + '/product/productDetails', 'get', data)
}

// 获取首页轮播
export const apiCarousel = () => {
  return apiRequest(host + '/carousel', 'get')
}

// 判断是否可以签到
export const apiCheckSignIn = () => {
  return apiRequest(host + '/user/checkSignIn', 'get')
}

// 用户每日签到
export const apiSignIn = () => {
  return apiRequest(host + '/user/signIn', 'put')
}

// 添加购物车
export const apiAddShoppingCar = (data) => {
  return apiRequest(host + '/shoppingCar', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 查询购物车列表
export const apiListShoppingCar = () => {
  return apiRequest(host + '/shoppingCar/listShoppingCar', 'get')
}

// 删除购物车列表
export const apiDeleteShoppingCar = (data) => {
  return apiRequest(host + '/shoppingCar/deleteShoppingCar', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 从购物车选择、进去待支付页面
export const apiQueryOrderInfoVOByShoppingCar = (data) => {
  return apiRequest(host + '/orderInfo/queryOrderInfoVOByShoppingCar', 'get', data)
}

// 查询优惠券列表
export const apiQueryCoupon = () => {
  return apiRequest(host + '/coupon', 'get')
}

// 获取openId
export const apigetOpenId = (data) => {
  return apiRequest(host + '/weiXin', 'get', data)
}

// 获取地址列表
export const apigetAddress = () => {
  return apiRequest(host + '/address', 'get')
}

// 添加地址
export const apiAddAddress = (data) => {
  return apiRequest(host + '/address', 'post', data)
}

// 修改地址
export const apiUpdateAddress = (data) => {
  return apiRequest(host + '/address', 'put', data)
}

// 删除地址
export const apiDeleteAddress = (data) => {
  return apiRequest(host + '/address/deleteAddress', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 分页查询订单信息
export const apiListSimpleOrderInfo = (data) => {
  return apiRequest(host + '/orderInfo/listSimpleOrderInfo', 'get', data)
}

// 生成待支付订单、并返回订单号
export const apiPostOrderInfo = (data) => {
  return apiRequest(host + '/orderInfo', 'post', data)
}

// doUnifiedOrder
export const apiDoUnifiedOrder = (data) => {
  return apiRequest(host + '/weiXin/doUnifiedOrder', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 从未支付订单选择、进去待支付页面||查询订单详情也使用该接口
export const apiQueryOrderInfoVOByOrderId = (data) => {
  return apiRequest(host + '/orderInfo/queryOrderInfoVOByOrderId', 'get', data)
}

// 个人中心数量查询
export const apiQueryNum = () => {
  return apiRequest(host + '/user/queryNum', 'get')
}

// 返回自提站点列表
export const apiGetListSites = () => {
  return apiRequest(host + '/site/listSites', 'get')
}

// 修改购物车数量
export const apiUpdateShoppingCarNum = (data) => {
  return apiRequest(host + '/shoppingCar/updateShoppingCarNum', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 商品分类页面的商品列表-搜索
export const apiGetProductSearch = (data) => {
  return apiRequest(host + '/product/productSearch', 'get', data)
}

// 商品分类页面的商品列表-排序搜索P:价格 S:销量 U:升序 D:降序 searchValue可为空
export const apiGetProductSortSearch = (data) => {
  return apiRequest(host + '/product/productSortSearch', 'get', data)
}

// 返回热门搜索和客户最新搜索历史
export const apiSearchList = () => {
  return apiRequest(host + '/product/searchList', 'get')
}

// 取消优惠券新增标识
export const apiUpdateNewCoupon = () => {
  return apiRequest(host + '/coupon/updateNewCoupon', 'get')
}

// 查询公告
export const apiGetNotice = (data) => {
  return apiRequest(host + '/notice', 'get', data)
}

// 订单确认收货
export const apiConfirmReceipt = (data) => {
  return apiRequest(host + '/orderInfo/confirmReceipt', 'post', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}

// 更新用户头像昵称
export const apiUpdateUser = (data) => {
  return apiRequest(host + '/user/updateUser', 'put', data, {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')})
}
