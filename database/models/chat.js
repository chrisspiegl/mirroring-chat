const uuid = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const Chat = sequelize.define('Chat', {
    idChat: {
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
    idChatProvider: {
      // YouTube: linkable broadcast id
      // Twitch: channelname (#spieglio without the #)
      // Facebook linkable broadcast id
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    provider: {
      // youtube, twitch, facebook
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      // YouTube: broadcast title
      // Twitch: username
      // Facebook: broadcast title
      type: Sequelize.STRING,
      allowNull: false,
    },
    providerObject: {
      type: Sequelize.TEXT,
      allowNull: false,
      get() {
        if (this.getDataValue('providerObject') !== undefined) {
          return JSON.parse(this.getDataValue('providerObject'))
        }
        return {}
      },
      set(value) {
        return this.setDataValue('providerObject', JSON.stringify(value))
      },
    },
    status: {
      // active, upcoming, past, permanent
      type: Sequelize.STRING,
      allowNull: false,
    },
    isPermanent: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isTracked: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  }, {
    freezeTableName: true,
  })

  // Class Method
  Chat.associate = (models) => Promise.all([
    models.Chat.belongsTo(models.User, { foreignKey: 'idUser' }),
    models.Chat.hasMany(models.ChatMessage, { foreignKey: 'idChat' }),
  ])
  return Chat
}
