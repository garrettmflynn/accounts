// TODO:
// in terms of google login, we should figure out how to resolve it so to as maybe use:
// https://developers.google.com/identity/protocols/oauth2/web-server and not need two sets of logins to manage on the FE

// TODO:
// there should be some automatic linking of accounts if said account has the same email address.

// user logs in with google
// check if associated email already exists:

    // (if) user does not exist:
        // (create) user
        // user.status = 'unlinked'
        // FE response: 'Notify your organization to activate your account'
    
    // (if) user exists:
        // (if) user.status === ('unlinked')
        // FE response: 'Notify your organization to activate your account'

        // (if) user.status === ('unregistered')
        //---// This is the first time the user logged in //---//
        // (change) status of user to 'active'
        // FE response: --- alow the user to access said account features ---

        // (if) user.status === ('deactivated')
        // FE response: 'Your acct is deactivated, please contact your organization to reactivate it'

        // (if) user.status === ('active')
        // FE response: --- alow the user to access said account features ---


// *** Initial implementation: ***
// ! do not keep using this (temp only)
// with this anyone can login without activation of user
// they will be prompted to activate their fitbit
// any (peer) role will need to be manually set in DB

import { User } from '../schemas/user.schema';
import { Router } from 'express';
import { controller } from './_abstract.controller';

export function userController(router: Router, rt = '/user') {
    controller(router, User, rt, {
        search: 'ERROR',
        update: 'ERROR',
        getById: true,
        getIds: true,
        create: true,
        patch: true,
        getAll: true,
        deleteById: true
    });
}
