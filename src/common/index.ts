import { isType, nullOrEmpty, objKeys } from "@giveback007/util-lib";
import { AnyDate } from "./common-types";

export function randomId(tag = '') {
    return `${tag+Math.floor(Math.random()+Math.random()*Math.random()*10000000000000000)}`;
}

export const initModel = <T>(obj: T, partial?: Partial<T>) => {
    if (!nullOrEmpty(partial)) objKeys(obj).forEach(k => {
        const val = (partial as any)[k];
        if (isType(val, 'undefined')) return;
        
        obj[k] = val;
    });
}


export function toDate(date: AnyDate) {
    try {
        let dt: Date
        if (isType(date, 'string') || isType(date, 'number'))
            dt = new Date(date);
        else if (date instanceof Date)
            dt = date;
        else
            dt = new Date(date.y, date.m, date.d);

        if (dt.toString() === 'Invalid Date') return null;

        return dt;
    } catch {
        return null;
    }
}
