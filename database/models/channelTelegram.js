module.exports = (sequelize, Sequelize) => {
  const ChannelTelegram = sequelize.define('ChannelTelegram', {
    idChannelProvider: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    idUserProvider: {
      type: Sequelize.BIGINT.UNSIGNED,
      unique: false,
      allowNull: false,
    },
    title: Sequelize.STRING,
    type: Sequelize.STRING,
    secret: Sequelize.STRING,
    salt: Sequelize.STRING,
    lastCommandAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: () => new Date(),
    },
  }, {
    freezeTableName: true,
  })

  // Class Method
  ChannelTelegram.associate = (models) => Promise.all([
    models.ChannelTelegram.belongsTo(models.UserTelegram, {
      foreignKey: 'idUserProvider',
    }),
  ])
  return ChannelTelegram
}
