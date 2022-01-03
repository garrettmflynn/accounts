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
    profile: DefaultUserProfileData;
    identities: { id: string; peerType: PeerType }[];
    state: "active" | "logged-out" | "removed";
    customData: AnyObj;
}

export type AccountInfoType =  Realm.Auth.RegisterUserDetails

export type AccountConfirmationType =  {
    token: string
    tokenId: string
}