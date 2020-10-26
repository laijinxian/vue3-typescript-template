<template>
  <Home v-show="isHome"></Home>
  <Mine v-show="!isHome"></Mine>
  <van-tabbar v-model="active"  @change="onChange">
    <van-tabbar-item icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item icon="contact">我的</van-tabbar-item>
  </van-tabbar>
</template>
 
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
export default defineComponent({
  name: 'index',
  isRouter: true,
  setup() {
    const state = reactive({
      active: 0,
      isHome: true
    })
    const onChange = (index: number) => {
      console.log(index)
      state.isHome = index === 0 ? true : false
    }
    return {
      ...toRefs(state),
      onChange
    }
  }
})
</script>