var MemoryStore, Resource, app, config, errorHandling, express, http, iced, pics, server;

require('coffee-script/register');

config = require("./config");

iced = require('iced-coffee-script').iced;

http = require("http");

errorHandling = require('./lib/errorhandling');

Resource = require('express-resource');

pics = require('./pics/index');

express = require("express");

MemoryStore = express.session.MemoryStore;

app = express();

app.debug = config.debug;

app.set("port", process.env.PORT || 3001).use(express.logger("dev")).use(express.cookieParser()).use(express.bodyParser()).use(express.methodOverride()).use(express.session({
  secret: "secreetbro",
  key: "express.sid",
  store: new MemoryStore()
})).use('/api', app.router).configure('development', function() {});

app.use(express.errorHandler({
  dumpExceptions: true,
  showStack: true
})).use(errorHandling.logErrors).use(errorHandling.pageNotFoundHandler).use(errorHandling.clientErrorHandler).use(errorHandling.errorHandler);

app.resource('pics', require('./pics'));

app.get("/pics/next", pics.next);

server = http.createServer(app);

server.listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});

console.log("Listening on http://127.0.0.1:" + app.get("port"));

module.exports.app = app;

process.on('uncaughtException', function(err) {
  return errorHandling.onUncaughtException(err);
});

/*
//@ sourceMappingURL=app.js.map
*/