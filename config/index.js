var cfg, env;

env = process.env.NODE_ENV && process.env.NODE_ENV.trim() || 'development';

console.log("Using configuration file config." + env);

cfg = require("./config." + env);

module.exports = cfg.config;

/*
//@ sourceMappingURL=index.js.map
*/