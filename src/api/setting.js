import request from '@/utils/request'
// id查询企业信息
export function getCompany(id) {
  return request({
    url: `/company/${id}`
  })
}
// id获取所有角色信息
export function getCompanyUser(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// id获取角色信息
export function getCompanyId(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
// 删除角色信息
export function delCompanyUser(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
// 编辑角色信息
export function putCompanyUser(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}
// 编辑角色信息
export function addCompanyUser(data) {
  return request({
    url: `/sys/role`,
    method: 'POST',
    data
  })
}
// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
