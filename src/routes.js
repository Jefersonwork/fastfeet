import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controller/SessionController';
import RecipientsController from './app/controller/RecipientsController';
import DeliverymanController from './app/controller/DeliverymanController';
import FileController from './app/controller/FileController';
import DeliveriesController from './app/controller/DeliveriesController';
import DeliveryController from './app/controller/DeliveryController';
import DeliveryConcludedController from './app/controller/DeliveryCocludedController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:deliverymanId/deliveries', DeliveryController.index);
routes.get(
  '/deliveryman/:deliverymanId/deliveries/concluded',
  DeliveryConcludedController.index
);

routes.use(authMiddleware);

routes.post('/recipients', RecipientsController.store);
routes.put('/recipients', RecipientsController.update);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveriesController.index);
routes.post('/delivery', DeliveriesController.store);
routes.put('/delivery', DeliveriesController.update);
routes.delete('/delivery/:id', DeliveriesController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
