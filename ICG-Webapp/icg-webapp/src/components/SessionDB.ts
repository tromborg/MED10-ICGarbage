import Dexie from "dexie";

export class SessionDB extends Dexie {
  userSessionDB!: Dexie.Table<IUserSession>;

  constructor () {
      super("SessionDB");
      this.version(1).stores({
          userSessionDB: 'userId, isLoggedIn, loginTimestamp',
      });
  }

  async addUser(newUserId: string, newIsLoggedIn: boolean, timestamp: string) {
    await this.userSessionDB.clear();
    await this.userSessionDB.add({
      userId: newUserId,
      isLoggedIn: newIsLoggedIn,
      loginTimestamp: timestamp
    });
  }

  async getUserFromSessionDb(): Promise<IUserSession>{
    let dbUser = await this.userSessionDB.toArray();
    return dbUser[0];
  }
}

interface IUserSession {
  userId?: string,
  isLoggedIn?: boolean,
  loginTimestamp?: string
}

export const userSessionDb = new SessionDB;