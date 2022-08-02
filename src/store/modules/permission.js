// 处理路由跳转
import { constantRoutes, asyncRouter } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  // 定义修改routes
  setRoutes(state, newRoutes) {
    // 静态路由＋权限路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 定义筛选出动态路由的函数
  filterRoutes(context, menus) {
    console.log(menus)
    const routes = []
    menus.forEach(item => {
      routes.push(...asyncRouter.filter(val => val.name === item))
    })
    context.commit('setRoutes', routes)
    console.log(routes)
    return routes
  }

}
export default {
  namespace: true,
  state,
  mutations,
  actions
}
