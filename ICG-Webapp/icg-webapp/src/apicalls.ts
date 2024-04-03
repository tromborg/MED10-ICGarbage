export interface IWebICGAPIClient {
  /**
   * @param userform create user info
   * @return OK
   */
  post_new_user(user: UserRegistry): Promise<UserRegistry>;
}

export class WebICGApiClient implements IWebICGAPIClient {
  private http: {
    fetch(url: RequestInfo, init?: RequestInit): Promise<Response>;
  };
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined =
    undefined;

  constructor(
    baseUrl?: string,
    http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }
  ) {
    this.http = http ? http : (window as any);
    this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "/api";
  }

  post_new_user(userbody: UserRegistry): Promise<UserRegistry> {
    let url_ = this.baseUrl + "/registeruser";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(userbody);
    console.log("userbody: " + JSON.stringify(userbody));
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processPost_new_user(_response);
    });
  }

  protected processPost_new_user(response: Response): Promise<UserRegistry> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 201) {
      return response.text().then((_responseText) => {
        let result201: any = null;
        let resultData201 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result201 = UserRegistry.fromJS(resultData201);
        console.log("result201: " + result201);
        return result201;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<UserRegistry>(null as any);
  }

  /**
   * @param id
   * @return OK
   */
  async check_login(userBody: UserRegistry): Promise<LoginInstance> {
    let url_ = this.baseUrl + "/checklogin";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify(userBody);
    console.log("sending: " + content_);
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processCheck_login(_response);
    });
  }

  protected processCheck_login(response: Response): Promise<LoginInstance> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        //result201 = UserRegistry.fromJS(resultData201);
        console.log("result201: " + result200);
        return resultData200;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<LoginInstance>(null as any);
  }

  get_user(id: string): Promise<UserRegistry> {
    let url_ = this.baseUrl + "getuser/{id}";
    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    url_ = url_.replace(/[?&]$/, "");
    if (id === undefined || id === null) {
      throw new Error("The parameter 'id' must be defined.");
    }

    url_ = url_.replace("{id}", encodeURIComponent("" + id));
    let options_: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGet_user(_response);
    });
  }
  protected processGet_user(response: Response): Promise<UserRegistry> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        result200 = UserRegistry.fromJS(resultData200);
        return result200;
      });
    } else if (status === 400) {
      return response.text().then((_responseText) => {
        return throwException("Not found", status, _responseText, _headers);
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<UserRegistry>(null as any);
  }
  get_scoreboard(): Promise<UserRegistry[]> {
    let url_ = this.baseUrl + "/getscoreboardinfo";
    url_ = url_.replace(/[?&]$/, "");

    let options_: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGet_scoreboard(_response);
    });
  }
  protected processGet_scoreboard(response: Response): Promise<UserRegistry[]> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        const userList: UserRegistry[] = [];
        for (const jsonObj of resultData200) {
          const username = jsonObj.user;
          const points = jsonObj.points;
          const userid = jsonObj.userid;
          let data = { userName: username, userid: userid, points: points };
          const user = UserRegistry.fromJS(data);
          userList.push(user);
        }

        return userList;
      });
    } else if (status === 400) {
      return response.text().then((_responseText) => {
        return throwException("Not found", status, _responseText, _headers);
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<UserRegistry[]>(null as any);
  }

  get_timeseriesdata(userid: string): Promise<TimeSeriesInstance[]> {
    let url_ = this.baseUrl + "/gettimeseriesdata";
    url_ = url_.replace(/[?&]$/, "");
    let body = `{"userid": "${userid}"}`; 
    const content_ = JSON.stringify(JSON.parse(body));
    console.log("_content: " + content_);
    let options_: RequestInit = {
      method: "POST",
      body: content_,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGet_timeseriesdata(_response);
    });
  }

  protected processGet_timeseriesdata(response: Response): Promise<TimeSeriesInstance[]> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    console.log("Status: " + status);
    if (status === 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        console.log("statusdata: " + _responseText);
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        const timeData: TimeSeriesInstance[] = [];
        for (const jsonObj of resultData200) {
          const userid = jsonObj.userid;
          const points = jsonObj.points;
          const timeStamp = jsonObj.timeStamp;
          const currentPoints = jsonObj.currentPoints;
          let data = { userid: userid, points: points, timeStamp: timeStamp, currentPoints: currentPoints };
          console.log("restype: " + data);
          console.log("resres: " + JSON.stringify(data))
          const user = TimeSeriesInstance.fromJS(data);
          timeData.push(user);
        }

        return timeData;
      });
    } else if (status === 400) {
      return response.text().then((_responseText) => {
        return throwException("Not found", status, _responseText, _headers);
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error occurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<TimeSeriesInstance[]>(null as any);
  }


  async get_useroverview(userid: string): Promise<UserOverview> {
    let url_ = this.baseUrl + "/getuser";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify({userid: userid});
    console.log("sending: " + content_);
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGet_useroverview(_response);
    });
  }

  protected processGet_useroverview(response: Response): Promise<UserOverview> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        console.log("result201: " + resultData200);
        const useroverview = UserOverview.fromJS(resultData200);
        return useroverview;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<UserOverview>(null as any);
  }

  async update_points(userid: string, points: number, isSubtract: boolean) {
    let url_ = this.baseUrl + "/updatepoints";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify({userid: userid, points: points, isSubtract: isSubtract});
    console.log("sending: " + content_);
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processUpdate_points(_response);
    });
  }

  protected processUpdate_points(response: Response) {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : _responseText
        console.log("result201: " + resultData200);
        return resultData200;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve(null as any);
  }

  async register_purchase(userid: string, couponid: number) {
    let url_ = this.baseUrl + "/createpurchase";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify({userid: userid, coupon_id: couponid});
    console.log("sending: " + content_);
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processRegister_purchase(_response);
    });
  }

  protected processRegister_purchase(response: Response) {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : _responseText
        console.log("result201: " + resultData200);
        return resultData200;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve(null as any);
  }

  async get_purchases(userid: string): Promise<Coupon[]> {
    let url_ = this.baseUrl + "/getpurchases";
    url_ = url_.replace(/[?&]$/, "");

    const content_ = JSON.stringify({userid: userid});
    console.log("sending: " + content_);
    let options_: RequestInit = {
      body: content_,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return this.http.fetch(url_, options_).then((_response: Response) => {
      return this.processGet_purchases(_response);
    });
  }

  protected processGet_purchases(response: Response): Promise<Coupon[]> {
    const status = response.status;
    let _headers: any = {};
    if (response.headers && response.headers.forEach) {
      response.headers.forEach(
        (value: any, key: any) => (_headers[key] = value)
      );
    }
    if (status == 200) {
      return response.text().then((_responseText) => {
        let result200: any = null;
        let resultData200 =
          _responseText === ""
            ? null
            : JSON.parse(_responseText, this.jsonParseReviver);
        const coupons: Coupon[] = [];
        for (const jsonObj of resultData200) {
          const userid = jsonObj.userid;
          const couponid = jsonObj.couponid;
          let data = { userid: userid, couponid: couponid };
          console.log("restype: " + data);
          console.log("resres: " + JSON.stringify(data))
          const coupon = Coupon.fromJS(resultData200);
          coupons.push(coupon);
        }
        console.log("result201: " + resultData200);
        return coupons;
      });
    } else if (status !== 200 && status !== 204) {
      return response.text().then((_responseText) => {
        return throwException(
          "An unexpected server error ocurred.",
          status,
          _responseText,
          _headers
        );
      });
    }
    return Promise.resolve<Coupon[]>(null as any);
  }
}

