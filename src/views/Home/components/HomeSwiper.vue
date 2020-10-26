<template>
 <div class="home-swiper-content">
    <van-swipe class="swiper-content" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(slider, index) in sliders" :key="index">
        <img :src="slider.url" />
      </van-swipe-item>
    </van-swipe>
 </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, toRefs } from 'vue'
export default defineComponent({
  name: 'homeSwiper',
  isComponents: true,
  async setup() {
    const state = reactive({
      sliders: [{
        url: require('@/assets/images/banner0.jpg')
      }, {
        url: require('@/assets/images/banner1.jpg')
      }, {
        url: require('@/assets/images/banner2.jpg')
      }]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped lang="less">
.home-swiper-content{
  height: 100%;
  margin-top: 25px;
  padding: 0 20px;
  overflow: hidden;
  .swiper-content{
    height: 350px;
    border-radius: 16px;
    img{
      width: 100% !important;
    }
  }
}
</style>
