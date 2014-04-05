var NotFound, config;

config = require('../config');

module.exports.logErrors = function(err, req, res, next) {
  console.error('logErrors caught error', err.stack);
  return next(err);
};

module.exports.pageNotFoundHandler = function(req, res) {
  console.log('page not found handler returning 404');
  res.status(404);
  if (req.accepts('html')) {
    return res.render('404', {
      url: req.url
    });
  }
  if (req.accepts('json')) {
    return res.send({
      error: 'Not found'
    });
  }
  return res.type('txt').send('Not found');
};

module.exports.clientErrorHandler = function(err, req, res, next) {
  if (req.xhr) {
    console.error('clientErrorHandling returning error', err);
    return res.send(500, {
      error: 'Some Thing Wong'
    });
  } else {
    return next(err);
  }
};

module.exports.errorHandler = function(err, req, res, next) {
  var extended;
  if (err instanceof NotFound) {
    console.log('rendering 404, err: ', err);
    return res.end(JSON.stringify({
      error: "404 resource not found"
    }));
  } else {
    console.error('rendering 500 for error', err);
    extended = config.debug ? ': ' + err : '';
    return res.end(JSON.stringify({
      error: "500 internal server error" + extended
    }));
  }
};

module.exports.onUncaughtException = function(err) {
  console.error('Uncaught exception: ', err);
  return process.exit(1);
};

NotFound = function(msg) {
  this.name = "NotFound";
  Error.call(this, msg);
  return Error.captureStackTrace(this, arguments_.callee);
};

/*
//@ sourceMappingURL=errorhandling.js.map
*/