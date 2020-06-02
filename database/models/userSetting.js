const uuid = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const UserSetting = sequelize.define(
    'UserSetting', {
      idUserSetting: {
        type: Sequelize.UUID,
        defaultValue: () => uuid.v4(),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      idUser: {
        type: Sequelize.UUID,
        unique: false,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: true,
        get() {
          if (this.getDataValue('value') !== undefined) {
            return JSON.parse(this.getDataValue('value'))
          }
          return null
        },
        set(value) {
          return this.setDataValue('value', JSON.stringify(value))
        },
      },
    },
    {
      freezeTableName: true,
    },
  )

  UserSetting.associate = (models) => Promise.all([
    models.UserSetting.belongsTo(models.User, {
      foreignKey: 'idUser',
      targetKey: 'idUser',
    }),
  ])

  return UserSetting
}
