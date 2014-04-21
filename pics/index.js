var Pic, config, createImage, fs, getStartBatch, lastRefresh, loadItems, picCache, picsPerBatch, sendCollection, sendNextBatch, setJson, _;

Pic = require('../models/Pic').Pic;

_ = require('underscore');

fs = require('fs');

config = require("../config");

require('coffee-trace');

picCache = new (require('./PicCache').PicCache);

lastRefresh = void 0;

picsPerBatch = config.picsPerBatch;

createImage = function(src, title) {
  return Pic.create({
    src: src,
    title: title,
    postedAt: Date.now()
  }, function(err, thePic) {
    if (err) {
      return console.error("Cannot add picture: " + err);
    }
    return console.log("pic added to db with id " + thePic.id);
  });
};

setJson = function(res) {
  return res.setHeader('Content-Type', 'application/json');
};

loadItems = function(callback) {
  return Pic.find({}, 'id src postedAt title', {
    skip: 0,
    limit: 100,
    sort: {
      postedAt: -1
    }
  }, function(err, pics) {
    picCache.add(pics);
    lastRefresh = Date.now();
    return callback(picCache.getStart(picsPerBatch));
  });
};

getStartBatch = function(res, callback) {
  if (!lastRefresh || (Date.now() - lastRefresh) / 1000 > 120 || !picCache.items.length) {
    console.log('refreshing cache');
    return loadItems(function(items) {
      return callback(items);
    });
  } else {
    return callback(picCache.getStart(picsPerBatch));
  }
};

sendCollection = function(res, items) {
  return res.send({
    images: items
  });
};

sendNextBatch = function(req, res) {
  var next;
  next = picCache.getNext(req.body.fromId, picsPerBatch);
  if (!next || !next.length) {
    console.error("WARNING: getNext returned 0 items for id", req.body.fromId);
    return getStartBatch(res, function(items) {
      return sendCollection(res, items);
    });
  } else if (next.length < picsPerBatch) {
    return getStartBatch(res, function(items) {
      if (!items) {
        items = [];
      }
      return sendCollection(res, next.concat(items.slice(0, picsPerBatch - next.length)));
    });
  } else {
    return sendCollection(res, next);
  }
};

exports.index = function(req, res, next) {
  setJson(res);
  return getStartBatch(res, function(items) {
    return sendCollection(res, items);
  });
};

exports.create = function(req, res) {
  console.log("create body: ", req.body);
  createImage(req.body.src, req.body.title);
  return res.end("operation queued");
};

exports.next = function(req, res) {
  setJson(res);
  console.log("request for next pictures, body: ", req.body);
  if (!req.body.fromId) {
    console.log('/pics/next no fromId supplied, returning from start');
    return getStartBatch(res, function(items) {
      return sendCollection(res, items);
    });
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