<template>
  <div class="home-container">
    <header>
      <Suspense>
        <template #default>
          <HomeSwiper></HomeSwiper>
        </template>
        <template #fallback>
          <div>...loading</div>
        </template>
      </Suspense>
    </header>
    <section>
      <Suspense>
        <template #default>
          <HomeContent
            :cityList="cityList"
            :accessControlList="accessControlList"
          ></HomeContent>
        </template>
        <template #fallback>
          <div>...loading</div>
        </template>
      </Suspense>
    </section>
  </div>
</template>
 
<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted } from 'vue'
import { Store, useStore } from 'vuex'
import { IGlobalState } from "@/store";
import * as Types from "@/store/modules/Home/types";
import qs from 'qs';

/**
 * 该hook目的：个人理解：
 *  1、类似于全局的公共方法；可以考虑提到工具类函数中
 *  2、cityList， accessControlList 均是只做为展示的数据，没有后续的修改； 所以可考虑提取出来由父组件管理
 *  3、假如该方法内部逻辑比较多，其他页面又需要用到, 所以提取比较合适
 *  4、当然自由取舍， 放到 steup 方法内部实现也没问题， 但不利于其他页面引用获取
 *  5、vuex actions、mutations 函数逻辑应尽可能的少，便于维护； 逻辑处理应在页面内部
 */
function useContentData(store: Store<IGlobalState>) {
  let cityList = computed(() => store.state.home.cityList)
  let accessControlList = computed(() => store.state.home.accessControlList)
  onMounted(async() => {
    if (cityList.value.length === 0) await store.dispatch(`home/${Types.GET_CITY_LIST}`)
    if (accessControlList.value.length === 0) await store.dispatch(`home/${Types.GET_ACCESS_CONTROL_LIST}`, { 
      communityId: 13
    })
  })
  return {
    cityList,
    accessControlList
  }
}

export default defineComponent({
  name: 'home',
  isComponents: true,
  setup() {
    let store = useStore<IGlobalState>()
    let { cityList, accessControlList } = useContentData(store)
    const state = reactive({
      active: 0,
    })
    return {
      ...toRefs(state),
      cityList,
      accessControlList
    }
  }
})
</script>
 
<style scoped lang="less">
.home-container {
  height: 100%;
  background: #f6f6f6;
  header {
    overflow: hidden;
    height: 500px;
    background-size: cover;
    background-position: center 0;
    background-image: url("~@/assets/images/home_page_bg.png");
  }
  section {
    position: relative;
    top: -120px;
    padding: 0 20px;
  }
}
</style>