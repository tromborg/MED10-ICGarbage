import { stat } from "fs";
import { url } from "inspector";

export interface IWebICGAPIClient {

    /**
     * @param userform create user info
     * @return OK
     */
    post_new_user(user : UserRegistry): Promise<UserRegistry>;
}

export class WebICGApiClient implements IWebICGAPIClient {
    private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(baseUrl?: string, http?: {fetch(url: RequestInfo, init? : RequestInit): Promise<Response> }){
        this.http = http ? http : window as any;
        this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "/api";
    }

    post_new_user(userbody : UserRegistry): Promise<UserRegistry> {
        let url_ = this.baseUrl + "registeruser";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(userbody);

        let options_ : RequestInit = {
            body: content_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }

        return this.http.fetch(url_, options_).then((_response : Response) => {
            return this.processPost_new_user(_response);
        })
    }

    protected processPost_new_user(response : Response): Promise<UserRegistry> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((value: any, key: any) => _headers[key] = value); };
        if (status == 200) {
            return response.text().then((_responseText) => {
                let result201: any = null;
                let resultData201 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result201 = UserRegistry.fromJS(resultData201);
                return result201
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error ocurred.", status, _responseText, _headers);
            })
        }
        return Promise.resolve<UserRegistry>(null as any);
    }

    /**
     * @param id
     * @return OK 
     */
    get_user(id: string): Promise<UserRegistry> {
        let url_ = this.baseUrl + "getuser/{id}";
        if (id === undefined || id === null){
            throw new Error("The parameter 'id' must be defined.");
        }
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_: RequestInit = {
            method : "GET",
            headers: {
                "Accept": "application/json"
            }
        };

        return this.http.fetch(url_, options_).then((_response: Response) => {
            return this.processGet_user(_response);
        })
    }

    protected processGet_user(response: Response): Promise<UserRegistry> {
        const status = response.status;
        let _headers: any = {}; if (response.headers && response.headers.forEach) { response.headers.forEach((value: any, key: any) => _headers[key] = value); };
        if (status === 200){
            return response.text().then((_responseText) => {
                let result200: any = null;
                let resultData200 = _responseText === "" ? null : JSON.parse(_responseText, this.jsonParseReviver);
                result200 = UserRegistry.fromJS(resultData200);
                return result200;
            })
        } else if (status === 400) {
            return response.text().then((_responseText) => {
                return throwException("Not found", status, _responseText, _headers);
            });
        } else if (status !== 200 && status !== 204) {
            return response.text().then((_responseText) => {
                return throwException("An unexpected server error occurred.", status, _responseText, _headers);
            });
        }
        return Promise.resolve<UserRegistry>(null as any);
    }
}


export class UserRegistry implements IUserRegistry {
    userName? : string;
    email? : string;
    password?: string;
    points?: number;

    constructor(data?: IUserRegistry){
        if (data){
            for (var property in data){
                if(data.hasOwnProperty(property)){
                    (<any>this)[property] = (<any>data)[property];
                }
            }
        }
    }

    init(_data?: any){
        if(_data) {
            this.userName = _data['userName'];
            this.email = _data['email'];
            this.password = _data['password'];
            this.points = _data['points'];
        }
    }

    static fromJS(data:any): UserRegistry {
        data = typeof data === 'object' ? data : {};
        let result = new UserRegistry();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data['userName'] = this.userName;
        data['email'] = this.email;
        data['password'] = this.password;
        data['point'] = this.password;
        return data;
    }
}

export interface IUserRegistry {
    userName? : string;
    email? : string;
    password?: string;
    points?: number;
}

export class ApiException extends Error {
    message: string;
    status: number;
    response: string;
    headers: {[key: string]: any;};
    result: any;

    constructor(message: string, status: number, response: string, headers: {[key: string]:any;}, result: any){
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

function throwException (message: string, status: number, response : string, headers: { [key: string]: any; }, result?: any): any {
    if (result !== null && result !== undefined){
        throw result;
    } else {
        throw new ApiException(message, status, response, headers, null);
    }
}






