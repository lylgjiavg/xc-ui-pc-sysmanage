<template>
  <div>
    <!--美观换行-->
    <br><br>

    <!--添加页面表单-->
    <el-form :model="pageForm" :rules="pageFormRules" ref="ruleForm" label-width="80px">

      <!--站点下拉框-->
      <el-form-item label="所属站点" prop="siteId">
        <el-select v-model="pageForm.siteId"  @change="updateTemplateList" placeholder="请选择">
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">
          </el-option>
        </el-select>
      </el-form-item>

      <!--模板下拉框-->
      <el-form-item label="选择模板" prop="templateId">
        <el-select v-model="pageForm.templateId" placeholder="请选择">
          <el-option
            v-for="item in templateList"
            :key="item.templateId"
            :label="item.templateName"
            :value="item.templateId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="页面名称" prop="pageName">
        <el-input v-model="pageForm.pageName" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="别名" prop="pageAliase">
        <el-input v-model="pageForm.pageAliase" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="访问路径" prop="pageWebPath">
        <el-input v-model="pageForm.pageWebPath" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="物理路径" prop="pagePhysicalPath">
        <el-input v-model="pageForm.pagePhysicalPath" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="pageForm.pageType">
          <el-radio class="radio" label="0">静态</el-radio>
          <el-radio class="radio" label="1">动态</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker
          type="datetime"
          placeholder="创建时间"
          v-model="pageForm.pageCreateTime">
        </el-date-picker>
      </el-form-item>

    </el-form>

    <!--提交按钮-->
    <div slot="footer" class="dialog‐footer">
      <el-button type="primary" @click="addSubmit('ruleForm')">提交</el-button>
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>

  </div>
</template>

<script>

  import * as cmsApi from './../api/cms'
  export default {
    name: "page_add",
    data() {
      return {
        // 站点列表
        siteList: [],
        // 模版列表
        templateList: [],
        // 新增表单数据
        pageForm: {
          siteId: '',
          templateId: '',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          pageParameter: '',
          pagePhysicalPath: '',
          pageType: '',
          pageCreateTime: new Date()
        },
        // 表单校验规则
        pageFormRules: {
          siteId: [{required: true, message: '请选择站点', trigger: 'blur'}],
          templateId: [{required: true, message: '请选择模版', trigger: 'blur'}],
          pageName: [{required: true, message: '请输入页面名称', trigger: 'blur'}],
          pageWebPath: [{required: true, message: '请输入访问路径', trigger: 'blur'}],
          pagePhysicalPath: [{required: true, message: '请输入物理路径', trigger: 'blur'}]
        },
        // 站点数据Id(用于根据站点Id查询对应模板信息,下拉框二级联动)
        queryParams: {
          siteId: ''
        }
      }
    },
    methods: {
      // 提交表单数据
      addSubmit(formName) {
        // 根据规则校验表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('确认提交?').then((result) => {
              cmsApi.page_add(this.pageForm).then((res) => {
                if(res.success){
                  this.$message({
                    message: '恭喜你，提交成功!',
                    type: 'success'
                  });
                  this.resetForm('ruleForm');
                }else {
                  if(res.message){
                    this.$message.error(res.message);
                  }else{
                    this.$message.error('错了哦，提交失败!');
                  }
                }
              });
            }).catch((result) => {
              this.$message.error('错了哦，提交失败!');
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 返回数据列表页面
      goBack() {
        this.$router.push({
          path: '/cms/page/list',
          // 传入数据列表页面状态(列表页数, 站点, 页面别名)信息
          query: {
            page: this.$route.query.page,
            siteId: this.$route.query.siteId,
            pageAliase: this.$route.query.pageAliase
          }
        })
      },
      // 更新站点下拉框数据
      updateSiteList() {
        cmsApi.site_list().then((result) => {
          this.siteList = result.queryResult.list;
        });
      },
      // 更新模板下拉框数据(根据站点Id,实现下拉框二级联动)
      updateTemplateList(siteId) {
        this.queryParams.siteId = siteId;
        this.pageForm.templateId = '';
        cmsApi.template_list(this.queryParams).then((result) => {
          this.templateList = result.queryResult.list;
        });
      }
    },
    created() {
      this.updateSiteList();
      this.updateTemplateList(null);
    }
  }

</script>

<style scoped>
</style>
