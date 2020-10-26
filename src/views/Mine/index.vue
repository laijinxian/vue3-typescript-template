<template>
  <div class="mine-container">
    <header>
      <img src="@/assets/images/gzh.jpg" alt="">
      <div>
        <p>公众号：web全栈进阶</p>
        <p>188****8888</p>
      </div>
    </header>
    <section>
      <div class="title">
        <van-notice-bar
          background="#fff"
          left-icon="volume-o"
          text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
        />
      </div>
      <div class="content">
        <p class="title">功能服务</p>
        <ul>
          <li v-for="(item, index) in services" :key="index">
            <img :src="item.img" alt="">
            <p>{{item.name}}</p>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, toRefs} from 'vue'
export default defineComponent({
  name: 'mine',
  isComponents: true,
  setup() {
    const state = reactive({
      services: [{
        img: require('@/assets/images/systme_01.png'),
        name: '我的家'
      }, {
        img: require('@/assets/images/systme_02.png'),
        name: '申请记录'
      }, {
        img: require('@/assets/images/systme_03.png'),
        name: '开门教程'
      }, {
        img: require('@/assets/images/systme_04.png'),
        name: '门卡管理'
      }, {
        img: require('@/assets/images/systme_05.png'),
        name: '使用帮助'
      }, {
        img: require('@/assets/images/systme_06.png'),
        name: '用户反馈'
      }]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
 
<style scoped lang="less">
.mine-container{
  height: 100%;
  background: #F6F8FB;
  padding: 0 30px;
  header{
    display: flex;
    align-items: center;
    height: 300px;
    > img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-left: 50px;
    }
    > div{
      font-size: 30px;
      margin-left: 30px;
      color: #333;
      > p:first-child{
        color: #000;
        font-weight: 600;
        margin-bottom: 30px;
      }
    }
  }
  section{
    /deep/ .van-notice-bar{
      border-radius: 10px;
    }
    .content{
      background: #fff;
      border-radius: 16px;
      padding: 0 30px;
      margin-top: 30px;
      padding-bottom: 10px;
      .title{
        height: 100px;
        line-height: 100px;
        font-size: 30px;
        border-bottom: 1px solid #e2e2e2;
      }
      ul{
        margin: 50px 0 20px;
        width: 100%;
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        grid-template-rows: 200px 200px;
        li{
          text-align: center;
          > img{
            width: 100px;
            height: 100px;
          }
          > p {
            margin-top: 20px;
            font-size: 30px;
          }
        }
      }
    }
  }
}
</style>