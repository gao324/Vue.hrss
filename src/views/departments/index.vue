<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 头部 -->
        <TreeTools
          :name-tools="company"
          :is-show="!isShow"
          @addDepts="addDepts"
        />
        <!-- 表格主体 -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <TreeTools
            slot-scope="{ data }"
            :name-tools="data"
            @addDepts="addDepts"
            @editorList="editorList"
            @refresh="getCompanys"
          />
        </el-tree>
      </el-card>
      <AddDep
        ref="list"
        :dialog-visible="dialogVisible"
        :tree-node="node"
        @updataList="updataList"
      />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getCompany } from '@/api/departments'
import { dealConpany } from '@/utils'
import AddDep from './components/add-dep.vue'
export default {
  components: { TreeTools, AddDep },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      departs: [],
      company: { name: '信阳纵横网络科技有限公司', manager: '负责人', id: '' },
      isShow: false,
      dialogVisible: false,
      node: null
    }
  },
  created() {
    this.getCompanys()
  },
  methods: {
    async getCompanys() {
      const res = await getCompany()
      const { companyName } = res
      this.company = { name: companyName }
      this.departs = dealConpany(res.depts, '')
    },
    addDepts(node) {
      this.dialogVisible = true
      this.node = node
    },
    editorList(node) {
      this.dialogVisible = true
      this.node = node
      this.$refs.list.searchCompanys(node.id)
    },
    updataList() {
      this.dialogVisible = false
      this.getCompanys()
    }
  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px  140px;
  font-size:14px;
}
</style>
