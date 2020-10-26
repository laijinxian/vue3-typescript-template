export interface IIndexState {
    phone: string,
    sms: string,
    userInfo: IUserInfo
  }
  
  export interface IUserInfo {
    communitylist: ICommunity[],
    sessionId: string,
  }
  
  export interface ICommunity {
    cityName: string,
    cityCode: string
  }
  