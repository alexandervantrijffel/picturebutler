config = require './config.global'

config.twitter_settings =
  consumer_key: ''
  consumer_secret: ''
  access_token_key: ''
  access_token_secret: ''

config.picsPerBatch = 5

module.exports.config = config

module.exports.debug = false
