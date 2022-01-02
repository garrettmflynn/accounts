// ./builder.config.js
const { runNodejs, browserPlay, nodejsPlay, devNodejs, devBrowser } = require('build-dev');

function run([type]) {
    switch (type) {

        case 'play:browser':
            return browserPlay();

        case 'play:nodejs':
            return nodejsPlay();

        case 'dev:browser':
            return devBrowser({
                fromDir: 'examples',
                entryFile: 'index.ts',
                toDir: '.cache/web',
                copyFiles: ['index.html'],
                watchOtherDirs: ['src/frontend', 'src/common']
            });

        case 'dev:nodejs':

            // nodeOptions.nodeArgs = ['development']
            // return devNodejs({
            //     fromDir: 'examples', 
            //     entryFile: 'main.ts', 
            //     toDir: '.cache/node',
            //     watchOtherDirs: ['src/backend', 'src/common'],
            //     nodeArgs: ['development']
            // });
            return runNodejs({
                 entryFile: './examples/main', 
                  watchDirs: ['src/backend', 'src/common'],
                  nodeArgs: ['development'] 
                });

        case 'dev':
            run(['dev:browser'])
            run(['dev:nodejs'])
            break;

        case 'play':
            run(['play:browser'])
            run(['play:nodejs'])
            break;

        default:
            throw new Error(`"${type}" not implemented`);
    }
}

run(process.argv.slice(2));