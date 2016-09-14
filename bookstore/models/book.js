const mongoose = require('mongoose');
const db = mongoose.connection;

const bookModel = function() {
	const bookSchema = mongoose.Schema({
		title: String,
		description: String,
		category: String,
		author: String,
		publisher: String,
		price: Number,
		cover: String
	});
	// shorten text
	bookSchema.methods.truncate = function(length) {
		return this.description.substring(0, length);
	};

	return mongoose.model('Book', bookSchema);
};

module.exports = new bookModel();