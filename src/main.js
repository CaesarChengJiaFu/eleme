// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from "./App";
import VueRouter from 'vue-router'
import goods from "./components/goods/goods";
import ratings from "./components/ratings/ratings";
import seller from "./components/seller/seller";
import VueResource from 'vue-resource';
import VuePreview from 'vue-preview';

import './common/stylus/index.styl'

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VuePreview);

var routes = [
  {path: '/', redirect: '/goods'},//初始化显示的内容
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
]

var router = new VueRouter({
  linkActiveClass: 'active', //默认被点击激活时候的样式
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})



