const express = require('express');
const router = express.Router();
let User = require('../models/User');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
	res.render('register', {'title': 'Register'})
});

router.get('/login', function(req, res, next) {
	res.render('login', {'title': 'Login'})
});

router.post('/register', function(req, res, next) {
	const user = {};
	const profileImageName = 'noimage.png';

	user.username = req.body.username;
	user.name = req.body.name;
	user.email = req.body.email;
	user.password = req.body.password;
	user.confirmPwd = req.body.password2;

	// check for image field
	if( req.files && req.files.profileimage ) {
		console.log('Uploading file...');
		const profileImageOriginalName	= req.files.profileimage.originalname;
		const profileImageName 			= req.files.profileimage.name;
		const profileImageMime 			= req.files.profileimage.mimetype;
		const profileImagePath			= req.files.profileimage.path;
		const profileImageExt			= req.files.profileimage.extension;
		const profileImageSize			= req.files.profileimage.size;
	}

	//form validation
	//@params ('field name', 'error message').method();
	req.checkBody('name', 'Name field is required.').notEmpty();
	req.checkBody('email', 'Email field is required.').notEmpty();
	req.checkBody('email', 'Email not valid.').isEmail();
	req.checkBody('username', 'Username field is required.').notEmpty();
	req.checkBody('password', 'Password field is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);


	//check for errors
	const errors = req.validationErrors();

	if ( errors ) {
		//pass variables
		res.render('register',  { 
			errors: errors,
			name: user.name,
			email: user.email,
			password: user.password,
			password2: user.confirmPwd
		});
	} else {
		//instantiate new user to be save

		const newUser = new User({
			username: user.username,
			name: user.name,
			email: user.email,
			password: user.password,
			profileimage: profileImageName
		});

		//create user
		User.createUser(newUser, function(err, user) {
			if (err) throw err;

			console.log(user);
		});

		//success message
		req.flash('success', 'You are now registered and may log in.');

		res.location('/');
		res.redirect('/');
	}
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;

			if (!user) {
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) throw err;

				if (isMatch) {
					return done(null, user);
				} else {
					console.log('Invalid Password.');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', 
	passport.authenticate('local', {
		failureRedirect: '/users/login',
		failureFlash: 'Invalid username or password'
	}),
	function(req, res) {
		console.log('Authentication successful');
		req.flash('success', 'You are logged in.');
		res.redirect('/');	
	});

router.get('/logout', function(req, res) {
	req.logout();
	req.flash('success', 'You have logged out.');
	res.redirect('/users/login');
});

module.exports = router;
