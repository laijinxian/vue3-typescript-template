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