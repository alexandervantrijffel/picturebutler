var PicCache, find, get_type, _,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

_ = require('underscore');

find = function(collection, test) {
  var i, _i, _ref;
  for (i = _i = 0, _ref = collection.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (test(collection[i])) {
      return i;
    }
  }
  return -1;
};

get_type = function(thing) {
  if (thing === null) {
    return "[object Null]";
  }
  return Object.prototype.toString.call(thing);
};

PicCache = (function() {
  function PicCache() {
    this.getNext = __bind(this.getNext, this);
    this.getStart = __bind(this.getStart, this);
    this.add = __bind(this.add, this);
    this.items = [];
  }

  PicCache.prototype.add = function(newItems) {
    var filtered;
    filtered = _.filter(this.items, (function(_this) {
      return function(item) {
        return !_.find(newItems, function(n) {
          return n._id.toString() === item._id.toString();
        });
      };
    })(this));
    return this.items = (_.sortBy(filtered.concat(newItems), function(item) {
      return item.postedAt;
    })).reverse();
  };

  PicCache.prototype.getStart = function(count) {
    return this.items.slice(0, count);
  };

  PicCache.prototype.getNext = function(fromId, count) {
    var index, itemCount, result;
    index = find(this.items, function(item) {
      return item._id.toString() === fromId.toString();
    });
    console.log("searching for picture id " + fromId + " found it at index " + index);
    if (index === -1) {
      return [];
    }
    itemCount = Math.min(count, this.items.length - count);
    if (itemCount < 0) {
      itemCount = this.items.length - index - 1;
    }
    console.log("getNext: returning " + itemCount + " items starting from index " + (index + 1));
    result = this.items.slice(index + 1, index + 1 + itemCount);
    if (!result.length) {
      return this.getStart();
    } else {
      return result;
    }
  };

  return PicCache;

})();

module.exports.PicCache = PicCache;

/*
//@ sourceMappingURL=PicCache.js.map
*/