module.exports = function (sequelize, Sequelize) {
  var UserTwitch = sequelize.define('UserTwitch', {
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
      unique: true,
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

  UserTwitch.prototype.toJSON = function () {
    with(this.get()) {
      return {
        provider: 'twitch',
        idUserProvider,
        idUser,
        displayName,
        username,
        picture,
      }
    }
  }

  UserTwitch.associate = (models) => {
    return Promise.all([
      models.UserTwitch.belongsTo(models.User, {
        foreignKey: 'idUser',
        targetKey: 'idUser'
      }),
    ]);
  };

  return UserTwitch;
};
