import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource';
import goods from "../components/goods/goods";
import ratings from "../components/ratings/ratings";
import sell from "../components/seller/seller";

Vue.use(Router);
Vue.use(VueResource);

//路由配置，并放在Router实例中
export default new Router({
  routes:[
    {
      path:'/goods',
      name:'goods',
      component:goods
    },
    {
      path:'/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path:'/sell',
      name:'sell',
      component:sell
    }
  ]
})
