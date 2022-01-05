import { AnyObj } from "@giveback007/util-lib";
import { deleteData, getData, patchData, postData } from "./utils/fetch-methods";

export type ApiType = {
    byId: Function,
    getIds: Function
    all: Function
    create: Function
    patch: Function
    search: Function
    delete: Function
}

export const Api = <T extends AnyObj>(route: string, serverURI:string) => {
    const routeUrl = new URL(route, serverURI);
    
    return {
        byId: (id: string) =>
            getData<T | null>(routeUrl.href + '/' + id, serverURI),

        getIds: (ids: string[]) =>
            postData<string[], { found: T[], fail: string[] }>(routeUrl.href + '/get-ids', ids, serverURI),

        all: () => 
            getData<T[]>(routeUrl.href + '/all', serverURI),

        create: (obj: Partial<T>) =>
            postData<T, T>(route, obj as T, serverURI),

        patch: (id: string, obj: Partial<T>) =>
            patchData<T, T>(routeUrl.href + '/' + id, obj, serverURI),

        search: (searchParams: Partial<T>) =>
            postData<Partial<T>, T[]>(routeUrl.href + '/search', searchParams, serverURI),

        delete: (id: string) =>
            deleteData<Partial<T>, T[]>(routeUrl.href  + '/' + id, serverURI),
    }

}
