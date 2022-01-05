import { objKeys } from "@giveback007/util-lib";
import { initModel } from '..';




export class UserObj {

    _id: string = ""
    id: string = ""

    // Default User Information
    email: string = '';
    username: string = '';
    firstName: string = '';
    lastName: string = '';
    image: string | null = null;

    // Custom User Data
    customUserData: {
        [x : string] : any
    } = {}


    /** eg:
     * ```ts
     * [
     *      { id: "123456789...", peerType: "oauth2-google" },
     *      { id: "123456789...", peerType: "myalyce" },
     * ]
     * ``` */
    identities: { id: string, peerType: string }[] = [];

    
    constructor(p?: Partial<UserObj>) {
        initModel(this, p);

        // Replace id with _id if not available
        if (p && !p.id && p._id != "") p.id = p._id
    }
}

export const UserObjKeys = objKeys(new UserObj);