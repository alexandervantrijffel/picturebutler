{EventEmitter} = require 'events'

class Dispatcher extends EventEmitter
    send: (name, data) =>
        console.log "dispatcher emits event #{name} with data", data
        @emit name, data

instance = new Dispatcher()
module.exports = instance
