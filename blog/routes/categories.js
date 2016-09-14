const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');


router.get('/show/:category', function(req, res, next) {
	const db = req.db;
	const post = db.get('posts');

	post.find({category: req.params.category}, {}, function(err, posts) {
		res.render('index', {
			title: req.params.category,
			posts: posts
		});
	})
});

router.get('/add', function(req, res, next) {
	res.render('add_category', {
		title: 'Add Categoy'
	});
});

router.post('/add', function(req, res, next) {
	const title = req.body.title;

	req.checkBody('title', 'Title field is required.').notEmpty();

	const errors = req.validationErrors();

	if ( errors ) {
		res.render('add_category', {
			errors: errors,
			title: title
		});
	} else {
		const category = db.get('categories');

		category.insert({
			title: title
		}, function(err, categories) {
			if ( err )  {
				res.send("There was an issue submitting the post");
			} else {
				req.flash('success', 'Category submitted');
				res.location('/');
				res.redirect('/');
			}
		})
	}
});

module.exports = router;