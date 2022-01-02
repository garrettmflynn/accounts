# accounts
 FOSS account management system for the Brains@Play ecosystem


## Features
- [x] Account creation
- [x] Login / Logout
- [x] Add arbitrary fields to your users in `customUserData`
- [x] Delete user data from database

- [ ] Write tests for the API
- [ ] Modularize further so that only the API is exposed
- [ ] Integrate into the main Brains@Play site
- [ ] Publish on NPM
- [ ] Linking accounts across different authorization types

## Notes
1. You must configure a MongoDB Realm account to accept all the authorization types you want your application to accept. We currently support: 
    - Email / Password
    - Google