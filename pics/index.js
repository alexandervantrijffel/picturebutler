var Pic, createImage, fs, getStartBatch, lastRefresh, loadItems, picCache, picsPerBatch, sendNextBatch, sendStartBatch, setJson, _;

Pic = require('../models/Pic').Pic;

_ = require('underscore');

fs = require('fs');

require('coffee-trace');

picCache = new (require('./PicCache').PicCache);

lastRefresh = void 0;

picsPerBatch = 10;

createImage = function(src) {
  return Pic.create({
    src: src,
    postedAt: Date.now()
  }, function(err, thePic) {
    if (err(console.error)) {
      "Cannot add picture: " + err;
    }
    return console.log("pic added to db with id " + thePic.id);
  });
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

getStartBatch = function(res, callback) {
  if (!lastRefresh || (Date.now() - lastRefresh) / 1000 > 120 || !picCache.items.length) {
    console.log('refreshing cache');
    return loadItems(function(items) {
      return callback(picCache.getStart(picsPerBatch));
    });
  } else {
    return callback(picCache.getStart(picsPerBatch));
  }
};

sendStartBatch = function(res) {
  return getStartBatch(res, function(items) {
    return res.send(items);
  });
};

sendNextBatch = function(req, res) {
  var next;
  next = picCache.getNext(req.body.fromId, picsPerBatch);
  if (!next || !next.length) {
    console.error("WARNING: getNext returned 0 items for id", req.body.fromId);
    return sendStartBatch(res);
  } else if (next.length < picsPerBatch) {
    return getStartBatch(res, function(items) {
      if (!items) {
        items = [];
      }
      return res.send(next.concat(items.slice(0, picsPerBatch - next.length)));
    });
  } else {
    return res.send(next);
  }
};

exports.index = function(req, res, next) {
  setJson(res);
  return sendStartBatch(res);
};

exports.create = function(req, res) {
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
    console.log('/pics/next no items in cache, returning from start');
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