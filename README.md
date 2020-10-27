原文： [本人github文章](https://github.com/laijinxian/vue3-typescript-template)

关注公众号： 微信搜索 `web全栈进阶` ; 收货更多的干货

## 一、开篇
- `vue3.0beta`版正式上线，作为新技术热爱者，新项目将正式使用`vue3.0`开发； 接下来总结（对自己技术掌握的稳固）介绍（分享有需要的猿友）
- 上篇博客介绍了`vue3.0`常用语法及开发技巧；有需要的请点击 [Vue3.0 进阶、环境搭建、相关API的使用](https://juejin.im/post/6877832502590111757)
- 觉得对您有用的 `github` 点个 `star` 呗
- 项目`github`地址：`https://github.com/laijinxian/vue3-typescript-template`

##  二、项目介绍（移动端）
- 1）技术栈： `vue3 + vuex + typescript + webpack + vant-ui + axios + less + postcss-pxtorem(rem适配)`
- 2）没用官方构建工具`vite`原因：`vite` 坑还真的不少，有时候正常写法`webpack`没问题， 在`vite`上就报错；一脸懵逼的那种， `vite` 的`github` 提 Issues 都没用， 维护人员随便回答了下就把我的 `Issues` 给关了，我也是醉了；
- 3）不过自己还是很期待 `vite` 的， 等待他成熟吧， 在正式使用；
- 4）涉及点：目前只贴出项目初期的几个功能
  - `webpack require` 自动化注册路由、自动化注册异步组价
  - `axios` 请求封装（请求拦截、响应拦截、取消请求、统一处理）
  - `vuex` 业务模块化、 接管请求统一处理

## 三、项目搭建
可参考上篇文章 [Vue3.0 进阶、环境搭建、相关API的使用](https://juejin.im/post/6877832502590111757)
1. `vue-cli、vue` 下载最新版本
2. 执行命令 `vue create my_app_name`
3. 执行完上面命令接下来选择手动配置（第三个），不要选择默认配置，有很多我们用不上，我的选择如下图：
![](https://imgkr2.cn-bj.ufileos.com/91d77467-7586-4f24-9294-77b855526912.jpg?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=8KAtViJ7xnImPg5hBcIDKPhoR4Q%253D&Expires=1603876892)

## 三、项目主要功能
**1. `webpack require` 自动化注册路由、自动化注册异步组价**
```
// 该文件在 utils 下的 global.ts
// 区分文件是否自动注册为组件，vue文件定义 isComponents 字段； 区分是否自动注册为路由定义 isRouter 字段
// 使用方式分别在 main.ts 里方法asyncComponent() 以及路由文件router下的index.ts 方法 vueRouters()

import { defineAsyncComponent } from 'vue'
import { app } from '../main'

// 获取所有vue文件
function getComponent() {
  return require.context('../views', true, /\.vue$/);
}

// 首字母转换大写
function letterToUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 首字母转换小写
function letterToLowerCase(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export const asyncComponent = function () {

  // 获取文件全局对象
  const requireComponents = getComponent();

  requireComponents.keys().forEach((fileSrc: string) => {

    const viewSrc = requireComponents(fileSrc);

    const fileNameSrc = fileSrc.replace(/^\.\//, '')

    const file = viewSrc.default;

    if (viewSrc.default.isComponents) {
      
      // 异步注册组件
      let componentRoot = defineAsyncComponent(
        () => import(`@/views/${fileNameSrc}`)
      )
      
      app.component(letterToUpperCase(file.name), componentRoot)
    }
    
  });
};

// 获取路由文件
export const vueRouters = function () {

  const routerList: any = [];

  const requireRouters = getComponent();

  requireRouters.keys().forEach((fileSrc: string) => {

    // 获取 components 文件下的文件名
    const viewSrc = requireRouters(fileSrc);
    const file = viewSrc.default;

    // 首字母转大写
    const routerName = letterToUpperCase(file.name);

    // 首字母转小写
    const routerPath = letterToLowerCase(file.name);

    // 设置路由路径
    const fileNameSrc = fileSrc.replace(/^\.\//, '');

    if (file.isRouter) {
      routerList.push({
        path: `/${routerPath}`,
        name: `${routerName}`,
        component: () => import(`@/views/${fileNameSrc}`)
      });
    }
  });
  return routerList;
};
```
**2. `axios` 请求封装（请求拦截、响应拦截、取消请求、统一处理）**
```
import axios, { AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
import router from '@/router'
import { Toast } from 'vant'

if (process.env.NODE_ENV === 'development') {
  // 开发环境
  axios.defaults.baseURL = `https://test-mobileapi.qinlinkeji.com/api/`
} else {
  // 正式环境
  axios.defaults.baseURL = `正式环境地址`
}

let sourceAjaxList: Canceler[] = []

export const axionInit = () => {
  axios.interceptors.request.use((config: AxiosRequestConfig) => {
    // 设置 cancel token  用于取消请求 (当一个接口出现401后，取消后续多有发起的请求，避免出现好几个错误提示)
    config.cancelToken = new axios.CancelToken(function executor(cancel: Canceler): void {
      sourceAjaxList.push(cancel)
    })

    // 存在 sessionId 为所有请求加上 sessionId
    if (localStorage.getItem(`h5_sessionId`) && config.url!.indexOf('/user/login') < 0) config.url += ('sessionId=' + localStorage.getItem(`h5_sessionId`))
    if (!config.data) config.data = {}
    return config
  }, function (error) {
    // 抛出错误
    return Promise.reject(error)
  })

  axios.interceptors.response.use((response: AxiosResponse) => {
    const { status, data } = response
    if (status === 200) {
      // 如果不出现错误，直接向回调函数内输出 data
      if (data.code === 0) {
        return data
      } else if (data.code === 401) {
        // 出现未登录或登录失效取消后面的请求
        sourceAjaxList.length && sourceAjaxList.length > 0 && sourceAjaxList.forEach((ajaxCancel, index) => {
          ajaxCancel() // 取消请求
          delete sourceAjaxList[index]
        })
        Toast({
          message: data.message,
          duration: 2000
        })
        return router.push('/login')
      } else {
        return data
      }
    } else {
      return data
    }
  }, error => {
    const { response } = error
    // 这里处理错误的 http code or 服务器或后台报错
    if (!response || response.status === 404 || response.status === 500) {
      if (!response) {
        console.error(`404 error %o ${error}`)
      } else {
        if (response.data && response.data.message) {
          Toast.fail({
            message: '请求异常，请稍后再试!',
            duration: 2000
          })
        }
      }
    }
    return Promise.reject(error.message)
  })
}
```
**3. `vuex` 业务模块化、 接管请求统一处理**
```
// 具体请看项目store目录
import { Module } from 'vuex'
import { IGlobalState, IAxiosResponseData } from '../../index'
import * as Types from './types'
import { IHomeState, ICity, IAccessControl, ICommonlyUsedDoor, AGetCtiy } from './interface'
import qs from 'qs';
import * as API from './api'

const state: IHomeState = {
  cityList: [],
  communityId: 13,
  commonlyUsedDoor: {
    doorControlId: '',
    doorControlName: ''
  },
  accessControlList: []
}

const home: Module<IHomeState, IGlobalState> = {
  namespaced: true,
  state,
  actions: {
    // 获取小区列表
    async [Types.GET_CITY_LIST]({ commit }) {
      const result = await API.getCityList<IAxiosResponseData>()
      if (result.code !== 0) return
      commit(Types.GET_CITY_LIST, result.data)
    },
    // 获取小区门禁列表
    async [Types.GET_ACCESS_CONTROL_LIST]({ commit }) {
      const result = await API.getCityAccessControlList<IAxiosResponseData>({
        communityId: state.communityId
      })
      if (result.code !== 0) return
      commit(Types.GET_ACCESS_CONTROL_LIST, result.data.userDoorDTOS)
      commit(Types.SET_COMMONLY_USERDOOR, result.data.commonlyUsedDoor)
    },
  },
  mutations: {
    // 设置小区列表
    [Types.GET_CITY_LIST](state, cityList: ICity[]) {
      if (cityList.length !== 0) state.cityList = cityList
    },
    // 设置小区门禁列表
    [Types.GET_ACCESS_CONTROL_LIST](state, accessControlList: IAccessControl[]) {
      if (accessControlList.length !== 0) return state.accessControlList = accessControlList
    },
    // 设置当前小区
    [Types.SET_COMMONLY_USERDOOR](state, commonlyUsedDoor: ICommonlyUsedDoor) {
      state.commonlyUsedDoor = commonlyUsedDoor
    }
  }
}
export default home
```
**4. `home` 文件代码**
```
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
  onMounted(() => {
    if (cityList.value.length === 0) store.dispatch(`home/${Types.GET_CITY_LIST}`)
    if (accessControlList.value.length === 0) store.dispatch(`home/${Types.GET_ACCESS_CONTROL_LIST}`, { 
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
```
**5. `login` 文件代码**
```
<template>
  <div class="login-container">
    <p>手机号登录</p>
    <van-cell-group>
      <van-field
        v-model="phone"
        required
        clearable
        maxlength="11"
        label="手机号"
        placeholder="请输入手机号" />
      <van-field
        v-model="sms"
        center
        required
        clearable
        maxlength="6"
        label="短信验证码"
        placeholder="请输入短信验证码">
        <template #button>
          <van-button
            size="small"
            plain
            @click="getSmsCode">{{isSend ? `${second} s` : '发送验证码'}}</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <div class="login-button">
      <van-button
        :loading="isLoading"
        size="large"
        @click="onLogin"
        loading-text="正在登录..."
        type="primary">登录</van-button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue'
  import { useStore } from "vuex";
  import { IGlobalState } from "@/store";
  import * as Types from "@/store/modules/Login/types";
  import { Toast } from 'vant'
  import router from '@/router'
  export default defineComponent({
    name: 'login',
    isRouter: true,
    setup(props, ctx) {
      let store = useStore <IGlobalState> ()
      const state = reactive({
        sms: '',
        phone: '',
        second: 60,
        isSend: false,
        isLoading: false
      })
      const phoneRegEx = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
      // 获取验证码
      const getSmsCode = async () => {
        localStorage.removeItem('h5_sessionId')
        store.commit(`login/${Types.SAVE_PHONE}`, state.phone)
        if (!phoneRegEx.test(state.phone)) return Toast({
          message: '手机号输入有误！',
          duration: 2000
        })
        store.dispatch(`login/${Types.GET_SMS_CODE}`, state.phone).then(res => {
          if (res.code !== 0) return
          Toast({
            message: '验证码已发送至您手机， 请查收',
            duration: 2000
          })
          state.isSend = true
          const timer = setInterval(() => {
            state.second--;
            if (state.second <= 0) {
              state.isSend = false
              clearInterval(timer);
            }
          }, 1000);
        })
      }
      // 登录
      const onLogin = () => {
        state.isLoading = true
        store.commit(`login/${Types.SAVE_SMS_CODE}`, state.sms)
        store.dispatch(`login/${Types.ON_LOGIN}`).then(res => {
          state.isLoading = false
          if (res.code !== 0) return
          localStorage.setItem('h5_sessionId', res.data.sessionId)
          store.commit(`login/${Types.SAVE_USER_INFO}`, res.data)
          router.push('/index')
        })
      }
      return {
        ...toRefs(state),
        onLogin,
        getSmsCode
      }
    }
  })
</script>

<style lang="less" scoped>
  .login-container {
    padding: 0 20px;
    >p {
      padding: 50px 20px 40px;
      font-size: 40px;
    }
    .login-button {
      margin-top: 50px;
    }
  }
</style>
```
## 四、项目ui
![](https://imgkr2.cn-bj.ufileos.com/9e203646-e937-4fc6-8602-6f07b28675f1.jpg?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=hOlNR%252FrpzGeXFqIIQS%252FybcPqvjc%253D&Expires=1603791394)
![](https://imgkr2.cn-bj.ufileos.com/6c90779e-486c-417c-a6ac-31dffae87019.jpg?UCloudPublicKey=TOKEN_8d8b72be-579a-4e83-bfd0-5f6ce1546f13&Signature=zW8rYy5udR5Z9V5l1aoa58j77zU%253D&Expires=1603791397)

## 五、结语
以上为个人实际项目开发总结， 有不对之处欢迎留言指正

