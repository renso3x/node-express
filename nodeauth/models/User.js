const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth');
const db = mongoose.connection;

// Model Schema
const UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		required: true,
		type: String,
		bcrypt: true
	},
	email: {
		required: true,
		type: String,
	},
	name: {
		type: String
	},
	profileimage: { 
		type: String
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, cb) {
	bcrypt.hash(newUser.password, 10, function(err, hash) {
		if ( err ) throw err;
		newUser.password = hash;
		newUser.save(cb);//store in DB
	});
}

module.exports.getUserByUsername = function(username, cb) {
	let query = {username: username};
	User.findOne(query, cb);
}

module.exports.comparePassword = function(candidatePassword, hash, cb) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
}

module.exports.getUserById = function(id, cb) {
	User.findById(id, cb);
}