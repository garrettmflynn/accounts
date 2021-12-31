import {config} from 'dotenv'

export const configEnv = function configEnv(path:string) {
    const { error, parsed } = config({ path });

    if (error) {
        const msg = typeof error === 'string' ? error : error.message;
        console.log('\x1b[31m%s\x1b[0m', "\nERROR .env' file:\n", '\t' + msg);

        return false;
    }

    return parsed || false;
}
