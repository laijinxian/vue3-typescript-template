import { Module } from 'vuex'
import { IGlobalState } from '../../index'
import * as Types from './types'
import { IHomeState, ICity, IAccessControl, ICommonlyUsedDoor } from './interface'
import axios from 'axios'

const state: IHomeState = {
  cityList: [],
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
      const result = await axios.post(`auth/v2/getApplyListGroupByCommunityH5?`)
      commit(Types.GET_CITY_LIST, result.data)
    },
    // 获取小区门禁列表
    async [Types.GET_ACCESS_CONTROL_LIST]({ commit }, data) {
      console.log(data)
      const result = await axios.post(`doorcontrol/v2/queryUserDoor?`, data)
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
