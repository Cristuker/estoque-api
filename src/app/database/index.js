import Sequelize from 'sequelize';
import databaseConfig from '../../config/config';

import { Users, Materials } from '../models';

const models = [Users, Materials];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map((model) => model.init(this.connection));
    //   .map(
    //     (model) => model.associate && model.associate(this.connection.models)
    //   );
  }
}

export default new Database();
