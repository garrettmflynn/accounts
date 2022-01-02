import * as Realm from "realm-web";
import { RealmUser } from './auth';
import { UserObj } from '../common/models/user.model';
import { userApi } from './apis/user.api';
import { AccountInfoType } from "./general.types";

const ENV = 'DEV' // TODO: To remove and replace with a window variable

const appName = "brainsatplay-tvmdj" // change for your application in MongoDB Realm
let userReference: UserObj | null = null

export const app = new Realm.App(appName);

export const handleAuthRedirect = () => Realm.handleAuthRedirect();

if (window.location.href.includes('_baas_client_app_id')) handleAuthRedirect(); // Authenticates on the other tab and closes this one

const getUser = async (realmUser: RealmUser) => {
    let userRes = (await userApi.byId(realmUser.id));

    // TODO: this is a point of attack, need to check on backend if this is the real realmUser
    if (!userRes.data) {
        userRes = await (async () => {
            const { profile } = realmUser
            
            const send = new UserObj({
                email: profile?.email,
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                pictureUrl: profile?.pictureUrl,
                fullName: profile?.name,
                identities: realmUser.identities,
                _id: realmUser.id,
            });

            console.log(send)
            
            return await userApi.create(send);
        })();
    }

    console.log(userRes)

    if (userRes.type === 'ERROR' || !userRes.data) {
        console.error('Failed on: initializeCurrentUser(RealmUser)');
        return false;
    }

    return userRes.data
}


export const create = async (auth: AccountInfoType) => {
    if (auth.password) await app.emailPasswordAuth.registerUser(auth.email, auth.password);
    else console.error('Account password not specified.')
}

export const reconfirm = async (auth: AccountInfoType) => await app.emailPasswordAuth.resendConfirmationEmail(auth.email);

export const confirmFromURL = async () => {
    const parsedUrl = new URL(window.location.href);
    let token = parsedUrl.searchParams.get('token')
    let tokenId = parsedUrl.searchParams.get('tokenId')

    if (token && tokenId) app.emailPasswordAuth.confirmUser(token, tokenId).then(res => {
        console.log(res)
    })
    else console.error('Token information not provided.')
}

export const resetPassword = async (auth: AccountInfoType) => {
    await app.emailPasswordAuth.sendResetPasswordEmail(auth.email);
}

export const remove = () => {
    return new Promise(async (resolve, reject) => {
        if (app.currentUser){
            await userApi.delete(app.currentUser.id).then(() => {
                logout().then(resolve).catch(reject)
            }).catch(reject)
        } else reject('User not logged in.')
    })

}

export const updateCustomUserData = (update: object) => {
    return new Promise(async (resolve, reject) => {
        if (app.currentUser && userReference){
            console.log('sending', update)
            Object.assign(userReference.customUserData, update)
            console.log('sending', userReference)
            await userApi.patch(app.currentUser.id, userReference).then(res => resolve(res.data)).catch(reject)
        } else reject('User not logged in.')
    })
}

// From Auth.ts
export const confirmUserFromURL = async (url: URL = new URL(window.location.href)) => {
    const token = url.searchParams.get('token');
    const tokenId = url.searchParams.get('tokenId');

    if (token && tokenId) {
        try {
            await app.emailPasswordAuth.confirmUser(token, tokenId);
            return true; // confirmation email sent
        } catch(e) {
            console.log("Couldn't send confirmation email", e);
            return false;
        }
    } else {
        return false;
    }
}

export const completePasswordReset = async (password: string) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenId = params.get("tokenId");

    if (!token || !tokenId) throw new Error(
        "You can only call resetPassword() if " +
        "the user followed a confirmation email link"
    );

    try {
        await app.emailPasswordAuth.resetPassword(password, token, tokenId);
        return true;
    } catch(e) {
        console.log("Couldn't reset password", e);
        return false;
    }
}

export const getGoogleCredentials = async () => {
    return Realm.Credentials.google({ redirectUrl: location.origin });
}

export const getCredentials = (auth: { email: string, password: string}) => {
    return new Promise<Realm.Credentials>(resolve => resolve(Realm.Credentials.emailPassword(auth.email,auth.password)))
}

export const login = async (creds?: Realm.Credentials) => {

    let { currentUser } = app;
    let type: 'LOG_IN' | 'REFRESH' = 'LOG_IN'
    
    // If email & pass is specified to function use credentials
    if (creds) {
        try {
            const user = await app.logIn(creds);

            if (user) {
                await user.refreshAccessToken();
                currentUser = user;
            }
        } catch (err) {
            if (ENV === 'DEV')
                console.error("Failed to log in:\n", err);
            
            return {
                type: 'FAIL' as const,
                data: { err, type: 'LOGIN' }
            }
        }

    // if currentUser exists & no login credentials are passed
    } else if (currentUser) {
        try {
            await currentUser.refreshAccessToken();
            type = 'REFRESH'
        } catch(err) {
            if (ENV === 'DEV')
                console.error("Failed to refresh:\n", err);
            
            return {
                type: 'FAIL' as const,
                data: { err, type: 'REFRESH' }
            }
        }
    }

    let uncaughtError = {
        type: 'FAIL' as const,
        data: { err: undefined, type: 'UNCAUGHT' }
    }

    if (currentUser instanceof Realm.User){
        const data = await getUser(currentUser as any)
        if (data) {
            userReference = data
            return {type, data}
        }
        else return uncaughtError
    } else return uncaughtError

}

export const logout = async () => {
    if (!app.currentUser)
        return { type: 'FAIL' as const, data: { err: new Error('No User Logged In') } };
    
    try {
        await app.currentUser.logOut();
        userReference = null
        return { type: 'LOGOUT' as const }
    } catch(err) {
        console.log(err);
        return { type: 'FAIL' as const, data: { err: new Error('Failed to logout') } };
    }
}

