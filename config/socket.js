module.exports = {
  // engine.io config
  port: 8080,
  pingTimeout: 30000,
  pingInterval: 10000,

  // adapter config
  redis: {
    key: "bounce.io",
    host: "localhost",
    port: 6379,
    db: 1
  }
};
