module.exports = function (sequelize, Sequelize) {
  var UserFacebook = sequelize.define('UserFacebook', {
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
      allowNull: true, // allow null because it is not used by Facebook any more
    },
  }, {
    freezeTableName: true,
  });

  UserFacebook.prototype.toJSON = function () {
    with(this.get()) {
      return {
        provider: 'facebook',
        idUserProvider,
        idUser,
        displayName,
        picture,
      };
    }
  }

  UserFacebook.associate = (models) => {
    return Promise.all([
      models.UserFacebook.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'idUser'
      }),
    ]);
  };

  return UserFacebook;
};
