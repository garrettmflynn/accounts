import { AnyObj } from "@giveback007/util-lib";
import { App as RealmApp, Credentials, handleAuthRedirect } from "realm-web";

const ENV = 'DEV' // TODO: To remove and replace with a window variable

type DefaultUserProfileData = {
    name?: string;
    email?: string;
    pictureUrl?: string;
    firstName?: string;
    lastName?: string;
    sex?: string;
    birthday?: string;
    minAge?: string;
    maxAge?: string;
}

type PeerType =
    | "anon-user"
    | "api-key"
    | "local-userpass"
    | "custom-function"
    | "custom-token"
    | "oauth2-google"
    | "oauth2-facebook"
    | "oauth2-apple";

export type RealmUser = {
    id: string;
    accessToken: string | null;
    refreshToken: string | null;
    /** Check if this is correct: */
    profile: DefaultUserProfileData;
    identities: { id: string; peerType: PeerType }[];
    state: "active" | "logged-out" | "removed";
    customData: AnyObj;
}

    const appName = "brainsatplay-tvmdj" // change for your application in MongoDB Realm

    export const app = new RealmApp(appName);
    // const redirectUri = `${window.location.origin}/redirect`;
    
    if (window.location.href.includes('_baas_client_app_id')) {
        handleAuthRedirect(); // Authenticates on the other tab and closes this one
    }

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
        return Credentials.google({ redirectUrl: location.origin });
    }

    export const getCredentials = (auth: { email: string, pass: string}) => {
        return Credentials.emailPassword(auth.email,auth.pass);
    }

    export const login = async (creds?: Credentials) => {

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

        return currentUser ? 
            { type, data: currentUser.toJSON() as RealmUser }
            :
            {
                type: 'FAIL' as const,
                data: { err: undefined, type: 'UNCAUGHT' }
            };
    }

    export const logout = async () => {
        if (!app.currentUser)
            return { type: 'FAIL' as const, data: { err: new Error('No User Logged In') } };
        
        try {
            await app.currentUser.logOut();
            return { type: 'LOGOUT' as const }
        } catch(err) {
            console.log(err);
            return { type: 'FAIL' as const, data: { err: new Error('Failed to logout') } };
        }
    }
