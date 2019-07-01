import http from './../../../base/api/public'
import querystring from 'querystring'
let sysConfig = require('@/../config/sysConfig')
let apiUrl = sysConfig.xcApiUrlPre;

// 页面列表信息查询
export const page_list = (page, size, params) => {
  // 拼接查询条件
  let queryString = querystring.stringify(params);
  // 请求服务端的页面查询接口
  return http.requestQuickGet(apiUrl + "/cms/page/list/"+page+"/"+size+"?"+queryString);
}

// 页面信息添加
export const page_add = (params) => {

  return http.requestPost(apiUrl + "/cms/page/add", params);
}

// 站点数据查询
export const site_list = () => {

  return http.requestQuickGet(apiUrl + "/cms/site/list");
}

// 模板数据查询
export const template_list = (params) => {
  // 拼接查询条件
  let queryString = querystring.stringify(params);

  return http.requestQuickGet(apiUrl + "/cms/template/list"+"?"+queryString);
}

// 页面信息查询
export const page_get = (pageId) => {

  return http.requestQuickGet(apiUrl + "/cms/page/get/" + pageId);
}

// 页面信息修改
export const page_edit = (pageId, params) => {

  return http.requestPut(apiUrl + "/cms/page/update/" + pageId, params);
}

// 页面信息删除
export const page_del = (pageId) => {

  return http.requestDelete(apiUrl + "/cms/page/delete/" + pageId);
}
