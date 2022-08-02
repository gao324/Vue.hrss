// 挂载vue
import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// 引入饿了么ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// 引入css
import '@/styles/index.scss' // global css
// app根组件
import App from './App'
// 挂载vuex
import store from './store'
// 引入directives
import * as directives from '@/directives'
import * as filters from '@/filters'
// 挂载路由
import router from './router'
// 引入样式和验证规则
import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components'
import Print from 'vue-print-nb'
import CheckPermission from '@/mixin/checkPermission'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(Component)
Vue.use(Print)
Vue.mixin(CheckPermission)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
