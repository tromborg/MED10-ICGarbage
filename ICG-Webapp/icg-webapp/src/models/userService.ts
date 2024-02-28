export type UserBody = {
    userName : string;
    email : string;
    password: string;
    points: number;
}

export class UserService  {
    async RegisterUser(userBody : UserBody){
        try {
            console.log("Creating user");
        } catch (e) {
            console.log("User error: " + e);
        }
    }

}