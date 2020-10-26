import { Module } from 'vuex'
import { IGlobalState } from '../../index'
import { IIndexState, IUserInfo } from './interface'
import axios from 'axios'
import * as Types from "./types";

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
      return axios.post(`ccb/sendSms?phone=${state.phone}&resource=1`)
    },
    async [Types.ON_LOGIN]({ commit, state }) {
      return axios.post(`ccb/register?phone=${state.phone}&smsCode=${state.sms}`)
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
      console.log(info)
    }
  }
}

export default login
