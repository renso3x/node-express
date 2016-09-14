var express = require('express');
var router = express.Router();
const book = require('../models/book');

/* GET home page. */
router.get('/', function(req, res, next) {
	book.find({}, {}, function(err, books) {
		if ( err ) throw err;

		books.forEach(function(book) {
			book.truncate = book.truncate(150);
		});

		const data =  {title: 'Home', books: books};
		res.render('index', data);
	});
});

router.get('/details/:id', function(req, res, next) {
  res.render('books/details', { title: 'Home' });
});


module.exports = router;