export class Coupon implements ICoupon {
  userid?: string | undefined;
  couponid?: number;

  constructor(data?: ICoupon) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"];
      this.couponid = _data["couponid"];
    }
  }

  static fromJS(data: any): Coupon {
    data = typeof data === "object" ? data : {};
    let result = new Coupon();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    data["couponid"] = this.couponid;
    return data;
  }
}

export interface ICoupon {
  userid?: string;
  couponid?: number;
}

export interface IUpdatePointsInstance {
  userid?: string;
  points?: number;
  isSubtract?: boolean
}

export class UpdatePointsInstance implements IUpdatePointsInstance {
  userid?: string | undefined;
  points?: number | undefined;
  isSubtract?: boolean | undefined;

  constructor(data?: IUpdatePointsInstance) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"];
      this.points = _data["points"];
      this.isSubtract = _data["isSubtract"];
    }
  }

  static fromJS(data: any): UpdatePointsInstance {
    data = typeof data === "object" ? data : {};
    let result = new UpdatePointsInstance();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    data["points"] = this.points;
    data["isSubtract"] = this.isSubtract;
    return data;
  }
}

export interface IUserOverview {
  userid?: string;
  username?: string;
  email?: string;
  signupdate?: string;
  points?: number;
  total_points?: number;
}

