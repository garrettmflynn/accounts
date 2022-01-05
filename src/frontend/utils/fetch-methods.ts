// GET, POST, PUT, PATCH, DELETE

async function fetchHandler<S,G>(href:string, method: 'POST' | 'GET' | 'PATCH' | 'DELETE' = 'GET', toSend: S | null = null, timeout:boolean|number=false){

    const ac = new AbortController();
    setTimeout(() => ac.abort(), 7500); // timeout after seven seconds

    let options = {
        method,
        mode: 'cors',
        headers: { "Content-Type": "application/json", },
    } as Partial<RequestInit>

    // Declare Timeout
    if (timeout) {
        options.signal = ac.signal
        if (typeof timeout != 'number') timeout = 7500
        setTimeout(() => ac.abort(), timeout); // timeout after seven seconds
    }

    // Send Body
    if (toSend) options.body = JSON.stringify(toSend)

    const res = await fetch(href, options);

    if (!res.ok) {
        const error = await res.json();
        console.error(error);
        return { type: 'ERROR' as const, error };
    }

    return { type: 'SUCCESS' as const, data: await res.json() as G };
}

export async function getData<G>(route: string, mainURI:string) {
    try {
        const uri = new URL(route, mainURI);
        return await fetchHandler<null, G>(uri.href, 'GET');
    } catch(error: any) {
        console.error(route, error); 
        return { type: 'ERROR' as const, error };
    }
}

export async function postData<S, G>(route: string, send: S, mainURI:string) {
    try {
        const uri = new URL(route, mainURI);
        return await fetchHandler<S, G>(uri.href, 'POST', send);
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}

export async function patchData<S, G>(route: string, send: Partial<S>, mainURI:string) {
    try {
        const uri = new URL(route, mainURI);
        return await fetchHandler<Partial<S>, G>(uri.href,'PATCH', send);
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}

export async function deleteData<S, G>(route: string, mainURI:string) {
    try {
        const uri = new URL(route, mainURI);
        return await fetchHandler<S, G>(uri.href, 'DELETE');
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}
