import { Module } from 'vuex'
import { IGlobalState, IAxiosResponseData } from '../../index'
import { IIndexState, IUserInfo } from './interface'
import * as Types from "./types"
import * as API from './api'

const state: IIndexState = {
  phone: '',
  sms: '',
  userInfo: {
    communitylist: [],
    sessionId: 'string',
  }
}

const login: Module<IIndexState, IGlobalState> = {
  namespaced: true,
  state,
  actions: {
    async [Types.GET_SMS_CODE]({ state }) {
      return API.getSmsCode<IAxiosResponseData>(state.phone)
    },
    async [Types.ON_LOGIN]({ state }) {
      return API.onLogin<IAxiosResponseData>(state.phone, state.sms)
    }
  },
  mutations: {
    [Types.SAVE_PHONE](state, phone: string) {
      state.phone = phone
    },
    [Types.SAVE_SMS_CODE](state, sms: string) {
      state.sms = sms
    },
    [Types.SAVE_USER_INFO](state, info: IUserInfo) {
      state.userInfo = info
    }
  }
}

export default login
