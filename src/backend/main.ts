console.log('test')
// import "./init";
// import express from 'express';
// import cors from 'cors';
// import fs from 'fs';
// import http from 'http';
// import https from 'https';
// import mongoose, { Mongoose } from 'mongoose';
// import { initRoutes } from "./controllers/init-routes";
// import bodyParser from 'body-parser';
// import { getDbURI } from "./utils/general.util";

// const { env } = process;
// const app = express();

// // Parse Body
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.connection.on('open', () => console.log(env.DATABASE, 'DB Connected!'));

// mongoose.connect(getDbURI())
//     .then((m) => run(m))
//     .catch((e) => {
//         console.log('\x1b[31m%s\x1b[0m', '\nERROR:', `Couldn't connect to "${env.DATABASE}" DB.\n`);
//         console.log('MESSAGE:', e.message);
//         console.log('REASON:', e.reason);
//         console.log('\nFULL ERROR:\n', e, '\n')

//         run();
//     })

// async function run(mongoose?: Mongoose) { 
//     app.use(cors()); // how to allow data to only intended website without cors

//     // Set Websocket Server
//     let protocol = 'http';
//     let server
//     const port = process.env.PORT || '80';
//     const credentials: any = { key: null, cert: null };
    
//     if (process.env.ENV === 'PROD') {
//         credentials.cert = fs.readFileSync('/etc/letsencrypt/live/server.myalyce.com/fullchain.pem'); 
//         credentials.key = fs.readFileSync('/etc/letsencrypt/live/server.myalyce.com/privkey.pem');
//         protocol = 'https';
//     }

//     // Create Server
//     if (protocol === 'https'){
//         if (credentials.key != null && credentials.cert !== null){
//             server = https.createServer(credentials, app)
//         } else {
//             console.log('invalid credentials. Reverting to HTTP protocol.')
//             protocol = 'http'
//             server = http.createServer(app)
//         }
//     } else {
//         protocol = 'http'
//         server = http.createServer(app)
//     }
    
    
//     if (mongoose) {
//         app.set('mongoose', mongoose.connection.db);
//     }

//     server.listen(parseInt(port), () => {
//       console.log(`Websocket server created on ${protocol}://${`localhost`}:${port}`)
//     });
//     // Set Routes
//     const router = express.Router();

//     // handle profile requests
//     router.post("/profile", require("./controllers/profile").profile);
    
    
//     // handle fitbit requests
//     // const fitbitController = require("./controllers/fitbit");
//     // router.post("/fitbit", fitbitController.fitbit);

//     app.use("/", initRoutes(router));

//     // Start Server
//     function listen(port: number) {
//         app.listen(port, () => {
//             console.log(`Listening on port: ${port}`);
//         });
//     }

//     listen(4000);
// }
