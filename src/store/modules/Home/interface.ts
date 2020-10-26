
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
  commonlyUsedDoor: ICommonlyUsedDoor,
  accessControlList: IAccessControl[]
}

export interface ICommonlyUsedDoor{
  doorControlId: string,
  doorControlName: string
}