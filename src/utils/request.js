import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTime } from '@/utils/auth'
const TimeOut = 7200 // 定义时间
// import store from '@/store'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // 超时时间
})
service.interceptors.request.use(config => {
  // 请求配置信息
  // 注入token
  if (store.getters.token) {
    if (IsTime()) {
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须返回
}, error => {
  if (error.response && error.response.data.code === 1002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
}
)
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message) // 提示错误信息
  return Promise.reject(error) // 返回执行错误 让当前的执行链跳出成功 直接进入 catch
})
function IsTime() {
  var curTime = Date.now()
  var timeStap = getTime()
  return (curTime - timeStap) / 1000 > TimeOut
}
export default service
