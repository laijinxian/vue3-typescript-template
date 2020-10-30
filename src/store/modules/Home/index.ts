import { Module } from 'vuex'
import { IGlobalState, IAxiosResponseData } from '../../index'
import * as Types from './types'
import { IHomeState, ICity, IAccessControl, ICommonlyUsedDoor, IcurrentCommunity } from './interface'
import * as API from './api'

const state: IHomeState = {
  cityList: [],
  currentCommunity: {
    communityId: '',
    communityName: ''
  },
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
    async [Types.GET_CITY_LIST]({ commit, rootState }) {
      console.log(rootState.login.userInfo.userId)
      const result = await API.getCityList<IAxiosResponseData>(rootState.login.userInfo.userId)
      if (result.code !== 0) return
      commit(Types.GET_CITY_LIST, result.data)
      commit(Types.SET_CURRENT_COMMUNIRY, result.data[0])
    },
    // 获取小区门禁列表
    async [Types.GET_ACCESS_CONTROL_LIST]({ commit, rootState }) {
      const result = await API.getCityAccessControlList<IAxiosResponseData>({
        userId: rootState.login.userInfo.userId,
        communityId: state.currentCommunity.communityId
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
    [Types.SET_CURRENT_COMMUNIRY](state, currentCommunity: IcurrentCommunity) {
      state.currentCommunity.communityId = currentCommunity.communityId
      state.currentCommunity.communityName = currentCommunity.communityName
    },
     // 设置常用小区
    [Types.SET_COMMONLY_USERDOOR](state, commonlyUsedDoor: ICommonlyUsedDoor) {
      state.commonlyUsedDoor = commonlyUsedDoor
      state.commonlyUsedDoor = commonlyUsedDoor
    }
  }
}

export default home
