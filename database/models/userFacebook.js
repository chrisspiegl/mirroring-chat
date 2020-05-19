const _ = require('lodash')

module.exports = (sequelize, Sequelize) => {
  const UserFacebook = sequelize.define('UserFacebook', {
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
  })

  UserFacebook.prototype.toJSON = function toJSON() {
    const pick = _.pick(this.get(), [
      'idUserProvider',
      'idUser',
      'displayName',
      'picture',
    ])
    pick.provider = 'facebook'
    return pick
  }

  UserFacebook.associate = (models) => Promise.all([
    models.UserFacebook.belongsTo(models.User, {
      foreignKey: 'idUser',
      targetKey: 'idUser',
    }),
  ])

  return UserFacebook
}
