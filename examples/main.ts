import express from 'express';
import cors from 'cors';
import fs from 'fs';
import http from 'http';
import https from 'https';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import * as api from '../src/backend'

// Declare Secret Environment Variables ( based on first argument passed )
import { resolve } from 'path';
import {config} from 'dotenv'
const [arg1, _] = process.argv.slice(2)
config({path: resolve(__dirname, `../${arg1}.key`)});  

const { env } = process; // Requires env.DB_URI in your specified .key file
const app = express();

// Parse Body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper Function to Get DB URI Safely
function getDbURI(input: string | undefined): string {
    if (!input) throw new Error('"DB_URI" for "TEST" db not set');
    else return input
}

// Connect to your local instance of Mongoose
mongoose.connection.on('open', () => console.log('DB Connected!'));

mongoose.connect(getDbURI(env.DB_URI))
    .then(run)
    .catch((e) => {
        console.log('\x1b[31m%s\x1b[0m', '\nERROR:', `Couldn't connect to "${env.DATABASE}" DB.\n`);
        console.log('MESSAGE:', e.message);
        console.log('REASON:', e.reason);
        console.log('\nFULL ERROR:\n', e, '\n')

        run();
    })

async function run() { 
    app.use(cors()); // how to allow data to only intended website without cors

    // Set Routes
    const router = express.Router();
    app.use("/", router);

    // Setup API (from @brainsatplay/accounts-node)
    let users = new api.UserController(router)

    // Set Server
    let protocol = 'http';
    let server
    const port = process.env.PORT || '80';
    const credentials: any = { key: null, cert: null };
    
    if (process.env.ENV === 'PROD') {
        credentials.cert = fs.readFileSync('/etc/letsencrypt/live/server.myalyce.com/fullchain.pem'); 
        credentials.key = fs.readFileSync('/etc/letsencrypt/live/server.myalyce.com/privkey.pem');
        protocol = 'https';
    }

    // Create Server
    if (protocol === 'https'){
        if (credentials.key != null && credentials.cert !== null){
            server = https.createServer(credentials, app)
        } else {
            console.log('invalid credentials. Reverting to HTTP protocol.')
            protocol = 'http'
            server = http.createServer(app)
        }
    } else {
        protocol = 'http'
        server = http.createServer(app)
    }
    
    
    // if (mongoose) app.set('mongoose', mongoose.connection.db);

    server.listen(parseInt(port), () => {
      console.log(`Server created on ${protocol}://${`localhost`}:${port}`)
    });

    // Start Server
    function listen(port: number) {
        app.listen(port, () => {
            console.log(`Listening on port: ${port}`);
        });
    }

    listen(4000);
}
