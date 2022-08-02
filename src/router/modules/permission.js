import Layout from '@/layout'
export default {
  path: '/permission',
  name: '',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    // 路由原信息
    meta: {
      title: '权限管理', // 左侧导航读取title
      icon: 'lock'
    }
  }]
}
