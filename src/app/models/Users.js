import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        role: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password_hash) {
        // eslint-disable-next-line no-param-reassign
        user.password_hash = await bcrypt.hash(user.password_hash, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Users;
