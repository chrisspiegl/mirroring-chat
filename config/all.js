path = require('path')

module.exports = {
  env: process.env.NODE_ENV,
  envShort: (process.env.NODE_ENV) ? process.env.NODE_ENV.substring(0, 3) : undefined,
  name: 'mirroring.chat',
  slug: 'simic',
  slugShort: 'mic',
  version: require('package.json').version,

  root: path.normalize(`${__dirname}/..`),

  secrets: {
    session: 'REPLACE WITH RANDOM KEY',
    jwt: 'REPLACE WITH RANDOM KEY',
  },

  database: {
    path: path.join(path.normalize(`${__dirname}/..`), 'data/'), // Used for logs and file storage in `/data` folder
    sequelize: {
      dialect: undefined,
      username: undefined,
      password: undefined,
      database: undefined,
      host: undefined,
      storage: undefined,
      logging: false,
      dialectOptions: {
        supportBigNumbers: true,
      },
      define: {
        freezeTableName: true,
        charset: 'utf8mb4',
        dialectOptions: {
          collate: 'utf8_general_ci',
        },
      },
    },

    redis: {
      host: '127.0.0.1',
      port: 6379,
      options: {},
    },
  },

  server: {
    port: process.env.PORT || 3000,
    portPublic: process.env.PORT || 3000,
    address: '127.0.0.1',
    hostname: 'localhost',
    protocol: 'http',
    protocolPublic: 'https',
  },

  pushnotice: {
    disabled: true,
    chat: {
      id: undefined,
      secret: undefined,
    },
  },

  passport: {
    facebook: {
      clientId: undefined,
      clientSecret: undefined,
      scope: [
        'user_friends',
        'pages_manage_metadata',
      ],
    },
    twitch: {
      clientId: undefined,
      clientSecret: undefined,
      scope: 'user:read:email channel:moderate chat:edit chat:read',
      botname: 'mirroringbot',
    },
    discord: {
      clientId: undefined,
      clientSecret: undefined,
      scope: ['identify', 'email', 'bot'],
      permissions: 84992, // View Channels, Send Messages, Embed Links, Read Message History
    },
    google: {
      clientId: undefined,
      clientSecret: undefined,
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
    },
    telegram: {
      mirroringChatBot: {
        clientId: undefined,
      },
    },
  },

}
