import { Router } from 'express';
import {
  UserController,
  LoginController,
  MaterialsController,
} from './app/controllers';

const routes = Router();

routes.post('/users', UserController.store);

routes.post('/login', LoginController.store);

routes.post('/rawMaterials', MaterialsController.store);

export default routes;
