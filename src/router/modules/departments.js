import Layout from '@/layout'
export default {
  path: '/departments',
  name: '',
  component: Layout,
  children: [{
    path: '',
    component: () => import('@/views/departments'),
    // 路由原信息
    meta: {
      title: '组织架构', // 左侧导航读取title
      icon: 'tree'
    }
  }]
}