export class UserOverview implements IUserOverview {
  userid?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  signupdate?: string | undefined;
  points?: number | undefined;
  total_points: number | undefined;

  constructor(data?: IUserOverview) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"];
      this.username = _data["username"];
      this.email = _data["email"];
      this.signupdate = _data["signupdate"];
      this.points = _data["points"];
      this.total_points = _data["total_points"]
    }
  }

  static fromJS(data: any): UserOverview {
    data = typeof data === "object" ? data : {};
    let result = new UserOverview();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    data["username"] = this.username;
    data["email"] = this.email;
    data["signupdate"] = this.signupdate;
    data["points"] = this.points;
    data["total_points"] = this.total_points;
    return data;
  }
}

export interface ITimeSeriesInstance {
  userid?: string;
  points?: number;
  timeStamp?: Date;
  currentPoints?: number
}

export class TimeSeriesInstance implements ITimeSeriesInstance {
  userid?: string | undefined;
  points?: number | undefined;
  timeStamp?: Date | undefined;
  currentPoints?: number | undefined;

  constructor(data?: IUserRegistry) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"];
      this.points = _data["points"];
      this.timeStamp = _data["timeStamp"];
      this.currentPoints = _data["currentPoints"]
    }
  }

  static fromJS(data: any): TimeSeriesInstance {
    data = typeof data === "object" ? data : {};
    let result = new TimeSeriesInstance();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    data["points"] = this.points;
    data["timeStamp"] = this.timeStamp;
    data["currentPoints"] = this.currentPoints;
    return data;
  }
}

export class LoginInstance implements ILoginInstance {
  userid?: string | undefined;
  isLoggedIn?: boolean | undefined;

  constructor(data?: IUserRegistry) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"];
      this.isLoggedIn = _data["isLoggedIn"];
    }
  }

  static fromJS(data: any): LoginInstance {
    data = typeof data === "object" ? data : {};
    let result = new LoginInstance();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    return data;
  }
}

export interface ILoginInstance {
  userid?: string;
  isLoggedIn?: boolean;
}

export class UserRegistry implements IUserRegistry {
  userid?: string;
  userName?: string;
  email?: string;
  password?: string;
  points?: number;

  constructor(data?: IUserRegistry) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property)) {
          (<any>this)[property] = (<any>data)[property];
        }
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userid = _data["userid"]
      this.userName = _data["userName"];
      this.email = _data["email"];
      this.password = _data["password"];
      this.points = _data["points"];
    }
  }

  static fromJS(data: any): UserRegistry {
    data = typeof data === "object" ? data : {};
    let result = new UserRegistry();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === "object" ? data : {};
    data["userid"] = this.userid;
    data["userName"] = this.userName;
    data["email"] = this.email;
    data["password"] = this.password;
    data["point"] = this.password;
    return data;
  }
}

export interface IUserRegistry {
  userid?: string;
  userName?: string;
  email?: string;
  password?: string;
  points?: number;
}

export class ApiException extends Error {
  message: string;
  status: number;
  response: string;
  headers: { [key: string]: any };
  result: any;

  constructor(
    message: string,
    status: number,
    response: string,
    headers: { [key: string]: any },
    result: any
  ) {
    super();
    this.message = message;
    this.status = status;
    this.response = response;
    this.headers = headers;
    this.result = result;
  }

  protected isApiException = true;

  static isApiException(obj: any): obj is ApiException {
    return obj.isApiException === true;
  }
}

function throwException(
  message: string,
  status: number,
  response: string,
  headers: { [key: string]: any },
  result?: any
): any {
  if (result !== null && result !== undefined) {
    throw result;
  } else {
    throw new ApiException(message, status, response, headers, null);
  }
}
