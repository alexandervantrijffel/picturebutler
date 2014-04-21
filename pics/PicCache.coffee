_ = require('underscore')

find = (collection, test) ->
	for i in [0...collection.length]
		if test(collection[i]) then return i
	return -1

get_type = (thing) ->
    if(thing==null) then return "[object Null]"
    Object.prototype.toString.call(thing)

class PicCache
	constructor: ->
		@items = []
	
	add: (newItems) =>		 
		filtered = _.filter @items, (item) =>
			return !_.find newItems, (n) ->
				return n._id.toString() == item._id.toString()
		@items = (_.sortBy filtered.concat(newItems), (item) ->
											return item.postedAt
			).reverse()

	getStart: (count) =>
		return @items.slice 0,count

	getNext: (fromId, count) =>
		index = find @items, (item) ->
					return item._id.toString() == fromId.toString()
		console.log "searching for picture id #{fromId} found it at index #{index}"
		if index == -1
			return []
		itemCount = Math.min count,@items.length-count
		if itemCount < 0 then itemCount = @items.length-index-1
		console.log "getNext: returning #{itemCount} items starting from index #{index+1}"
		result = @items.slice index+1,index+1+itemCount
		if !result.length then @getStart() else result

module.exports.PicCache = PicCache