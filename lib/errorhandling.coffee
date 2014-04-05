config = require '../config'

module.exports.logErrors = (err, req, res, next) ->
  console.error 'logErrors caught error',err.stack
  next err

module.exports.pageNotFoundHandler = (req, res) ->
  console.log 'page not found handler returning 404'
  res.status(404)

  #// respond with html page
  if (req.accepts 'html')
    return res.render('404', { url: req.url })

  #// respond with json
  if (req.accepts 'json')
    return res.send({ error: 'Not found' })

  #// default to plain-text. send()
  res.type('txt').send 'Not found'

module.exports.clientErrorHandler =  (err, req, res, next) ->
  if req.xhr
    console.error 'clientErrorHandling returning error', err
    res.send 500, {error: 'Some Thing Wong'}
  else
    next err

module.exports.errorHandler =  (err, req, res, next) ->
  if err instanceof NotFound
    console.log 'rendering 404, err: ', err
    return res.end JSON.stringify error:"404 resource not found"
    # res.render '404.jade',
    #     title : '404 - Not Found'
    #     description: ''
    #     author: ''
    #     analyticssiteid: 'XXXXXXX'
    #     status: 404
  else
    console.error 'rendering 500 for error', err
    extended = if config.debug then ': ' + err else ''
    return res.end JSON.stringify error:"500 internal server error" + extended
    # res.render '500.jade',
    #     title : 'The Server Encountered an Error'
    #     description: 'Sum Thing Wong'
    #     author: ''
    #     analyticssiteid: 'XXXXXXX'
    #     error: err
    #     status: 500

module.exports.onUncaughtException = (err) ->
    console.error 'Uncaught exception: ', err
    process.exit(1)


NotFound = (msg) ->
  @name = "NotFound"
  Error.call this, msg
  Error.captureStackTrace this, arguments_.callee

