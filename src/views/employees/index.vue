<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 表格头部 -->
      <TopList :show-before="true">
        <span slot="before">共{{ total }}条记录</span>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">导出</el-button>
          <el-button size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </TopList>
      <!-- 表格 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" align="center">
            <template slot-scope="{row}">
              <img
                v-imagerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="EmployeeEnumList" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="del(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :page-size="page.size"
            :current-page="page.page"
            :total="total"
            layout="prev, pager, next"
            @current-change="changePage"
          />
        </el-row>
        <AddEmployees
          :show-dialog.sync="showDialog"
          @Update="getEmployeesList"
        />
      </el-card>

    </div>
    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配权限弹出层 -->
    <AssignRole
      ref="assignRole"
      :show-role-dialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployees from './componts/add-employees.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './componts/assign-role.vue'

export default {
  components: { AddEmployees, AssignRole },
  data() {
    return {
      page: {
        page: 1,
        size: 10
      },
      total: 0,
      list: [],
      loading: false,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: ''
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 获取员工列表
    async getEmployeesList() {
      const data = await getEmployees(this.page)
      this.total = data.total
      this.list = data.rows
      this.loading = false
    },
    // 页码改变
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeesList()
    },
    // 枚举
    EmployeeEnumList(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除
    async del(id) {
      try {
        await this.$confirm('是否删除')
        await delEmployee(id)
        this.$message('删除成功')
        this.getEmployeesList()
      } catch (err) {
        console.log(err)
      }
    },
    // 导出
    exportExcel() {
      // 建立中英文关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 按需导入
      import('@/vendor/Export2Excel').then(async excel => {
        // 获取数据
        const { rows } = await getEmployees({ page: 1, size: this.total })
        // 转化数据结构
        const data = this.formJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          // 配置信息
          header: Object.keys(headers), // 转化中英文
          data: data, // 数据
          filename: '员工工资表', // 表头
          multiHeader,
          merges
        })
      })
    },
    // 格式化转化
    formJson(headers, rows) {
      return rows.map(item => {
        // item是一个数组
        return Object.keys(headers).map(key => {
          // 处理时间格式
          if (headers[key] === 'correctionTime' || headers[key] === 'timeOfEntry') {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            // 处理聘用形式
            const obj = EmployeeEnum.hireType.find(val => val.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    // 二维码弹层
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async editRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserDetailById(id)
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
