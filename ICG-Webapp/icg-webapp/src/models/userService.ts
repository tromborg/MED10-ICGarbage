import { UserRegistry } from "../apicalls";
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
        console.log("res: " + apiRes);
        } catch (e) {
            console.log("User error: " + e);
        }
    }

}