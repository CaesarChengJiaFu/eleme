<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="item.id" class="menu-item"
            :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img :src="food.icon" class="preview-img" height="57" width="57">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopCart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from "../shopcart/shopcart";
    import cartcontrol from "../cartcontrol/cartcontrol";

    const ERR_OK = 0;

    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                classMap: [],
                goods: [],
                listHeight: [], //每个分类区间高度，累加的过程
                scrollY: 0 //要跟踪的滚轮Y轴值
            };
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i]; // 当前索引左区间
                    let height2 = this.listHeight[i + 1]; // 当前索引右区间
                    //落在区间内,为防止数组下标越界，！height2
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        console.log(i)
                        return i;
                    }
                }
                return 0;
            },

            //观测good对象，goods发生变化会重新计算进行更新，再将结果传递到cartcontrol（购物车）组件中
            selectFoods() { //遍历foods，看看选中了哪些商品
                let foods = [];
                this.goods.forEach((good) => { //先取到每一个分类
                    good.foods.forEach((food) => { //后取到每一个分类下得不同food
                        if(food.count) {
                            foods.push(food); //两层遍历，取到所有被选中得foods
                        }
                    });
                });
                return foods; //将结果传回到shopcart
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                this.$http.get('/api/goods').then((response) => {
                    response = response.body;
                    if (response.errno === ERR_OK) {
                        this.goods = response.data;
                        //Vue更新数据时是异步的，所以在数据未加载完全之前,BScroll无法获取目标高度，导致无法滚动
                        //为解决上述问题，运用nextTick()，保证DOM更新后立即执行tick代码块里的代码
                        this.$nextTick(() => {
                            this._initScroll();
                            this._calculateHeight();
                        });
                    }
                });
        },
        methods: {
            selectMenu(index, event) {
                if (!event._constructed) {
                    return;
                }
                this.foodsScroll.scrollTo(0, -this.listHeight[index], 300);
                /*let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list=hook");
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 300);*/
                console.log(index)
            },

            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true //better-scroll取消默认事件，这里派发一个点击事件
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3 // 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件，即scroll在滚动时能实时告诉滚动位置
                });
                //监听scroll事件，pos 回调函数参数， scrollY取整并取绝对值
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                })
            },

            _calculateHeight() {
                //从原生DOM里拿到分类列表即每个li，food-list-hook只作为class被JS选择
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let height = 0;
                this.listHeight.push(height); //第一个高度
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight; //每个分类区间的高度，clientHeight是元素客户区的大小，指的是元素内容及其边框所占据的空间大小
                    this.listHeight.push(height);
                }
            },

            _drop(target){
                this.$nextTick(() => {
                    this.$refs.shopCart.drop(target);
                })
            },

            cartAdd(target) {
                this._drop(target);
            }
        },

        components: {
            shopcart,
            cartcontrol
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    width: 100%
    height: 100%
    top: 174px
    bottom: 46px
    overflow: hidden

    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7

      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px

        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700

          .text
            border-none()

        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat

          &.decrease
            bg-image('decrease_3')

          &.discount
            bg-image('discount_3')

          &.guarantee
            bg-image('guarantee_3')

          &.invoice
            bg-image('invoice_3')

          &.special
            bg-image('special_3')


        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px

    .foods-wrapper
      flex: 1

      .title
        padding-left 24px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7

      .food-item
        display flex
        margin 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))

        &:last-child
          border-none()
          margin-bottom: 0

        .icon
          flex: 0 0 57px
          margin-right: 10px

        .content
          flex: 1

          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)

          .desc, .extra
            margin-bottom: 8px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)

          .desc
            line-height: 12px
            margin-bottom: 8px

          .extra
            .count
              margin-right: 12px

          .price
            line-height: 24px
            font-weight: 700

            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)

            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)

          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px
</style>
