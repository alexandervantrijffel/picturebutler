mongoose = require 'mongoose'
config = require '../config'
Schema = mongoose.Schema

module.exports.mongoose = mongoose
module.exports.Schema = Schema

console.log "connecting to database #{config.mongo.db} at uri #{config.mongo.host}:#{config.mongo.port}\n"
credentials = config.mongo.username &&
    config.mongo.password &&
    "#{config.mongo.username}:#{config.mongo.password}@" || ''
mongoose.connect "mongodb://#{credentials}#{config.mongo.host}:#{config.mongo.port}/#{config.mongo.db}"

module.exports.disconnect = ->
  mongoose.disconnect
