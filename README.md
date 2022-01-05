# accounts
 FOSS account management system for the Brains@Play ecosystem


## Features
- [x] Account creation
- [x] Login / Logout
- [x] Add arbitrary fields to your users in `customUserData`
- [x] Delete user data from database

- [ ] Integrate into the main Brains@Play site
- [ ] Publish on NPM
- [ ] Linking accounts across different authorization types

### Quick Start
[Install Node LTS](https://nodejs.org/en/download/) (v16 as of writing).

```sh
git pull https://github.com/brainsatplay/accounts/
cd accounts
yarn && yarn start
```
This project uses yarn for better monorepo support. If yarn is not installed run:

```sh
npm i yarn -g
```

> **Note:** The examples in this project assume that you have created a `.key` file to hold your secret keys for each environment (e.g. `development.key`, `production.key`). This file should include a `DB_URI` to reference your MongoDB database.

#### Frontend
```typescript
import AccountsAPI from '../src/frontend'
const accounts = new AccountsAPI("myapp-name")

// Login with a Test User Account
accounts.login({email: 'test@gmail.com', password:'test'})
.then(console.log)
.catch(console.error) // expect to sign up first...

```


#### Backend
```typescript
import * as api from '@brainsatplay/accounts-node'
import express from 'express'
import mongoose from 'mongoose'
import { resolve } from 'path';
import { config } from 'dotenv'

const [arg1, _] = process.argv.slice(2) // specify environment (e.g. with first argument)
config({path: resolve(__dirname, `../${arg1}.key`)}); // load environment variables

mongoose.connect(process.env.DB_URI)
.then((m) => {
    // Set Routes
    const router = express.Router();
    app.use("/", router);

    // Setup API (from @brainsatplay/accounts-node)
    let users = new api.UserController(router)

    /* CODE TO START THE SERVER */
})
```

## Notes
1. You must configure a MongoDB Realm account to accept all the authorization types you want your application to accept. This API currently supports: 
    - Email / Password
    - Google