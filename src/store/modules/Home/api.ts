
import axios from 'axios'
import qs from 'qs'
import { AGetCtiy } from './interface'

// 获取小区列表
export const getCityList = <T>() => axios.post<T, T>(`auth/v2/getApplyListGroupByCommunityH5?`)

// 获取小区门禁列表
export const getCityAccessControlList = <T>(data: AGetCtiy) => axios.post<T, T>(`doorcontrol/v2/queryUserDoor?`, qs.stringify(data))