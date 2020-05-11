module.exports = function (sequelize, Sequelize) {
  var UserGoogle = sequelize.define('UserGoogle', {
    idUserProvider: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false
    },
    idUser: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false
    },
    displayName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    picture: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tokenAccess: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tokenRefresh: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  });

  UserGoogle.prototype.toJSON = function () {
    with(this.get()) {
      return {
        idUserProvider,
        idUser,
        displayName,
        picture,
      };
    }
  }

  UserGoogle.associate = (models) => {
    return Promise.all([
      models.UserGoogle.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'idUser'
      }),
    ]);
  };

  return UserGoogle;
};
