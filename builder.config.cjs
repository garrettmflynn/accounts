// ./builder.config.js
const { join, resolve } = require('path');
const { runNodejs, browserPlay, nodejsPlay, devNodejs, devBrowser } = require('build-dev');
const { configEnv } = require('./src/common/utils.cjs');


const browserOptions = {
    fromDir: 'src/frontend',
    entryFile: 'index.ts',
    toDir: '.cache/web',
    copyFiles: ['index.html'],
    watchOtherDirs: ['src']
}

const nodeOptions = {
    fromDir: '/src/backend', 
    entryFile: 'main.ts', 
    toDir: '.cache/node' 
}


function run([type]) {
    switch (type) {

        case 'play:browser':
            return browserPlay();

        case 'play:nodejs':
            return nodejsPlay();

        case 'run:nodejs':
            return runNodejs({ entryFile: './server/main' });

        case 'dev:browser':
            return devBrowser(browserOptions);

        case 'dev:nodejs':

            // const envVars = configEnv(resolve(__dirname, './development.env'));
            // if (!envVars) throw new Error('No environment variables initialized...');

            return devNodejs(nodeOptions);

        case 'dev':
            run(['dev:browser'])
            run(['dev:nodejs'])
            break;

        default:
            throw new Error(`"${type}" not implemented`);
    }
}

run(process.argv.slice(2));