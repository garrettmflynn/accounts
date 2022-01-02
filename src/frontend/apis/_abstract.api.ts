import { AnyObj } from "@giveback007/util-lib";
import { BaseObj } from "../../common/models/_base.model";
import { deleteData, getData, patchData, postData } from "../utils/fetch-methods";

const SERVER_URI = 'http://localhost:4000' // TODO: To remove and replace with a window variable

export const Api = <T extends AnyObj>(route: string) => {
    const routeUrl = new URL(route, SERVER_URI);
    
    return {
        byId: (id: string) =>
            getData<T | null>(routeUrl.href + '/' + id),

        getIds: (ids: string[]) =>
            postData<string[], { found: T[], fail: string[] }>(routeUrl.href + '/get-ids', ids),

        all: () => 
            getData<T[]>(routeUrl.href + '/all'),

        create: (obj: Omit<T, keyof BaseObj<any>> & Partial<BaseObj<any>>) =>
            postData<T, T>(route, obj as T),

        patch: (id: string, obj: Partial<T>) =>
            patchData<T, T>(routeUrl.href + '/' + id, obj),

        search: (searchParams: Partial<T>) =>
            postData<Partial<T>, T[]>(routeUrl.href + '/search', searchParams),

        delete: (id: string) =>
            deleteData<Partial<T>, T[]>(routeUrl.href  + '/' + id),
    }

}
