import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-tokens'
const timeKey = 'hrsaas-ihrm-time'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
// 获取时间戳
export function getTime() {
  return Cookies.get(timeKey)
}
export function setTime() {
  return Cookies.set(timeKey, Date.now())
}
