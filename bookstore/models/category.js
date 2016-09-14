const mongoose = require('mongoose');
const db = mongoose.connection;

const categoryModel = function() {
	const categorySchema = mongoose.Schema({
		name: String,
	});

	return mongoose.model('Category', categorySchema);
};

module.exports = new categoryModel();