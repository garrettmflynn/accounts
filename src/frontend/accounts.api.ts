import * as Realm from "realm-web";
import { UserObj } from "../common/models/user.model";
import { AccountInfoType, RealmUser } from "./general.types";
import { Api, ApiType } from "./_abstract.api";

//  ---------------------------------------- Accounts API ----------------------------------------
export class AccountsAPI {
  app: Realm.App;
  api: ApiType;
  user: UserObj | null = null;

  constructor(appName: string, options: { serverURI: string } = {serverURI: 'http://localhost:4000'}) {
    this.app = new Realm.App(appName); // Initialize your application (MongoDB Realm)
    this.api = Api<UserObj>('user', options.serverURI);

    // Handle Authorization Redirect for Realm
    const handleAuthRedirect = () => Realm.handleAuthRedirect();
    if (window.location.href.includes("_baas_client_app_id")) handleAuthRedirect(); // Authenticates on the other tab and closes this one

  }

//  ---------------------------------------- Realm Wrapper Methods ----------------------------------------


  create = async (auth: AccountInfoType) => {
    if (auth.password) await this.app.emailPasswordAuth.registerUser(auth);
    else console.error("Account password not specified.");
  };

  reconfirm = async (auth: AccountInfoType) =>
    await this.app.emailPasswordAuth.resendConfirmationEmail(auth.email);

  getGoogleCredentials = async () => {
    return Realm.Credentials.google({ redirectUrl: location.origin });
  };

  getCredentials = (auth: { email: string; password: string }) => {
    return new Promise<Realm.Credentials>((resolve) =>
      resolve(Realm.Credentials.emailPassword(auth.email, auth.password))
    );
  };

  login = async (creds?: Realm.Credentials) => {
    let { currentUser } = this.app;
    let type: "LOG_IN" | "REFRESH" = "LOG_IN";

    let uncaughtError = {
      type: "FAIL" as const,
      data: { err: undefined, type: "UNCAUGHT" },
    };

    // If email & pass is specified to function use credentials
    if (creds) {
      // If no user is currently logged in
      if (!currentUser) {
        try {
          const user = await this.app.logIn(creds);

          if (user) {
            await user.refreshAccessToken();
            currentUser = user;
          }
        } catch (err) {
          return {
            type: "FAIL" as const,
            data: { err, type: "LOGIN" },
          };
        }
      } else return uncaughtError; // Return error since a user is already logged in

      // if currentUser exists & no login credentials are passed
    } else if (currentUser) {
      try {
        await currentUser.refreshAccessToken();
        type = "REFRESH";
      } catch (err) {
        return {
          type: "FAIL" as const,
          data: { err, type: "REFRESH" },
        };
      }
    }

    if (currentUser instanceof Realm.User) {
      const o = await this.getUser(currentUser as any)
      if (o.data) {
        this.user = o.data;
        return { type, data: o.data };
      } else {
        if (o.type === "ERROR") return o;
        else return uncaughtError;
      }
    } else return uncaughtError;
  };

  logout = async () => {
    if (!this.app.currentUser)
      return {
        type: "FAIL" as const,
        data: { err: new Error("No User Logged In") },
      };

    try {
      await this.app.currentUser.logOut();
      this.user = null;
      return { type: "LOGOUT" as const };
    } catch (err) {
      console.log(err);
      return {
        type: "FAIL" as const,
        data: { err: new Error("Failed to logout") },
      };
    }
  };

  confirmFromURL = async () => {
    const parsedUrl = new URL(window.location.href);
    let token = parsedUrl.searchParams.get("token");
    let tokenId = parsedUrl.searchParams.get("tokenId");

    if (token && tokenId)
      this.app.emailPasswordAuth.confirmUser(token, tokenId);
    else console.error("Token information not provided.");
  };

  resetPassword = async (auth: AccountInfoType) => await this.app.emailPasswordAuth.sendResetPasswordEmail(auth.email).then(res => res).catch((e) => e)

  // From Auth.ts
  confirmUserFromURL = async (url: URL = new URL(window.location.href)) => {
    const token = url.searchParams.get("token");
    const tokenId = url.searchParams.get("tokenId");

    if (token && tokenId) {
      try {
        await this.app.emailPasswordAuth.confirmUser(token, tokenId);
        return true; // confirmation email sent
      } catch (e) {
        console.log("Couldn't send confirmation email", e);
        return false;
      }
    } else return false;
  };

  completePasswordReset = async (password: string) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenId = params.get("tokenId");

    if (!token || !tokenId)
      throw new Error(
        "You can only call resetPassword() if " +
          "the user followed a confirmation email link"
      );

      return await this.app.emailPasswordAuth.resetPassword(token, tokenId, password).then(res => res).catch((e) => e)
  };

  //  ---------------------------------------- Original API Methods ----------------------------------------

  delete = () => {
    return new Promise(async (resolve, reject) => {
      if (this.app.currentUser) {
        await this.api
          .delete(this.app.currentUser.id)
          .then(() => {
            this.logout().then(resolve).catch(reject);
          })
          .catch(reject);
      } else reject("User not logged in.");
    });
  };


  updateCustomUserData = async (update: object) => {
    if (this.app.currentUser && this.user) {
      let customUserData = JSON.parse(JSON.stringify(this.user.customUserData))
      for (let key in update) customUserData[key] = update
      await this.updateUser(customUserData)
    }
  };

  // Keep client user concurrent with server
  set = async (key: string, val:any) => {
    await this.updateUser({[key]: val})
  }

  updateUser = (update:Partial<UserObj>) => {
    return new Promise(async (resolve, reject) => {
      if (this.app.currentUser && this.user) {
        await this.api
          .patch(this.app.currentUser.id, update)
          .then((res:any) => {
            this.user = res.data
            resolve(res.data)
          })
          .catch(reject);
      } else reject("User not logged in.");
    });
  }

  private getUser = async (realmUser: RealmUser) => {
    let userRes = await this.api.byId(realmUser.id)

    if (!userRes.data) {
      userRes = await (async () => {
        const { profile } = realmUser;

        const send = new UserObj({
          email: profile?.email,
          firstName: profile?.firstName,
          lastName: profile?.lastName,
          image: profile?.pictureUrl,
          identities: realmUser.identities,
          _id: realmUser.id,
        });

        return await this.api.create(send)
      })()
    }

    if (userRes.type === "ERROR" || !userRes.data) {
      console.error("Failed on: getUser(RealmUser)");
      throw userRes
    }

    return userRes;
  };
}