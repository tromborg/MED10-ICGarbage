import { LoginInstance, UserRegistry } from "../apicalls";
import { ApiService } from "../services/ApiService";

export type UserBody = {
    userName : string;
    email : string;
    password: string;
    points: number;
}

export class UserService  {
    async RegisterUser(userBody : UserBody){
        try {
            let newUser = new UserRegistry({
                userName: userBody.userName,
                email: userBody.email,
                password: userBody.password,
                points: 0
        });

        const apiRes = await ApiService.client().post_new_user(newUser);
        console.log("resservice: " + apiRes);
        } catch (e) {
            console.log("User error: " + e);
        }
    }

    async CheckUserLogin(userBody : UserBody): Promise<LoginInstance>{
        try {
            let loginInfo = new UserRegistry({
                userName: userBody.userName,
                password: userBody.password,
            });
            let res = await ApiService.client().check_login(loginInfo);
            return res

        } catch (e) {
            console.log("User error: " + e);
            return new LoginInstance
        }
    }
}