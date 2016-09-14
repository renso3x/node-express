var express = require('express');
var router = express.Router();
const book = require('../models/book');
const category = require('../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('manage/dashboard', { title: 'Dashboard' });
});

router.get('/add-books', function(req, res, next) {
	category.find({}, function(err, categories) {
		if ( err ) throw err;

		const model = {
			categories: categories,
			csrfToken: req.csrfToken()
		};

		res.render('manage/add_book', model);
	});
});

router.post('/add-books', function(req, res) {
	const title = req.body.title && req.body.title.trim();
	const category = req.body.category && req.body.category.trim();
	const author = req.body.author && req.body.author.trim();
	const publisher = req.body.publisher && req.body.publisher.trim();
	const price = req.body.price && req.body.price.trim();
	const description = req.body.description && req.body.description.trim();

	if ( req.files.mainimage ) {
		const mainImageOriginalName = req.files.mainimage.originalname;
		mainImageName = req.files.mainimage.name;
		const mainImageMime = req.files.mainimage.mimetype;
		const mainImagePath	= req.files.mainimage.path;
		const mainImageExt	= req.files.mainimage.extension;
		const mainImageSize	= req.files.mainimage.size;
	} else {
		mainImageName = 'noimage.png';
	}


	if ( title == '' || price == '' ) {
		req.flash('error', 'Please fill out required fields');
		res.location('/manage/books/add');
		res.redirect('/manage/books/add');
	}

	if ( isNaN(price) ) {
		req.flash('error', 'Price must be a number');
		res.location('/manage/books/add');
		res.redirect('/manage/books/add');
	}

	const newBook = new book ({
		title: title,
		description: description,
		category: category,
		author: author,
		publisher: publisher,
		price: price,
		cover: mainImageName
	});

	newBook.save(function(err) {
		if ( err ) {
			console.log('save error', err);
		}

		req.flash('success', "Book added");
		res.location('/manage/books');
		res.redirect('/manage/books');
	});
});

//edit books
router.get('/book/edit/:id', function(req, res) {
	category.find({}, function(err, categories) {
		book.findOne({_id: req.params.id}, function(err, book) {
			if ( err ) console.log(err);

			const model = {
				book: book,
				categories: categories,
				csrfToken: req.csrfToken()
			};

			res.render('manage/edit_book', model);
		});
	})
});

router.post('/book/edit/:id', function(req, res) {
	const title = req.body.title && req.body.title.trim();
	const category = req.body.category && req.body.category.trim();
	const author = req.body.author && req.body.author.trim();
	const publisher = req.body.publisher && req.body.publisher.trim();
	const price = req.body.price && req.body.price.trim();
	const description = req.body.description && req.body.description.trim();

	if ( req.files.mainimage ) {
		const mainImageOriginalName = req.files.mainimage.originalname;
		mainImageName = req.files.mainimage.name;
		const mainImageMime = req.files.mainimage.mimetype;
		const mainImagePath	= req.files.mainimage.path;
		const mainImageExt	= req.files.mainimage.extension;
		const mainImageSize	= req.files.mainimage.size;
	} else {
		mainImageName = 'noimage.png';
	}

	if ( title == '' || price == '' ) {
		req.flash('error', 'Please fill out required fields');
		res.location('/manage/books/add');
		res.redirect('/manage/books/add');
	}

	if ( isNaN(price) ) {
		req.flash('error', 'Price must be a number');
		res.location('/manage/books/add');
		res.redirect('/manage/books/add');
	}

	const updateBook = {
		title: title,
		description: description,
		author: author,
		category: category,
		publisher: publisher,
		price: price,
		cover: mainImageName
	};

	book.update({_id: req.params.id}, updateBook, 
		function(err) {
			if ( err ) {
				console.log('save error', err);
			}

			req.flash('success', "Book Updated");
			res.location('/manage/books');
			res.redirect('/manage/books');
		}
	);
});

router.get('/books', function(req, res, next) {
	book.find({}, function(err, books) {
		if ( err ) throw err;

		const model = {
			title: 'Books',
			books: books
		};

		res.render('manage/books', model);
	});
});

router.get('/book/delete/:id', function(req,res) {
	book.remove({_id: req.params.id}, function(err) {
		if ( err ) console.log(err);

		req.flash('success', 'Book deleted');
		res.location('/manage/books');
		res.redirect('/manage/books');
	});
});

router.get('/add-category', function(req, res, next) {
	res.render('manage/add_category', {
		csrfToken: req.csrfToken()
	});
});

router.post('/add-category', function(req, res, next) {
	const name = req.body.name && req.body.name.trim();

	if ( name == '' ) {
		req.flash('error', 'Please fill out required fields');
		res.location('/manage/add-category');
		res.redirect('/manage/add-category');
	}

	const newCategory = new category ({
		name: name,
	});

	newCategory.save(function(err) {
		if ( err ) {
			console.log('save error', err);
		}

		req.flash('success', "Category added");
		res.location('/manage/categories');
		res.redirect('/manage/categories');
	});
});

router.get('/category/edit/:id', function(req, res, next) {
	category.findOne({_id: req.params.id}, function(err, category) {
		if ( err ) throw err;

		res.render('manage/edit_category', { 
			category: category, 
			csrfToken: req.csrfToken()
		 });
	});
});

router.post('/category/edit/:id', function(req, res, next) {
	const name = req.body.name && req.body.name.trim();

	if ( name == '' ) {
		req.flash('error', 'Please fill out required fields');
		res.location('/manage/edit-category');
		res.redirect('/manage/edit-category');
	}

	category.update({_id: req.params.id}, {name: name}, function(err) {
		if ( err ) {
			console.log('save error', err);
		}

		req.flash('success', "Category updated");
		res.location('/manage/categories');
		res.redirect('/manage/categories');
	});
});

router.get('/category/delete/:id', function(req, res, next) {
	category.remove({_id: req.params.id}, function(err, category) {
		if ( err ) throw err;

		req.flash('success', 'Category deleted');
		res.location('/manage/categories');
		res.redirect('/manage/categories');
	});
});

router.get('/categories', function(req, res, next) {
	category.find({}, function(err, categories) {
		if ( err ) throw err;

		const model = {
			title: 'Categories',
			categories: categories
		};

		res.render('manage/categories', model);
	});
});


module.exports = router;
