import { Router } from 'express';

import SessionController from './app/controller/SessionController';
import RecipientsController from './app/controller/RecipientsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients', RecipientsController.update);

export default routes;
