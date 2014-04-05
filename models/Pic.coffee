db = require('../lib/db')
require('mongoose-long')(db.mongoose)

PicSchema = new db.Schema
	src: {type: String, required: true, unique: true}
	postedAt: {type: Date, required: true}
	meta:
		updatedAt: 
			type: Date
			default: Date.now

PicSchema.pre 'save', (next) ->
      this.meta.updatedAt = undefined
      next()

module.exports.Pic = db.mongoose.model 'Pic', PicSchema