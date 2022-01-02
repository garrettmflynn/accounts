import { AnyObj } from "@giveback007/util-lib";

export type DefaultUserProfileData = {
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

export type PeerType =
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
    profile: {
        // type: 'normal' | 'server';
        identities: { id: string; peerType: PeerType }[];
        data: DefaultUserProfileData;
    };// | undefined;
    state: "active" | "logged-out" | "removed";
    customData: AnyObj;
}

export type AccountInfoType =  {
    email: string, 
    password?: string
    id_token?: string
}

export type AccountConfirmationType =  {
    token: string
    tokenId: string
}