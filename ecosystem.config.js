module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "mir-chat",
      append_env_to_name: true,
      script: "./server/index.js",
      watch: false,
      exec_mode: "cluster",
      // instances: (process.env.NODE_ENV == "production" || process.env.NODE_ENV == "development") ? "max" : 1,
      instances: 1,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_PATH: ".",
        NODE_ENV: "local",
        DEBUG: "simic:*",
      },
      env_production: {
        NODE_PATH: ".",
        NODE_ENV: "production",
        DEBUG: "simic:*",
      },
      env_development: {
        NODE_PATH: ".",
        NODE_ENV: "development",
        DEBUG: "simic:*",
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: "deploy",
      host: "swMain",
      ref: "origin/master",
      repo: "git@github.com:chrisspiegl/mirroring-chat.git",
      path: "/home/deploy/mirroring-chat-production",
      "post-deploy": "npm run nsinstall && npm run nsupdate && NODE_ENV=production pm2 reload ecosystem.config.js --only mir-chat-web --env production",
    },
    development: {
      user: "deploy",
      host: "swMain",
      // ref: "origin/development",
      ref: "origin/master",
      repo: "git@github.com:chrisspiegl/mirroring-chat.git",
      path: "/home/deploy/mirroring-chat-development",
      "post-deploy": "npm run nsinstall && npm run nsupdate && NODE_ENV=development pm2 reload ecosystem.config.js --only mir-chat-web --env development",
    },
  },
}
