<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col>
      <span>{{ nameTools.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nameTools.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isShow" command="put">修改子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isShow" command="del">删除子部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delCompany } from '@/api/departments'
export default {
  props: {
    nameTools: {
      type: [Object, Array],
      required: true
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(command) {
      if (command === 'del') {
      // 删除
        // await delCompany(this.nameTools.id)
        this.$confirm('此操作将删除该部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delCompany(this.nameTools.id)
          // console.log(this.nameTools.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.$emit('refresh')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else if (command === 'put') {
        // 修改
        this.$emit('editorList', this.nameTools)
      } else {
        // 添加
        this.$emit('addDepts', this.nameTools)
      }
    }
  }
}
</script>

<style>

</style>
