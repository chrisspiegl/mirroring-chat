module.exports = function (sequelize, Sequelize) {
  var UserDiscord = sequelize.define('UserDiscord', {
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
    username: {
      type: Sequelize.STRING,
      allowNull: false,
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

  UserDiscord.prototype.toJSON = function () {
    with(this.get()) {
      return {
        provider: 'discord',
        idUserProvider,
        idUser,
        displayName,
        picture,
      };
    }
  }

  UserDiscord.associate = (models) => {
    return Promise.all([
      models.UserDiscord.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'idUser'
      }),
    ]);
  };

  return UserDiscord;
};
