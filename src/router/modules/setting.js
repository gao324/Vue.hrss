import Layout from '@/layout'
export default {
  path: '/settings',
  name: '',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/setting'),
    // 路由原信息
    meta: {
      title: '公司设置', // 左侧导航读取title
      icon: 'setting'
    }
  }]
}
