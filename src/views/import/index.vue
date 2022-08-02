<template>
  <UploadExcel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    // 创建success函数拿到header, results
    async  success({ header, results }) {
      // 如果是导入员工
      // console.log({ header, results })
      // 定义对应关系userRelations
      // debugger
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      // 遍历所有results选项
      results.forEach(item => {
        // debugger
        const userInfo = {}
        // 替换对应关系
        Object.keys(item).forEach(key => {
          // 时间格式转化
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key] // 值：item[key] 替换的英文userRelations[key]
            // console.log('1' + userRelations[key], '2' + userInfo[userRelations[key]], '3' + item[key])
          }
        })
        // console.log(userInfo)
        arr.push(userInfo)
      })
      // var newArr = results.map(item => {
      //   const userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     userInfo[userRelations[key]] = item[key] // 替换
      //   })
      //   return userInfo
      // })
      await importEmployee(arr) // 调用导入接口
      this.$message.success('导入成功')
      this.$router.back()
    },
    // 定义处理时间函数
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>

</style>
