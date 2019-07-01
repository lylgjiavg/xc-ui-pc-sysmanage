<template>
    <div>
      <!--美观换行-->
      <br><br>

      <!--站点查询-->
      站点名称:
      <el-select v-model="queryParams.siteId" placeholder="请选择">
        <el-option
          v-for="item in params.siteNames"
          :key="item.siteId"
          :label="item.siteName"
          :value="item.siteId">
        </el-option>
      </el-select>
      &nbsp;&nbsp;&nbsp;&nbsp;

      <!--页面别名查询-->
      页面别名:
      <el-input
        placeholder="请输入内容"
        v-model="queryParams.pageAliase"
        style="width: 200px"
        clearable>
      </el-input>

      <!--查询按钮-->
      <el-button type="primary" v-on:click="query" round>查询</el-button>

      <!--新增按钮-->
      <router-link
          :to="{
            // 跳转路由路径
            path: '/cms/page/add',
            // 数据信息(当前页, 站点Id, 页面别名), 用来返回时能够回到当时状态
            query: {
              page: this.params.currentPage,
              siteId: this.queryParams.siteId,
              pageAliase: this.queryParams.pageAliase
            }
          }">
        <el-button type="primary" v-on:click="query" round>新增</el-button>
      </router-link>

      <!--数据表格-->
      <el-table
        :data="pageList"
        stripe
        style="width: 100%">
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="pageName" label="页面名称" width="220">
        </el-table-column>
        <el-table-column prop="pageAliase" label="别名" width="120">
        </el-table-column>
        <el-table-column prop="pageType" label="页面类型" width="120">
        </el-table-column>
        <el-table-column prop="pageWebPath" label="访问路径" width="200">
        </el-table-column>
        <el-table-column prop="pagePhysicalPath" label="物理路径" width="200">
        </el-table-column>
        <el-table-column prop="pageCreateTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="page">
            <el-button size="small" type="text" @click="edit(page.row.pageId)">编辑</el-button>
            <el-button size="small" type="text" @click="delPage(page.row.pageId)">删除</el-button>
            <el-button size="small" type="text" @click="preview(page.row.pageId)">页面预览</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页栏-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="params.pageTotal"
        :page-size="params.pageSize"
        :current-page="params.currentPage"
        @current-change="changePage"
        style="float: right">
      </el-pagination>

    </div>
</template>

<script>
  import * as cmsApi from "./../api/cms"
  export default {
    name: "page_list",
    data(){
      return {
        // 表格数据
        pageList: [],
        // 分页栏数据
        params: {
          pageTotal: 30,
          pageSize: 10,
          currentPage: 1,
          siteNames: []
        },
        // 查询条件数据
        queryParams: {
          pageAliase:'',
          siteId: ''
        }
      }
    },
    methods:{
      // 展示页面预览
      preview: function(pageId){
        window.open("http://www.xuecheng.com/cms/preview/"+pageId);
      },
      // 删除页面信息
      delPage: function(pageId){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cmsApi.page_del(pageId);
          // 更新页面信息
          this.query();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 更新页面列表数据
      query: function () {
        let page = Number.parseInt(this.params.currentPage || 1);
        let size = Number.parseInt(this.params.pageSize || 10);
        // 页面列表信息查询
        cmsApi.page_list(page, size, this.queryParams).then((result) => {
          this.pageList = result.queryResult.list;
          this.params.pageTotal = result.queryResult.total;
        })
      },
      // 分页栏页数改变,更新列表数据和分页栏数据信息
      changePage: function (page) {
        this.params.currentPage = page;
        this.query();
      },
      // 更新站点下拉框数据信息
      querySiteName: function () {
        cmsApi.site_list().then((result) => {
          this.params.siteNames = result.queryResult.list;
        })
      },
      // 修改页面信息(从路由传入当前页状态信息,便于返回为当前状态)
      edit: function (pageId) {
        this.$router.push({
          // 路径传参(路由路径信息为:path: '/cms/page/edit/:pageId')
          path: '/cms/page/edit/' + pageId,
          query: {
            page: this.params.currentPage,
            siteId: this.queryParams.siteId,
            pageAliase: this.queryParams.pageAliase
          }
        })
      }
    },
    // 钩子函数,在渲染页面信息前执行
    created(){
      // 由路由信息获得本页面状态(列表页数, 站点下拉框, 页面别名输入框)信息
      this.params.currentPage = this.$route.query.page;
      this.queryParams.siteId = this.$route.query.siteId;
      this.queryParams.pageAliase = this.$route.query.pageAliase;
    },
    // 钩子函数,在渲染页面信息后执行
    mounted() {
      this.query();
      this.querySiteName();
    }
  }

</script>

<style scoped>
</style>
