import { Router } from 'express';
import {
  UserController,
  LoginController,
  MaterialsController,
} from './app/controllers';
import auth from './app/middlewares/tokenValidation';

const routes = Router();

routes.post('/users', UserController.store);

routes.post('/login', LoginController.store);

routes.use(auth);

routes.post('/rawMaterials', MaterialsController.store);

routes.get('/rawMaterials', MaterialsController.index);

export default routes;
