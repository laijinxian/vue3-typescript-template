<template>
  <div class="home-content">
    <div class="fast-service">
      <p class="title">快捷服务</p>
      <ul>
        <li v-for="(item, index) in services" :key="index">
          <img :src="item.img" alt="">
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="city-info">
      <div class="city-name">
        <van-cell is-link @click="showCityPopup">{{currentCommunity.communityName ? currentCommunity.communityName : '请选择'}}</van-cell>
        <van-popup position="top" v-model:show="show">
          <p class="m-city">我的小区</p>
          <ul class="city-list">
            <li v-for="(city, index) in cityList" :key="index" @click="selectCity(city)">
              <p>{{city.communityName}}</p>
              <p> <span>{{city.provinceName}}</span>  <span>{{city.districtName}}</span></p>
            </li>
          </ul>
        </van-popup>
      </div>
      <div class="open-door">
        <div class="access-control-button">
          <img src="@/assets/images/open-door.png" alt="">
          <p>常用门禁: {{commonlyUsedDoor.doorControlName}}</p>
        </div>
        <div class="access-control-key">
          <ul>
            <li v-for="item in accessControlList" :key="item.doorControlId">
              <img src="@/assets/images/door-key.png" alt="">
              <p>{{item.doorControlName}}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, PropType, ref } from 'vue'
import { useStore } from "vuex";
import { IGlobalState } from "@/store";
import * as Types from "@/store/modules/Home/types";
import { IHomeState, ICity, IAccessControl } from '@/store/modules/Home/interface'
export default defineComponent({
  name: 'homeContent',
  isComponents: true,
  props: {
    cityList: {
      type: Array as PropType<ICity[]>
    },
    accessControlList: {
      type: Array as PropType<IAccessControl[]>
    }
  },
  async setup() {
    let store = useStore<IGlobalState>()
    const state = reactive({
      value1: 0,
      show: false,
       services: [{
        img: require('@/assets/images/simple_01.png'),
        name: '物业电话'
      }, {
        img: require('@/assets/images/simple_02.png'),
        name: '扫一扫'
      }, {
        img: require('@/assets/images/simple_03.png'),
        name: '申请记录'
      }, {
        img: require('@/assets/images/simple_04.png'),
        name: '密码开门'
      }]
    })
    let commonlyUsedDoor = computed(() => store.state.home.commonlyUsedDoor)
    let currentCommunity = ref({
      communityName: ''
    })
    const showCityPopup = () => {
      state.show = true
    }
    const selectCity = (city: ICity) => {
      state.show = false
      store.dispatch(`home/${Types.GET_ACCESS_CONTROL_LIST}`, { 
        communityId: city.communityId
      })
      currentCommunity.value.communityName = city.communityName
    }
    return {
      ...toRefs(state),
      showCityPopup,
      selectCity,
      currentCommunity,
      commonlyUsedDoor
    }
  }
})
</script>
 
<style scoped lang="less">
 .home-content{
   margin-top: 20px;
   border-radius: 16px;
    .fast-service{
      padding: 0 25px;
      background: #fff;
      overflow: hidden;
      border-radius: 16px;
      .title{
        font-size: 36px;
        margin: 30px 0;
      }
      ul{
        display: flex;
        margin-bottom: 40px;
        li{
          width: 25%;
          text-align: center;
          img{
            width: 70px;
            height: 70px;
          }
          p{
            font-size: 30px;
            margin-top: 15px;
          }
        }
      }
    }
    .city-info{
      margin-top: 30px;
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      .city-name{
        .m-city{
          line-height: 70px;
          font-size: 30px;
          background: #F6F6F6;
          padding: 0 30px;
        }
        .city-list{
          padding: 0 30px;
          li{
            height: 110px;
            border-bottom: 1px solid #e2e2e2;
            > p:first-child{
              color: #333333;
              font-size: 38px;
              margin: 20px 0;
            }
            > p:last-child{
              color: #9B9B9B;
              font-size: 30px;
            }
          }
        }
        /deep/ .van-cell{
          padding: 10px 15px;
          .van-cell__value{
            font-size: 15px;
            font-weight: 600;
          }
        }
      }
      .open-door{
        .access-control-button{
          margin-bottom: 40px;
          text-align: center;
          > img{
            width: 300px;
            height: 300px;
            animation: scaleDraw 2s infinite linear alternate;
          }
          > p{
            font-size: 36px;
            font-weight: 600;
            margin-top: 10px;
          }
        }
      }
      .access-control-key{
        padding: 0 40px;
        margin-bottom: 50px;
        ul{
          overflow-x: auto;
          white-space: nowrap;
          &::-webkit-scrollbar {
            display: none; /* Chrome Safari */
          }
          li{
            display: inline-block;
            width: 200px;
            text-align: center;
            vertical-align: top;
            >img{
              width: 120px;
              height: 120px;
            }
            >p{
              overflow: hidden;
              margin-top: 10px;
              padding: 0 10px;
              line-height: 40px;
              white-space: pre-wrap;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;  // 控制多行的行数
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
 }
@keyframes scaleDraw {
	/*定义关键帧、scaleDrew是需要绑定到选择器的关键帧名称*/
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.9);
  }
}
</style>