module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Histories',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false,
        },
        createdByUser: {
          type: Sequelize.INTEGER,
          references: { model: 'Users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        freezeTableName: true,
      }
    );
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('Histories');
  },
};
