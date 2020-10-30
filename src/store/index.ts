import { createStore } from 'vuex'
import { IHomeState } from './modules/Home/interface'
import { IIndexState } from './modules/Login/interface'
import home from './modules/Home'
import login from './modules/Login'

// 全局状态
export interface IGlobalState {
  home: IHomeState,
  login: IIndexState
}

// 后台接口返回参数类
export interface IAxiosResponseData {
  code: number,
  data: any,
  message: string
}

const store = createStore<IGlobalState>({
  mutations: {
  },
  actions: {
  },
  modules: {
    home,
    login
  }
})

export default store
