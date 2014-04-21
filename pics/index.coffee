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
		 	if err then return console.error "Cannot add picture: #{err}"
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
			callback picCache.getStart	picsPerBatch

getStartBatch = (res,callback) ->
	if true || !lastRefresh || (Date.now() - lastRefresh) / 1000 > 120 || !picCache.items.length # 2 minutes
		console.log 'refreshing cache'
		loadItems (items) ->
			callback items
	else
		callback picCache.getStart picsPerBatch

sendCollection = (res, items) ->
	res.send 
		images: items

sendNextBatch = (req, res) ->
	next = picCache.getNext req.body.fromId, picsPerBatch
	if !next || !next.length
		console.error "WARNING: getNext returned 0 items for id",req.body.fromId
		getStartBatch res,(items) ->
			sendCollection res,items
	else if next.length < picsPerBatch
		getStartBatch res, (items) ->
			if !items
				items = []
			sendCollection res,next.concat items.slice 0,picsPerBatch-next.length
	else	
		sendCollection res,next

exports.index = (req, res, next) ->
	setJson res
	getStartBatch res,(items) ->
		sendCollection res,items

exports.create = (req, res) ->
	createImage req.body.src	
	res.end "operation queued"

exports.next = (req, res) ->
	setJson res
	if !req.body.fromId
		console.log '/pics/next no fromId supplied, returning from start'
		return getStartBatch res,(items) ->
			sendCollection res,items
	if !picCache.items.length
		console.log '/pics/next no items in cache, returning from start'
		loadItems (items) ->
			sendNextBatch req, res
	else
		sendNextBatch req, res