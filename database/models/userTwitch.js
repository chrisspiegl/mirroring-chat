const _ = require('lodash')

module.exports = (sequelize, Sequelize) => {
  const UserTwitch = sequelize.define('UserTwitch', {
    idUserProvider: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    idUser: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
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
  })

  UserTwitch.prototype.toJSON = function toJSON() {
    const pick = _.pick(this.get(), [
      'idUserProvider',
      'idUser',
      'displayName',
      'username',
      'picture',
    ])
    pick.provider = 'twitch'
    return pick
  }

  UserTwitch.associate = (models) => Promise.all([
    models.UserTwitch.belongsTo(models.User, {
      foreignKey: 'idUser',
      targetKey: 'idUser',
    }),
  ])

  return UserTwitch
}
