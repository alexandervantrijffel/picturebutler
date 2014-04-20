Pic = require('../models/Pic').Pic
_ = require 'underscore'
fs = require 'fs'
require('coffee-trace')

picCache = new (require('./PicCache').PicCache)
lastRefresh = undefined
picsPerBatch = 10

createImage = (src)->
	Pic.create
		src: src
		postedAt: Date.now()
		 , (err, thePic) ->
		 	if err console.error then "Cannot add picture: #{err}"
		 	console.log "pic added to db with id #{thePic.id}"

setJson = (res) ->
	res.setHeader 'Content-Type', 'application/json'

loadItems = (callback) ->
	Pic
		.find {}, 'id src postedAt', 
			skip: 0
			limit: 100
			sort: 
				postedAt: -1
		, (err, pics) ->
			picCache.add pics
			lastRefresh = Date.now()
			callback picCache.getStart			

getStartBatch = (res,callback) ->
	if !lastRefresh || (Date.now() - lastRefresh) / 1000 > 120 || !picCache.items.length # 2 minutes
		console.log 'refreshing cache'
		loadItems (items) ->
			callback(picCache.getStart picsPerBatch)
	else
		callback(picCache.getStart picsPerBatch)

sendStartBatch = (res) ->
	getStartBatch res,(items) ->
		res.send items

sendNextBatch = (req, res) ->
	next = picCache.getNext req.body.fromId, picsPerBatch
	if !next || !next.length
		console.error "WARNING: getNext returned 0 items for id",req.body.fromId
		sendStartBatch res
	else if next.length < picsPerBatch
		getStartBatch res, (items) ->
			if !items
				items = []
			res.send next.concat items.slice 0,picsPerBatch-next.length
	else	
		res.send next

exports.index = (req, res, next) ->
	setJson res
	sendStartBatch res

exports.create = (req, res) ->
	createImage req.body.src	
	res.end "operation queued"

exports.next = (req, res) ->
	setJson res
	if !req.body.fromId
		console.log '/pics/next no fromId supplied, returning from start'
		return sendStartBatch res
	if !picCache.items.length
		console.log '/pics/next no items in cache, returning from start'
		loadItems (items) ->
			sendNextBatch req, res
	else
		sendNextBatch req, res