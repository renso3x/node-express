var express = require('express');
var router = express.Router();
const book = require('../models/book');
const category = require('../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

router.get('/details/:id', function(req, res, next) {
	book.findOne({_id: req.params.id}, function(err, book) {
		if ( err ) throw err;

		var model = {
			book: book
		};
		res.render('books/details', model);
	});
});


module.exports = router;
