<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-tabs>
        <!-- 角色管理 -->
        <el-tab-pane label="角色管理">
          <!-- 按钮 -->
          <el-button type="primary" size="small" icon="el-icon-plus" @click="isShow = true">新增角色</el-button>
          <!-- 表格 -->
          <el-table border="" :data="rows">
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="名称"
              width="240"
              prop="name"
            />

            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column
              label="操作"
            >
              <template slot-scope="{ row }">
                <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="putCompanyUsers(row.id)">编辑</el-button>
                <el-button size="small" type="danger" :disabled="checkPermission('123')" @click="delCompanyUsers(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-row type="flex" justify="center" align="middle" style="height:60px">
            <el-pagination
              layout="prev,pager,next"
              :total="page.total"
              :current-page="page.page"
              :page-size="page.pagesize"
              @current-change="changePage"
            />
          </el-row>
          <!-- 弹出层 -->
          <el-dialog
            title="编辑弹层"
            :visible="isShow"
            width="60%"
            @close="btnCal"
          >
            <el-form ref="companyList" :rules="rules" :model="roleFrom" label-width="120px" label-position="left">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleFrom.name" />
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="roleFrom.description" />
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="btnCal">取 消</el-button>
              <el-button type="primary" @click="btnReq">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="分配权限" :visible="showPermDialog" @close="btnPermCancel">
            <!-- 权限是一颗树 -->
            <!-- 将数据绑定到组件上 -->
            <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
            <!-- id作为唯一标识 -->
            <el-tree
              ref="permTree"
              :data="permData"
              :props="defaultProps"
              :show-checkbox="true"
              :check-strictly="true"
              :default-expand-all="true"
              :default-checked-keys="selectCheck"
              node-key="id"
            />
            <!-- 确定 取消 -->
            <el-row slot="footer" type="flex" justify="center">
              <el-col :span="6">
                <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
                <el-button size="small" @click="btnPermCancel">取消</el-button>
              </el-col>
            </el-row>
          </el-dialog>
        </el-tab-pane>
        <!-- 公司信息 -->
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="企业名称">
              <el-input disabled style="width:400px" :value="comData.name" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input disabled style="width:400px" :value="comData.companyAddress" />
            </el-form-item>
            <el-form-item label="公司电话">
              <el-input disabled style="width:400px" :value="comData.companyPhone" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input disabled style="width:400px" :value="comData.mailbox" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" :rows="3" disabled style="width:400px" :value="comData.remarks" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyId,
  getCompany,
  getCompanyUser,
  delCompanyUser,
  putCompanyUser,
  addCompanyUser } from '@/api/setting'
import { getPermissionList, disPermissions } from '@/api/permission'
import { dealConpany } from '@/utils'

export default {
  components: {
    ...mapGetters(['companyId'])
  },
  data() {
    return {
      page: {
        page: 1,
        pagesize: 3,
        total: 0
      },
      comData: {},
      rows: [],
      rules: {
        name: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      roleFrom: {
        name: '',
        description: ''
      },
      isShow: false,
      showPermDialog: false, // 控制分配权限弹层的显示后者隐藏
      defaultProps: {
        label: 'name'
      },
      permData: [], // 专门用来接收权限数据 树形数据
      selectCheck: [], // 定义一个数组来接收 已经选中的节点
      roleId: null // 用
    }
  },
  created() {
    this.getCompanydata()
    this.getCompanyUsers()
  },
  methods: {
    // 获取公司信息
    async getCompanydata() {
      this.comData = await getCompany(this.companyId)
    },
    // 获取所有角色信息
    async getCompanyUsers() {
      const { rows, total } = await getCompanyUser(this.page)
      this.page.total = total
      this.rows = rows
      // console.log(rows, total)
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getCompanyUsers()
    },
    // 删除角色信息
    async delCompanyUsers(id) {
      try {
        await delCompanyUser(id)
        this.getCompanyUsers()
      } catch (err) {
        console.log(err)
      }
    },
    // 更新角色信息--回溯
    async putCompanyUsers(id) {
      // console.log(this.$refs.companyList)
      // 获取点击角色信息
      this.roleFrom = await getCompanyId(id)

      this.isShow = true
    },
    async btnReq() {
      try {
        await this.$refs.companyList.validate()
        // 通过校验
        if (this.roleFrom.id) {
          await putCompanyUser(this.roleFrom)
        } else {
          await addCompanyUser(this.roleFrom)
        }
        // console.log(this.roleFrom)
        this.getCompanyUsers()
        this.isShow = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCal() {
      this.$refs.companyList.resetFields()
      this.isShow = false
    },
    // 点击分配权限
    // 获取权限点数据 在点击的时候调用 获取权限点数据
    async assignPerm(id) {
      this.permData = dealConpany(await getPermissionList(), '0') // 转化list到树形数据
      this.roleId = id
      // 应该去获取 这个id的 权限点
      // 有id 就可以 id应该先记录下来
      const { permIds } = await getCompanyId(id) // permIds是当前角色所拥有的权限点数据
      console.log(permIds)
      this.selectCheck = permIds // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true
    },
    async  btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys(), this.roleId)
      await disPermissions({ permIds: this.$refs.permTree.getCheckedKeys(), id: this.roleId })
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
}
</script>

<style>

</style>
