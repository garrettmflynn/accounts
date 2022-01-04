import { hasKey } from "@giveback007/util-lib";
import { DeleteResult } from "mongodb";
import { Model as ModelType, Document, ObjectId } from "mongoose";

/**
 * 
 *  We need to to use the UserPlatform's struct format to read/write to the same DB as I'm using in sockets
 *  Otherwise the sockets perform a lot of backend thing to notify and correlate user accounts when data updates 
 *  so we should prefer it for any live user-user features, while this should mainly be used for more secure account 
 *  access and authorization
 * 
 */


/**
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * code:
 * 
 * 500 - Internal server error
 * 
 * 404 - Resource not found
 */

export const errorObj = (error: any, code: 500 | 404 | 409) => ({
    code, error,
    message: (error.message || error._message || 'Error with no message') as string,
    type: 'ERROR' as const,
    isSuccess: false as const,
});

/**
 * * https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 * 
 * code:
 * 
 * 200 - The request has succeeded
 * 
 * 201 - Created success status response
 */
export const successObj = <T = any>(data: T, code: 200 | 201) => ({
    code, data,
    type: 'SUCCESS' as const,
    isSuccess: true as const,
});

/** NOTE:
 * there's a way to integrate permissions by passing in an 
 * optional function that then either sanitizes or doesn't 
 * allow the data based on the users permissions
 * */
export class dbUtil {
    static async search<T = any>(Model: ModelType<any>, searchParams: Partial<T>) {
        try {
            const found: (Document & T)[] = await Model.find(searchParams).exec();
            //if user has socket
            //make sure the socket stuff when running a websocketcontroller command is returned and processed in to the local user's platform
            //otherwise just run the command, which handles a lot more custom read/write logic
            return successObj(found, 200);
        } catch (err: any) {
            return errorObj(err, 500);
        }
    }

    static async getAll<T = any>(Model: ModelType<any>) {
        try {
            const all: (Document & T)[] = await Model.find({}).exec();
            return successObj(all, 200);
        } catch(err: any) {
            return errorObj(err, 500)
        }
    }

    static async patch<T = any>(Model: ModelType<any>, objId: string | ObjectId, setProps: Partial<T>) {

        // Prevent unintentional id changes
        if (hasKey(setProps, '_id')) delete setProps._id;
            //if user has socket
            //make sure the socket stuff when running a websocketcontroller command is returned and processed in to the local user's platform
            //otherwise just run the command, which handles a lot more custom read/write logic
        try {
            const doc: (Document & T) | null = await Model.findById(objId).exec();
            if (!doc) return errorObj({ message: `patch: "id: ${objId}" not found` }, 404);
            
            for (const key in setProps)
                (doc as any)[key] = setProps[key];

            const patchedObj = await doc.save();
            return successObj(patchedObj, 200);
        } catch(err: any) {
            return errorObj(err, 500)
        }
    }

    static async getById<T = any>(Model: ModelType<any>, objId: string | ObjectId) {
        try {
            const doc: (Document & T) | null = await Model.findById(objId).exec();
            if (!doc) return errorObj({ message: `getById: "id: ${objId}" not found`, objId }, 404);
            
            return successObj(doc, 200);
        } catch(err: any) {
            return errorObj(err, 500)
        }
    }

    static async deleteById(Model: ModelType<any>, objId: string | ObjectId) {
        try {
            const res: (DeleteResult) = await Model.deleteOne({_id: objId}).exec();
            if (!res || res.deletedCount == 0) return errorObj({ message: `deleteById: "request not acknowledged. try again.`, objId }, 409);
            
            return successObj(res, 200);
        } catch(err: any) {
            return errorObj(err, 500)
        }
    }
}
