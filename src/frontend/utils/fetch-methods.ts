// GET, POST, PUT, PATCH, DELETE

export async function getData<G>(route: string, mainURI = SERVER_URI) {
    try {
        const uri = new URL(route, mainURI);
        const ac = new AbortController();
        setTimeout(() => ac.abort(), 7500);

        const res = await fetch(uri.href, {
            method: 'GET',
            mode: 'cors',
            signal: ac.signal
        });

        if (!res.ok) {
            const error = await res.json();
            console.error(error);
            return { type: 'ERROR' as const, error };
        }

        return { type: 'SUCCESS' as const, data: await res.json() as G };
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}

export async function postData<S, G>(route: string, send: S, mainURI = SERVER_URI) {
    try {
        const uri = new URL(route, mainURI);
        const ac = new AbortController();
        setTimeout(() => ac.abort(), 7500);

        const res = await fetch(uri.href, {
            method: 'POST',
            mode: 'cors',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(send)
        });
        
        if (!res.ok) {
            const error = await res.json();
            console.error(error);
            return { type: 'ERROR' as const, error };
        }

        return { type: 'SUCCESS' as const, data: await res.json() as G };
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}

export async function patchData<S, G>(route: string, send: Partial<S>, mainURI = SERVER_URI) {
    try {
        const uri = new URL(route, mainURI);
        const ac = new AbortController();
        setTimeout(() => ac.abort(), 7500);

        const res = await fetch(uri.href, {
            method: 'PATCH',
            mode: 'cors',
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(send)
        });

        if (!res.ok) {
            const error = await res.json();
            console.error(error);
            return { type: 'ERROR' as const, error };
        }

        return { type: 'SUCCESS' as const, data: await res.json() as G };
    } catch(error: any) {
        console.error(route, error);
        return { type: 'ERROR' as const, error };
    }
}
