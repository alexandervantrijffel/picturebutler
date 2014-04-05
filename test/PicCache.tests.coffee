assert = require "assert"
should = require "should"
PicCache = require("../pics/PicCache").PicCache

describe 'PicCache', ->
	describe 'getNext', ->
		it 'should return next items', ->
			p = new PicCache
			p.add [{_id:1, postedAt: new Date 79,7,18},{_id:2, postedAt: new Date 79,7,17},{_id:3, postedAt: new Date 79,7,16}]
			result = p.getNext 2,5
			result.length.should.be.equal 1
			result[0]._id.should.be.equal 3
	describe 'add', ->
		it 'should contain a single instance of items that are inserted multiple times', ->
			p = new PicCache
			p.add [{_id:1, postedAt: new Date 79,7,18},{_id:2, postedAt: new Date 79,7,17},{_id:3, postedAt: new Date 79,7,16}]
			p.add [{_id:2, postedAt: new Date 79,7,17},{_id:3, postedAt: new Date 79,7,16}]
			p.items.length.should.be.equal 3
			p.items[2]._id.should.be.equal 3
		it 'should order on postedAt', ->
			p = new PicCache
			p.add [{_id:1, postedAt: new Date 79,7,18},{_id:2, postedAt: new Date 79,7,16},{_id:3, postedAt: new Date 79,7,19}]
			p.items[0]._id.should.be.equal 3

			p.add [{_id:2, postedAt: new Date 79,7,20},{_id:5, postedAt: new Date 79,7,21}]
			p.items[0]._id.should.be.equal 5,"id 5 has the newest date so that should be the first in the array"
			p.items[1]._id.should.be.equal 2,"replaced id 2 with a more recent date"
