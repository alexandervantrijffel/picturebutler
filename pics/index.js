var Pic, createImage, fs, lastRefresh, loadItems, picCache, picsPerBatch, sendNextBatch, sendStartBatch, setJson, _;

Pic = require('../models/Pic').Pic;

_ = require('underscore');

fs = require('fs');

picCache = new (require('./PicCache').PicCache);

lastRefresh = void 0;

picsPerBatch = 10;

createImage = function(src) {
  return Pic.create({
    src: src,
    postedAt: Date.now()
  }, (function(_this) {
    return function(err, thePic) {
      if (err(console.error)) {
        "Cannot add picture: " + err;
      }
      return console.log("pic added to db with id " + thePic.id);
    };
  })(this));
};

setJson = function(res) {
  return res.setHeader('Content-Type', 'application/json');
};

loadItems = function(callback) {
  return Pic.find({}, 'id src postedAt', {
    skip: 0,
    limit: 100,
    sort: {
      postedAt: -1
    }
  }, function(err, pics) {
    picCache.add(pics);
    lastRefresh = Date.now();
    return callback(picCache.getStart);
  });
};

sendStartBatch = function(res) {
  if (!lastRefresh || (Date.now() - lastRefresh) / 1000 > 120) {
    console.log('refreshing cache');
    return loadItems(function(items) {
      return res.send(picCache.getStart(picsPerBatch));
    });
  } else {
    return res.send(picCache.getStart(picsPerBatch));
  }
};

sendNextBatch = function(req, res) {
  var next;
  next = picCache.getNext(req.body.fromId, picsPerBatch);
  if (!next || !next.length) {
    console.error("WARNING: getNext returned 0 items for id", req.body.fromId);
    return sendStartBatch(res);
  } else {
    return res.send(next);
  }
};

exports.index = function(req, res, next) {
  setJson(res);
  return sendStartBatch(res);
};

exports.create = function(req, res) {
  console.log('adding picture', req.body);
  createImage(req.body.src);
  return res.end("operation queued");
};

exports.next = function(req, res) {
  setJson(res);
  if (!req.body.fromId) {
    console.log('/pics/next no fromId supplied, returning from start');
    return sendStartBatch(res);
  }
  if (!picCache.items.length) {
    return loadItems(function(items) {
      return sendNextBatch(req, res);
    });
  } else {
    return sendNextBatch(req, res);
  }
};

/*
//@ sourceMappingURL=index.js.map
*/