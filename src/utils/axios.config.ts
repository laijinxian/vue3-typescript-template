import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
import router from '@/router'
import { Toast } from 'vant'

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  axios.defaults.baseURL = `https://test-mobileapi.qinlinkeji.com/api/`
} else {
  // 正式环境
  axios.defaults.baseURL = `正式环境地址`
}

let sourceAjaxList: Canceler[] = []

export const axionInit = () => {
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // 设置 cancel token  用于取消请求 (当一个接口出现401后，取消后续多有发起的请求，避免出现好几个错误提示)
    config.cancelToken = new axios.CancelToken(function executor(cancel: Canceler): void {
      sourceAjaxList.push(cancel)
    })

    // 存在 sessionId 为所有请求加上 sessionId
    if (localStorage.getItem(`h5_sessionId`) && config.url!.indexOf('/user/login') < 0) config.url += ('sessionId=' + localStorage.getItem(`h5_sessionId`))
    if (!config.data) config.data = {}
    return config
  }, function (error) {
    // 抛出错误
    return Promise.reject(error)
  })

  axios.interceptors.response.use((response: AxiosResponse) => {
    const { status, data } = response
    if (status === 200) {
      // 如果不出现错误，直接向回调函数内输出 data
      if (data.code === 0) {
        return data
      } else if (data.code === 401) {
        // 出现未登录或登录失效取消后面的请求
        sourceAjaxList.length && sourceAjaxList.length > 0 && sourceAjaxList.forEach((ajaxCancel, index) => {
          ajaxCancel() // 取消请求
          delete sourceAjaxList[index]
        })
        Toast({
          message: data.message,
          duration: 2000
        })
        return router.push('/login')
      } else {
        return data
      }
    } else {
      return response
    }
  }, error => {
    const { response } = error
    // 这里处理错误的 http code or 服务器或后台报错
    if (!response || response.status === 404 || response.status === 500) {
      if (!response) {
        console.error(`404 error %o ${error}`)
      } else {
        if (response.data && response.data.message) {
          Toast.fail({
            message: '请求异常，请稍后再试!',
            duration: 2000
          })
        }
      }
    }
    return Promise.reject(error.message)
  })
}
