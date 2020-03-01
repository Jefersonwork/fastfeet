import { Router } from 'express';

import SessionCotroller from './app/controller/SessionController';

const routes = new Router();

routes.post('/sessions', SessionCotroller.store);

export default routes;
