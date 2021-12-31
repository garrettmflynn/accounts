import fetch from "node-fetch";

// INITIALIZE BEFORE RUN OF SERVER:
(globalThis as any).log = console.log;
(globalThis as any).fetch = fetch;

import { resolve } from 'path';
import { configEnv } from '../common/utils.cjs';

// configEnv(resolve(__dirname, '../DEV.env'));

if (process.env.ENV !== 'PROD') configEnv(resolve(__dirname, '../.key'));  

const [arg1] = process.argv.slice(2);
if (process.env.ENV === 'PROD' || arg1 === 'CHECK_ENV') {
    console.log('\x1b[36m%s\x1b[0m', '\nBackend Environment:');
    // log(`\tENV: '${process.env.ENV}'`);
    console.log(`\tDATABASE: '${process.env.DATABASE}'\n`);
    if (arg1 === 'CHECK_ENV') process.exit();
}
