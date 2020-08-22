import Sequelize, { Model } from 'sequelize';

class Histories extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        quantity: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        material_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Histories;
