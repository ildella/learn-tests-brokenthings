module.exports = {
  apps: [
    {
      name: 'gateway',
      script: 'gateway/gateway.js',
      env_watch: {watch: '../gateway'},
      max_restarts: 5,
    },
    {
      name: 'api',
      script: './src/server.js',
      env_watch: {watch: './src/api'},
      port: process.env.APP_PORT,
      kill_timeout: 2200,
      wait_ready: true,
      listen_timeout: 3000,
      max_restarts: 5
    },
  ]
}
