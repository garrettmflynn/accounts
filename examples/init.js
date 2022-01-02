import fetch from "node-fetch";

// INITIALIZE BEFORE RUN OF SERVER:
(globalThis).log = console.log;
(globalThis).fetch = fetch;

import { resolve } from 'path';
import { configEnv } from './utils.js';

const [arg1, _] = process.argv.slice(2)

// Declare Environment Variables (public)
const envVars = configEnv(resolve(__dirname, `../${arg1}.env`));
if (!envVars) throw new Error('No environment variables initialized...');
console.log(envVars)

// Declare Environment Variables (secret)
configEnv(resolve(__dirname, '../.key'));  

// Announce Configuration
if (process.env.ENV === 'PROD' || arg1 === 'CHECK_ENV') {
    console.log('\x1b[36m%s\x1b[0m', '\nBackend Environment:');
    // log(`\tENV: '${process.env.ENV}'`);
    console.log(`\tDATABASE: '${process.env.DATABASE}'\n`);
    if (arg1 === 'CHECK_ENV') process.exit();
}
