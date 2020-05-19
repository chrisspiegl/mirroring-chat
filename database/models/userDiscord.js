const _ = require('lodash')

module.exports = (sequelize, Sequelize) => {
  const UserDiscord = sequelize.define('UserDiscord', {
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

  UserDiscord.prototype.toJSON = function toJSON() {
    const pick = _.pick(this.get(), [
      'idUserProvider',
      'idUser',
      'displayName',
      'picture',
    ])
    pick.provider = 'discord'
    return pick
  }

  UserDiscord.associate = (models) => Promise.all([
    models.UserDiscord.belongsTo(models.User, {
      foreignKey: 'idUser',
      targetKey: 'idUser',
    }),
  ])

  return UserDiscord
}
