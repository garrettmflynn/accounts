import * as Realm from "realm-web";
import { RealmUser } from './auth';
import { UserObj } from '../common/models/user.model';
import { objExtract } from '@giveback007/util-lib';
import { userApi } from './apis/user.api';

const appName = "myalyce-ilscy" // change for your application
export const app = new Realm.App(appName);
const redirectUri = `${window.location.origin}/redirect`;

type AccountInfoType =  {
    email: string, 
    password?: string
    id_token?: string
}

type AccountConfirmationType =  {
    token: string
    tokenId: string
}

export const initializeCurrentUser = async (realmUser: RealmUser) => {
    let userRes = (await userApi.byId(realmUser.id));
    
    // TODO: this is a point of attack, need to check on backend if this is the real realmUser
    if (!userRes.data) userRes = await (async () => {
        const { data } = realmUser.profile;

        const send = new UserObj({
            ...objExtract(data, ['email', 'firstName', 'lastName', 'pictureUrl']),
            fullName: data.name,
            identities: realmUser.profile.identities,
            _id: realmUser.id,
        });
        
        return await userApi.create(send);
    })();

    if (userRes.type === 'ERROR' || !userRes.data) {
        console.error('Failed on: initializeCurrentUser(RealmUser)');
        return false;
    }

    return userRes.data
}


export const createRealmUser = async (auth: AccountInfoType) => {
    if (auth.password) await app.emailPasswordAuth.registerUser(auth.email, auth.password);
    else console.error('Account password not specified.')
}

export const resendConfirmationEmail = async (auth: AccountInfoType) => {
    await app.emailPasswordAuth.resendConfirmationEmail(auth.email);
}

export const confirmUserFromURL = async () => {
    const parsedUrl = new URL(window.location.href);
    let token = parsedUrl.searchParams.get('token')
    let tokenId = parsedUrl.searchParams.get('tokenId')

    if (token && tokenId){
        await confirmUser({token,tokenId})
    }
}

export const confirmUser = async (auth: AccountConfirmationType) => {
    if (auth.token && auth.tokenId) await app.emailPasswordAuth.confirmUser(auth.token, auth.tokenId);
    else console.error('Token information not provided.')
}

export const sendPasswordReset = async (auth: AccountInfoType) => {
    await app.emailPasswordAuth.sendResetPasswordEmail(auth.email);
}


export const completePasswordReset = async (auth: AccountInfoType) => {
    
    if (auth.password){
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const tokenId = params.get("tokenId");
        if (!token || !tokenId) {
        throw new Error(
            "You can only call resetPassword() if the user followed a confirmation email link"
        );
        }
        app.emailPasswordAuth.resetPassword(auth.password, token, tokenId).then(res => {
            console.log(res)
        }).catch(e => {
            console.log('error', e)
        });
    } else console.error('New password not specified.')
}

export const login = async (auth: AccountInfoType, googleLogin:boolean = false) => {

    // Instantiate a user
    let credentials, tempCredentials
    if (!app.currentUser?.isLoggedIn && auth) {


            // Google Login
            if (googleLogin && auth.id_token) {
                tempCredentials = Realm.Credentials.google(auth.id_token)
            } 
            
            // Basic Realm Login
            else if (auth.password) {
                tempCredentials = Realm.Credentials.emailPassword(
                    auth.email,
                    auth.password 
                );
            }

            if (tempCredentials){

                credentials = Object.assign(tempCredentials)
                if (!('redirectUri' in credentials.payload)) credentials.payload.redirectUri = redirectUri
                
                try {
                    let user = await app.logIn(credentials);
                    if (user) {
                        await user.refreshCustomData()
                    }
                } catch (err: any) {
                    console.error("Failed to log in", err.message);
                }

            } else console.log('User login information not properly specified.')
    }


    return app.currentUser
}


export const logout = async () => {
    if (app.currentUser?.isLoggedIn) await app.currentUser.logOut()
}

export const handleAuthRedirect = () => Realm.handleAuthRedirect();

