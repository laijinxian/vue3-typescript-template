
/**
 * @ 页面常用类开头 I 
 * @ 接口参数类开头 A
 */

export interface ICity {
  cityName: string,
  cityId: string,
  communityId: string,
  communityName: string,
  provinceName: string,
  districtName: string
}

export interface IAccessControl {
  doorControlId: string,
  doorControlName: string
}

export interface IHomeState {
  cityList: ICity[],
  communityId: string | number,
  commonlyUsedDoor: ICommonlyUsedDoor,
  accessControlList: IAccessControl[]
}

export interface ICommonlyUsedDoor{
  doorControlId: string,
  doorControlName: string
}

export interface AGetCtiy{
  communityId: string | number
}