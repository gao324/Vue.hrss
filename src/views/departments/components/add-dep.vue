<template>
  <!-- 弹出层 -->
  <el-dialog
    title="添加部门信息"
    :visible="dialogVisible"
    @close="btnCal"
  >
    <!-- 表单数据 -->
    <el-form ref="form" :rules="rules" :label-position="labelPosition" label-width="120px" :model="formData">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <el-option v-for="val in depts" :key="val.id" :value="val.name" :label="val.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- 选项框 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="btnCal">取 消</el-button>
      <el-button type="primary" @click="btnReq">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>
import { getCompany, addCompany, searchCompany, editorCompany } from '@/api/departments'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    // 校验同级部门下的名字是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取最新的部门数据
      const { depts } = await getCompany()

      let isRepeat = false
      if (this.formData.id) {
        // 编辑状态下的验证规则
        // 同级部门下，除了我之外，不能有和我同名的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 新增状态下的验证规则
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 先获取同级部门下的所有部门，在判断是否与文本框的值相等，返回布尔值

      isRepeat ? callback(new Error(`该部门下已经有${value}部门了`)) : callback()
    }

    // 校验编码 编码不能与全部的编码相同
    const checkCodeRepeat = async(rule, value, callback) => {
      // 获取最新的部门数据
      const { depts } = await getCompany()
      // 先获取同级部门下的所有部门，在判断是否与文本框的值相等，返回布尔值
      let isRepeat = false
      if (this.formData.id) {
        // 编辑状态下的验证规则
        // 同级部门下，除了我之外，不能有和我同名的
      } else {
        // 保证我自己的编码独一无二
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`该部门下已经有${value}编码了`)) : callback()
    }

    return {
      labelPosition: 'left',
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      depts: []
    }
  },
  created() {
    this.getDepartment()
  },

  methods: {
    async getDepartment() {
      // 查询所有部门
      const { depts } = await getCompany()
      this.depts = depts
      // console.log(this.depts)
    },
    // 数据重写
    async searchCompanys(id) {
      const data = await searchCompany(id)
      this.formData = data
      // console.log(data)
    },
    btnReq() {
      this.$refs.form.validate(async isOk => {
        if (isOk) {
          // 判断如果部门编码重复则是修改不重复则是添加
          if (this.formData.id) {
            await editorCompany(this.formData)
          } else {
            await addCompany({ ...this.formData, pid: this.treeNode.id })
          }
          // console.log(this.formData)
          this.$refs.form.resetFields()
          this.$emit('updataList')
        }
      })
    },
    btnCal() {
      this.$refs.form.resetFields()
      this.$emit('updataList')
    }
  }
}
</script>

<style>

</style>
