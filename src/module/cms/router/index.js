import Home from '@/module/home/page/home.vue';
import page_list from '@/module/cms/page/page_list.vue';
import page_add from '@/module/cms/page/page_add.vue';
import page_edit from '@/module/cms/page/page_edit.vue';
export default [{
  path: '/',
  component: Home,
  // 菜单名称
  name: 'CMS',
  hidden: false,
  children:[
    {
      path: '/cms/page/list',
      component: page_list,
      name: '页面管理',
      hidden: false
    },
    {
      path: '/cms/page/add',
      component: page_add,
      name: '添加页面',
      hidden: true
    },
    {
      path: '/cms/page/edit/:pageId',
      component: page_edit,
      name: '修改页面',
      hidden: true
    }
  ]
}]
