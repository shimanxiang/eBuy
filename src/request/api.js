
import { apiRequest } from './request'

const host = 'https://www.foodbuy.top/dragon-web'

// 登录接口
export const apiLogin = () => {
  return apiRequest(host + '/user/login', 'get')
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
  return apiRequest(host + '/shoppingCar/addShoppingCar', 'get', data)
}

// 查询购物车列表
export const apiListShoppingCar = () => {
  return apiRequest(host + '/shoppingCar/listShoppingCar', 'get')
}

// 删除购物车列表
export const apiDeleteShoppingCar = () => {
  return apiRequest(host + '/shoppingCar', 'delete')
}
