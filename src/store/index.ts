import { createStore } from 'vuex'
import { IHomeState } from './modules/Home/interface'
import { IIndexState } from './modules/Login/interface'
import home from './modules/Home'
import login from './modules/Login'

// 全局状态
export interface IGlobalState {
  home: IHomeState,
  Login: IIndexState
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
