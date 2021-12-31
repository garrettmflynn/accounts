import { Router } from 'express';
import { userController } from './user.controller';

const routeFcts: ((router: Router) => void)[] = [
    userController
];

export function initRoutes(router: Router) {
    routeFcts.forEach((fct) => fct(router));

    return router;
}
