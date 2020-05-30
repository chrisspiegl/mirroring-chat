const uuid = require('uuid')
const _ = require('lodash')

module.exports = (sequelize, Sequelize) => {
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
        if (this.getDataValue('settings') !== undefined) {
          return JSON.parse(this.getDataValue('settings'))
        }
        return {}
      },
      set(value) {
        return this.setDataValue('settings', JSON.stringify(value))
      },
    },
    adminSuper: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    activatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
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
      profilePath() {
        const identifier = this.getDataValue('username') ? this.getDataValue('username') : this.getDataValue('idUser')
        return `/@${identifier}`
      },
    },
  })

  User.prototype.toJSON = function toJSON() {
    const pick = _.pick(this.get(), [
      'idUser',
      'displayName',
      'username',
      'picture',
      'activatedAt',
      'lastLogin',
      'lastActive',
      'adminSuper',
    ])
    return pick
  }

  User.associate = (models) => Promise.all([
    models.User.hasOne(models.UserDiscord, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasOne(models.UserFacebook, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasOne(models.UserGoogle, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasOne(models.UserTelegram, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasOne(models.UserTwitch, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasMany(models.Chat, { foreignKey: 'idUser', targetKey: 'idUser' }),
    models.User.hasMany(models.ChatMessage, { foreignKey: 'idUser', targetKey: 'idUser' }),
  ])

  return User
}
