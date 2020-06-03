const uuid = require('uuid')

module.exports = (sequelize, Sequelize) => {
  const ChatMessage = sequelize.define(
    'ChatMessage',
    {
      idChatMessage: {
        type: Sequelize.UUID,
        defaultValue: () => uuid.v4(),
        primaryKey: true,
        unique: true,
        allowNull: false,
      },
      idChatMessageProvider: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      idChat: {
        type: Sequelize.UUID,
        unique: false,
        allowNull: false,
      },
      idUser: {
        type: Sequelize.UUID,
        unique: false,
        allowNull: false,
      },
      idAuthorProvider: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      provider: {
        // youtube, twitch, facebook
        type: Sequelize.STRING,
        allowNull: false,
      },
      displayName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
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
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      doneAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    },
  )

  // Class Method
  ChatMessage.associate = (models) => Promise.all([
    models.ChatMessage.belongsTo(models.User, { foreignKey: 'idUser' }),
    models.ChatMessage.belongsTo(models.Chat, { foreignKey: 'idChat' }),
  ])
  return ChatMessage
}
