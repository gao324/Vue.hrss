import request from '@/utils/request'
// 获取组织架构
export function getCompany() {
  return request({
    url: '/company/department'
  })
}
// 删除组织架构部门
export function delCompany(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
// 添加组织架构部门
export function addCompany(data) {
  return request({
    url: `/company/department`,
    method: 'POST',
    data
  })
}
// 查询部门列表
export function searchCompany(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 修改部门信息
export function editorCompany(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
