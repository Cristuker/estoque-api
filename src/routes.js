import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { resolve } from 'path';
import {
  UserController,
  LoginController,
  MaterialsController,
} from './app/controllers';
import auth from './app/middlewares/tokenValidation';

const swaggerDocument = YAML.load(resolve('src', 'docs', 'swagger.yaml'));

const routes = Router();

routes.use('/api-docs', swaggerUi.serve);
routes.get('/api-docs', swaggerUi.setup(swaggerDocument));

routes.post('/users', UserController.store);

routes.post('/login', LoginController.store);

routes.use(auth);

routes.post('/rawMaterials', MaterialsController.store);

routes.get('/rawMaterials', MaterialsController.index);

routes.put('/rawMaterials/:id/request', MaterialsController.update);

export default routes;
