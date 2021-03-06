import { Dict } from "@giveback007/util-lib";
import { dbUtil } from "../utils/db.util";
import { Router, Response } from "express";
import { Model as ModelType, Document } from "mongoose";

const catchRes500 = (res: Response, error: any) => 
    res.status(500).json({ message: error.message || error._message, error });

const errRoute = (type: string, res: Response, route: string) =>
    res.status(500).json({ message: `"${type}/" is not implemented on "${route}/"` });

function handleResult(result: {
    code: 500 | 404 | 409;
    error: any;
    message: string;
    type: 'ERROR';
    isSuccess: false;
} | {
    code: 200 | 201;
    data: any;
    type: 'SUCCESS';
    isSuccess: true;
}, response: Response) {
    return result.isSuccess ?
        response.status(result.code).json(result.data)
        :
        response.status(result.code).json(result)
}

export class Controller {

    router: Router
    model: ModelType<any>
    route: string

    constructor(
    router: Router,
    Model: ModelType<any>,
    route: string,
    opts: {
        deleteById?: boolean | 'ERROR';
        getById?:    boolean | 'ERROR';
        getIds?:     boolean | 'ERROR';
        getAll?:     boolean | 'ERROR';
        search?:     boolean | 'ERROR';
        create?:     boolean | 'ERROR';
        update?:     boolean | 'ERROR';
        patch?:      boolean | 'ERROR';
    }
) {

    this.router = router
    this.model = Model
    this.route = route
    
    const {
        search, getAll, patch,
        update, getById, create, getIds, deleteById
    } = opts;

    // eg: "/user/search" with 'post'
    if (search) router.post(`${route}/search`, async (req, res) => {
        if (search === 'ERROR') return errRoute('search', res, route);
    
        const result = await this.search(req.body)
        return handleResult(result, res);
    });

    // eg: "/user/all" with 'get'
    if (getAll) router.get(`${route}/all`, async (_, res) => {
        if (getAll === 'ERROR') return errRoute('all', res, route);

        const result = await this.getAll()

        return handleResult(result, res);
    });

    // eg: "/user/614b800835a020db9fd6ed0e" with 'patch'
    if (patch) router.patch(`${route}/:id`, async (req, res) => {
        if (patch === 'ERROR') return errRoute('patch', res, route);
        //got post from this user,
        //is user live on socket? 
        //yeah okay go through sockets
        const { id } = req.params;
        const result = await this.patch(id, req.body)
        return handleResult(result, res);
    });

    // eg: "/user/614b800835a020db9fd6ed0e" with 'put'
    if (update) router.put(`${route}/:id`, async (req, res) => {
        if (update === 'ERROR') return errRoute('update', res, route);

        const { query } = req;
        console.log('UPDATE:', query);
        throw new Error('not implemented');
    });

    // eg: "/user/614b800835a020db9fd6ed0e" with 'get'
    if (getById) router.get(`${route}/:id`, async (req, res) => {

        if (getById === 'ERROR') return errRoute('get by id', res, route);

        const { id } = req.params;
        const result = await this.getById(id)
        return handleResult(result, res);
    });

    // eg: "/user/614b800835a020db9fd6ed0e" with 'delete'
    if (deleteById) router.delete(`${route}/:id`, async (req, res) => {
        if (deleteById === 'ERROR') return errRoute('delete', res, route);

        const { id } = req.params;
        const result = await this.deleteById(id)
        return handleResult(result, res);
    });

    // eg: "/user/get-ids" with 'post'
    if (getIds) router.post(`${route}/get-ids`, async (req, res) => {
        if (getIds === 'ERROR') return errRoute('get ids', res, route);

        const ids: string[] = req.body;
        try {
            const send = this.getIds(ids)
            return res.status(200).json(send);
        } catch(error: any) {
            return catchRes500(res, error);
        }
    });

    // eg: "/user" with 'post'
    if (create) router.post(`${route}`,  (req, res) => {

        return new Promise((resolve) => {
            if (create === 'ERROR') resolve(errRoute('create', res, route));

            this.create(req.body).then(obj => {
                resolve(res.status(201).json(obj));
            }).catch(error => {
                if (error.code === 11000) resolve(catchRes500(res, Object.assign(error, {message: 'Email already in use. Please login using another method.'})));
                else resolve(catchRes500(res, error));
            })
        })

    });
}

search = async (query:any) => await dbUtil.search(this.model, query);

getAll = async () => await dbUtil.getAll(this.model);

patch  = async (id:string, o:any) => await dbUtil.patch(this.model, id, o);

getById  = async (id:string) => await dbUtil.getById(this.model, id);

deleteById  = async (id:string) => await dbUtil.deleteById(this.model, id);

getIds  = async (ids:string[]) => {
    const foundDict: Dict<boolean> = {};
    const result: Document[] = await this.model.find({ '_id': { $in: ids } });
    result.forEach((doc) => {
        const id: string = doc._id.toString();
        foundDict[id] = true;
    });

    return { found: result, fail: ids.filter((id) => !foundDict[id]) }
}

create = async (o:any) => {
    const doc: Document = new this.model(o);
    return await doc.save()
}

}
