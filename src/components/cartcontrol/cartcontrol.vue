<template>
  <div class="cartcontrol">
    <transition name="fade"> <!-- 外层渐变，减号图标 -->
      <div class="cart-decrease" v-show="food.count > 0" @click="decreaseCart">
        <transition name="inner"> <!-- 内层滚动，滚动时包含字体，字体在inner中-->
          <span class="inner icon-remove_circle_outline"></span>
        </transition>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
      props: {
          food: {
              type: Object
          }
      },
      methods: {
          addCart(event) {
              if(!event._constructed){
                  return;
              }
              if(!this.food.count) {
                  Vue.set(this.food, 'count', 1);
              }else{
                  this.food.count++;
              }
              //设置滚动对象时，点击加号，设置一个派发事件，将DOM对象传出去，将target(DOM)作为cart.add事件的对象传入
              //$emit,$on,$off 分别来分发，监听、取消监听事件
              this.$emit('cart-add',event.target);
          },
          decreaseCart(event) {
              if(!event._constructed){
                  return;
              }
              if (this.food.count){
                  this.food.count--;
              }
          }
      }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease, .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0,160,220)
      &.fade-enter-active, &.fade-leave-active //进入动画时得状态/离开动画时生效
        transition all 0.4s linear
        opacity 1
        transform translate3d(0,0,0)
      &.fade-enter, &.fade-leave-active //动画的开始状态,动画一开始透明度要设为0/离开动画的结束状态
        opacity 0
        transform translate3d(24px,0,0)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        vertical-align top
        color rgb(0,160,220,0.2)
        &.inner-enter-active, &.inner-leave-active
          transition all 0.4s linear
          opacity 1
          transform rotate(0)
        &.inner-enter, &.inner-leave-active
          opacity 0
          transform rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block

</style>
