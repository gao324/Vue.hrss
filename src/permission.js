// 权限拦截 路由跳转  导航守卫
import router from './router'
import store from './store'
// 引入进度条
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 不需要导出
// 前置守卫
// next  通过 跳转 跳转终止
const whiteList = ['/login', '/404'] // 白名单
router.beforeEach(async function(to, from, next) {
  nProgress.start() // 开启进度条
  if (store.getters.token) {
    // 有token
    if (to.path === './login') {
      // 如果是登录页
      next('/') // 跳转登录页
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
        // console.log(roles.menus)
        // 获取权限列表
        // const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // console.log(routes)
        // // router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        // next()
      }
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
    //   地址在白名单
      next()
    } else {
      next('/login')
    }
  }
  // 关闭进度条
  nProgress.done()
})
// 后置守卫
router.afterEach(() => {
  // 关闭进度条
  nProgress.done()
})
