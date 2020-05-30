const _ = require('lodash')

module.exports = (sequelize, Sequelize) => {
  const UserTelegram = sequelize.define('UserTelegram', {
    idUserProvider: {
      type: Sequelize.BIGINT.UNSIGNED,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    idUser: {
      type: Sequelize.UUID,
      unique: false,
      allowNull: true,
    },
    username: Sequelize.STRING,
    displayName: Sequelize.STRING,
    nameFirst: Sequelize.STRING,
    nameLast: Sequelize.STRING,
    languageCode: Sequelize.STRING,
    lastLogin: {
      type: Sequelize.DATE,
      defaultValue: () => new Date(),
      allowNull: false,
    },
    deactivatedAt: {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
    },
  }, {
    freezeTableName: true,
  })

  UserTelegram.prototype.toJSON = function toJSON() {
    const pick = _.pick(this.get(), [
      'idUserProvider',
      'idUser',
      'displayName',
      'username',
      'nameFirst',
      'nameLast',
    ])
    pick.provider = 'telegram'
    return pick
  }

  // Class Method
  UserTelegram.associate = (models) => Promise.all([
    models.UserTelegram.belongsTo(models.User, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.UserTelegram.hasMany(models.ChannelTelegram, { foreignKey: 'idUserProvider' }),
  ])
  return UserTelegram
}
