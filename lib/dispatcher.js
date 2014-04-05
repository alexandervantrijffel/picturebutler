var Dispatcher, EventEmitter, instance,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

EventEmitter = require('events').EventEmitter;

Dispatcher = (function(_super) {
  __extends(Dispatcher, _super);

  function Dispatcher() {
    this.send = __bind(this.send, this);
    return Dispatcher.__super__.constructor.apply(this, arguments);
  }

  Dispatcher.prototype.send = function(name, data) {
    console.log("dispatcher emits event " + name + " with data", data);
    return this.emit(name, data);
  };

  return Dispatcher;

})(EventEmitter);

instance = new Dispatcher();

module.exports = instance;

/*
//@ sourceMappingURL=dispatcher.js.map
*/