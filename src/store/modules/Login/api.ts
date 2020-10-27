
import axios from 'axios'

// 获取手机验证码
export const getSmsCode = <T>(phone: string) => axios.post<T, T>(`ccb/sendSms?phone=${phone}&resource=1`)

// 登录
export const onLogin = <T>(phone: string, sms: string) => axios.post<T, T>(`ccb/register?phone=${phone}&smsCode=${sms}`)