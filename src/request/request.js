
export function apiRequest (url, method, data, header) { // 接收所需要的参数，如果不够还可以自己自定义参数
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {'content-type': 'application/x-www-form-urlencoded', 'cookie': wx.getStorageSync('sessionid')},
      success: function (res) {
        // 接口调用成功
        resolve(res)
      },
      fail: function (res) {
        reject(res)
        // fail调用接口失败
      }
    })
  })
  return promise // 注意，这里返回的是promise对象
}
