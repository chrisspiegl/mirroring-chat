const uuid = require('uuid');

module.exports = function (sequelize, Sequelize) {
  const User = sequelize.define('User', {
    idUser: {
      type: Sequelize.UUID,
      defaultValue: () => uuid.v4(),
      primaryKey: true,
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
      type: Sequelize.STRING,
      allowNull: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    settings: {
      type: Sequelize.TEXT,
      allowNull: false,
      get() {
        if (this.getDataValue('settings') !== void 0) {
          return JSON.parse(this.getDataValue('settings'));
        }
        return {};
      },
      set(value) {
        return this.setDataValue('settings', JSON.stringify(value));
      }
    },
    adminSuper: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    lastActive: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    lastLogin: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
    getterMethods: {
      profilePath: function () {
        const identifier = (this.get('username')) ? this.get('username') : this.get('idUser');
        return `/@${identifier}`;
      }
    }
  });

  User.prototype.toJSON = function () {
    with(this.get()) {
      return {
        idUser,
        displayName,
        username,
        picture,
        // UserGoogle,
        // UserTwitch,
        // UserFacebook,
        // UserDiscord,
        // profilePath,
      };
    }
  }

  User.associate = (models) => {
    return Promise.all([
      models.User.hasOne(models.UserGoogle, {
        foreignKey: 'idUser',
        targetKey: 'idUser',
      }),
      models.User.hasOne(models.UserDiscord, {
        foreignKey: 'idUser',
        targetKey: 'idUser',
      }),
      models.User.hasOne(models.UserFacebook, {
        foreignKey: 'idUser',
        targetKey: 'idUser',
      }),
      models.User.hasOne(models.UserTwitch, {
        foreignKey: 'idUser',
        targetKey: 'idUser',
      }),
    ]);
  };

  return User;
};
