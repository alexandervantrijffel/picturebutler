This Node.js app listens to Twitter mentions for a configured Twitter account. New mentions are stored in the database by twitter_listener and processed by twitter_handler.

The twitter_handler module parses the mention text. If a known command is sent to the account, the twitter_handler fulfills the request. 

To run the module, create a Twitter application on https://dev.twitter.com and enter the consumer_key and consumer_secret of your application in the configuration file. Use config/config.development.coffee for the development environment and config/production.coffee for the production environment. Also enter the access_token and access_token_secret of the account for which the twitter_enganger will listen to mentions. The access token can be retrieved by logging in with Twitter to an app that supports oauth, for instance by using the Node.js Passport module.

Alexander van Trijffel