import { LoginInstance, TimeSeriesInstance, UserOverview, UserRegistry } from "../apicalls";
import { ApiService } from "../services/ApiService";

export type UserBody = {
  userName: string;
  email: string;
  password: string;
  points: number;
};

interface TimeSeriesData {
  userid: string;
  points: number;
  timeStamp: Date;
}

export class UserService {
  async RegisterUser(userBody: UserBody) {
    try {
      let newUser = new UserRegistry({
        userName: userBody.userName,
        email: userBody.email,
        password: userBody.password,
        points: 0,
      });

      const apiRes = await ApiService.client().post_new_user(newUser);
      console.log("resservice: " + apiRes);
    } catch (e) {
      console.log("Userservice: " + e);
    }
  }

  async CheckUserLogin(userBody: UserBody): Promise<LoginInstance> {
    try {
      let loginInfo = new UserRegistry({
        userName: userBody.userName,
        password: userBody.password,
      });
      let res = await ApiService.client().check_login(loginInfo);
      return res;
    } catch (e) {
      console.log("Userservice: " + e);
      return new LoginInstance();
    }
  }

  async GetTimeSeriesData(userid: string): Promise<TimeSeriesInstance[]> {
    try {
      let res = await ApiService.client().get_timeseriesdata(userid);
      console.log("yooyo", JSON.stringify(res));

      return res;
    } catch (e) {
      console.log("Userservice error: " + e);
      return Promise.resolve<TimeSeriesInstance[]>(null as any);
    }
  }

  async GetUserOverview(userid: string): Promise<UserOverview>{
    try {
      let useroverview = await ApiService.client().get_useroverview(userid);
      return useroverview
      
    } catch (e) {
      console.log("Userservice error: " + e);
      return Promise.resolve<UserOverview>(null as any);
    }

  }
}
