const express = require('express');
const router = express.Router();
const mongo = require('mongodb');
const db = require('monk')('localhost/nodeblog');

router.get('/show/:id', function(req, res, next) {
	const posts = db.get('posts');

	posts.findOne({_id: req.params.id}, function(err, post) {
		console.log(post);
		res.render('show', {
			post:post
		});
	});
});

router.get('/add', function(req, res, next) {
	const categories = db.get('categories');

	//get all categories
	categories.find({}, {}, function(err, categories) {
		res.render('add_post', {
			'title': 'Add Post',
			'categories': categories
		});
	});
});

router.post('/add', function(req, res, next) {
	let mainImageName;

	const title = req.body.title;
	const body = req.body.body;
	const category = req.body.category;
	const author = req.body.author;
	const date = new Date();

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

	req.checkBody('title', 'Title field is required.').notEmpty();
	req.checkBody('body', 'Body field is required.').notEmpty();

	const errors = req.validationErrors();

	if ( errors ) {
		res.render('add_post', {
			errors: errors,
			title: title,
			body: body
		});
	} else {
		const posts = db.get('posts');
		//submit to db
		posts.insert({
			title: title,
			body: body,
			category: category,
			author: author,
			date: date,
			mainimage: mainImageName
		}, function(err, posts) {
			if ( err )  {
				res.send("There was an issue submitting the post");
			} else {
				req.flash('success', 'Posts submitted');
				res.location('/');
				res.redirect('/');
			}
		})
	}
});

router.post('/add-comment', function(req, res, next) {
	const post_id = req.body.post_id;
	const name = req.body.name;
	const email = req.body.email;
	const body = req.body.body;
	const comment_date = new Date();

	req.checkBody('name', 'Name field is required.').notEmpty();
	req.checkBody('email', 'Email field is required.').notEmpty();
	req.checkBody('email', 'Email is not formatted.').isEmail();
	req.checkBody('body', 'Body field is required.').notEmpty();

	const errors = req.validationErrors();

	if ( errors ) {
		//get the post
		const posts = db.get('posts');

		posts.findOne({_id: req.params.id}, function(err, post) {
			res.render('show', {
				errors: errors,
				post: post,
			});
		});
	} else {
		const comment = {
			name: name,
			email: email,
			body: body,
			comment_date: comment_date
		};
		const posts = db.get('posts');
		//update to db
		
		posts.update(
			{
				_id: post_id, 
			},
			{
				$push: {
					"comments": comment
				}
			}, function(err, doc) {
				if(err) {
					throw err;
				} else {
					req.flash('success', 'Comment Added');
					res.location('/posts/show/' + post_id);
					res.redirect('/posts/show/' + post_id);
				}
			}
		);
	}
});



module.exports = router;