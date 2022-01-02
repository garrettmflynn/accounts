import { objKeys } from "@giveback007/util-lib";
import { initModel } from '..';
import { BaseObj } from "./_base.model";

export enum UserRole {
    admin = 'admin',
    organizationAdmin = 'organizationAdmin',
    peer = 'peer',
    client = 'client',
}

export enum UserStatus {
    /** This account has singed in using google but hasn't been linked with any organization/peer. */
    unlinked = 'unlinked',
    /** This account has been added by a peer/organization but hasn't been authorized by the user yet. */
    unregistered = 'unregistered',
    /** This account has unregistered from MyAlyce, this data is kept only for record keeping purposes or reactivation. */
    deactivated = 'deactivated',
    /** This account is currently active and is linked with the corresponding organization. */
    active = 'active',
}

export type UserFitbit = { token: string, id: string, expiresOn: number };

export const UserModelType = 'USER';
export class UserObj extends BaseObj<typeof UserModelType> {


    id: string = ""

    // Default User Information
    email: string = '';
    username: string = '';
    userRoles: string[] = [];
    missingKeyVals: (keyof UserObj)[] = [];
    firstName: string = '';
    lastName: string = '';
    fullName: string = '';
    pictureUrl: string | null = null;

    // Custom User Data
    customUserData: {
        [x : string] : any
    } = {'test': 0}


    /** eg:
     * ```ts
     * [
     *      { id: "123456789...", peerType: "oauth2-google" },
     *      { id: "123456789...", peerType: "myalyce" },
     * ]
     * ``` */
    identities: { id: string, peerType: string }[] = [];

    
    constructor(p?: Partial<UserObj>) {
        super(UserModelType, p);
        initModel(this, p);

        // Replace id with _id if not available
        if (p && !p.id && p._id != "") p.id = p._id
    }
}

export const UserObjKeys = objKeys(new UserObj);
