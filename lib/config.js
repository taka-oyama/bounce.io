module.exports = {
  // engine.io config
  port: 3000,
  pingTimeout: 30000,
  pingInterval: 10000,
  transports: ['websocket'],

  // adapter config
  redis: {
    key: "bounce.io",
    host: "localhost",
    port: 6379,
    db: 1
  }
};
