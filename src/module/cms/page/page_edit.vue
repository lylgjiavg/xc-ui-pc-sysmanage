<template>
  <div>
    <!--美观换行-->
    <br><br>

    <el-form :model="pageForm" label-width="80px" :rules="pageFormRules" ref="pageForm">

      <!--所属站点-->
      <el-form-item label="所属站点" prop="siteId">
        <el-select v-model="pageForm.siteId" @change="updateTemplateList" placeholder="请选择站点">
          <el-option
            v-for="item in siteList"
            :key="item.siteId"
            :label="item.siteName"
            :value="item.siteId">
          </el-option>
        </el-select>
      </el-form-item>

      <!--选择模板-->
      <el-form-item label="选择模版" prop="templateId">
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

      <el-form-item label="数据Url" prop="dataUrl">
        <el-input v-model="pageForm.dataUrl" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="pageForm.pageType">
          <el-radio class="radio" label="0">静态</el-radio>
          <el-radio class="radio" label="1">动态</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="创建时间">
        <el-date-picker type="datetime" placeholder="创建时间" v-model="pageForm.pageCreateTime"></el-date-picker>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="go_back">返回</el-button>
      <el-button type="primary" @click.native="editSubmit" :loading="addLoading">提交</el-button>
    </div>

  </div>
</template>
<script>
  import * as cmsApi from '../api/cms'

  export default {
    data() {
      return {
        // 页面id
        pageId: '',
        // 模版列表
        templateList: [],
        // 加载效果标记
        addLoading: false,
        // 新增界面数据
        pageForm: {
          siteId: '',
          templateId: '',
          pageName: '',
          pageAliase: '',
          pageWebPath: '',
          dataUrl: '',
          pageParameter: '',
          pagePhysicalPath: '',
          pageType: '',
          pageCreateTime: new Date()
        },
        pageFormRules: {
          siteId: [
            {required: true, message: '请选择站点', trigger: 'blur'}
          ],
          templateId: [
            {required: true, message: '请选择模版', trigger: 'blur'}
          ],
          pageName: [
            {required: true, message: '请输入页面名称', trigger: 'blur'}
          ],
          pageWebPath: [
            {required: true, message: '请输入访问路径', trigger: 'blur'}
          ],
          pagePhysicalPath: [
            {required: true, message: '请输入物理路径', trigger: 'blur'}
          ]
        },
        siteList: [],
        // 查询条件数据
        queryParams: {
          siteId: ''
        }
      }
    },
    methods: {
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
      },
      go_back() {
        this.$router.push({
          path: '/cms/page/list',
          query: {
            page: this.$route.query.page,
            siteId: this.$route.query.siteId,
            pageAliase: this.$route.query.pageAliase
          }
        })
      },
      // 修改页面信息
      editSubmit() {
        this.$refs.pageForm.validate((valid) => {//表单校验
          if (valid) {
            // 表单校验通过
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //修改提交请求服务端的接口
              cmsApi.page_edit(this.pageId, this.pageForm).then((res) => {
                console.log(res);
                if (res.success) {
                  this.addLoading = false;
                  this.$message({
                    message: '提交成功',
                    type: 'success'
                  });
                  //返回
                  this.go_back();

                } else {
                  this.addLoading = false;
                  this.$message.error('提交失败');
                }
              });
            });
          }
        });
      },
      // 查询页面信息
      // TODO:模板信息不能正常回显
      getPageInfo(){
        this.pageId = this.$route.params.pageId;
        //根据主键查询页面信息
        cmsApi.page_get(this.pageId).then((result) => {
          // alert(result.cmsPage.siteId);
          this.queryParams.siteId = result.cmsPage.siteId;
          console.log(result);
          if (result) {
            this.pageForm = result.cmsPage;
          }
          // alert(this.queryParams.siteId);
          this.updateTemplateList(this.queryParams.siteId);
        });
      }
    },
    created: function () {
      this.getPageInfo();
    },
    mounted: function () {
      this.updateSiteList();
    }
  }
</script>
<style>

</style>
