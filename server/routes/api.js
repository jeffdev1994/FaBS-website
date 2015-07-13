var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Booth       = require('../models/booth');
var Day       = require('../models/day');
var SupportRequest       = require('../models/support');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to the User API for Lab 7' });	
	});


	apiRouter.post('/authenticate',function(req, res){
		console.log("very top of authenticate" + req.body.username);
		User.findOne({username: req.body.username})
			.select('username password isAdmin')
			.exec(function(err,user){
				if(err) throw err;

				//if no user with that username was found
				if(!user){
					res.json({success: false, message: 'Error: Username not found'});
				}
				else if(user){
					console.log("looking at user: " + user.username);
					//check if the passwords match
					var validPass = user.comparePassword(req.body.password);
					console.log("made it to 33");
					//if passwords dont match, fail
					if(!validPass){
						console.log("made it to 36");
						res.json({success: false, message: 'Error: Incorrect password'});
					}
					else{
						//user was found, and password is correct. create token for them
						var token = jwt.sign({id: user._id, username: user.username},superSecret,{expiresInMinutes: 150});
						res.json({success: true, isAdmin: user.isAdmin, message: 'Token set for 2.5 hours', token: token});
					}
				}
			});


		});
//-------------------------------





	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			console.log("INTO API/users POST");
			console.log("boothname:", req.body.boothName, "email:", req.body.email);
			var vendor = new User();		// create a new instance of the User model
			vendor.boothName = req.body.boothName;  // set the users name (comes from the request)
			vendor.username = req.body.username;  // set the users username (comes from the request)
			vendor.password = req.body.password1;  // set the users password (comes from the request)
			vendor.email = req.body.email;
			vendor.bio = req.body.bio;
			vendor.phone = req.body.phone;
			vendor.boothtype = req.body.boothType;
			vendor.products = req.body.products;

			vendor.save(function(err) {
				if (err) {
					console.log("error in api for saving object", err);
					// duplicate entry
					if (err.code == 11000)
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});
			


		});


	//middleware to verify token
	apiRouter.use(function(req,res,next){
		//**********************************
		//it was toke\n in the book, but the \ and n were on different lines, not sure if its supposed to be like this, page 98 of mean
		//console.log("****" + req.headers['x-access-token']);
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){
			jwt.verify(token,superSecret,function(err,decoded){
				if(err){
					return res.status(403).send({success: false, message: 'failed to authenticate token'});
				}
				else{
					//authentication was successful
					req.decoded = decoded;
					next()
				}
			});
		}
		else{
			//there was no token
			return res.status(403).send({success: false, message: 'No token provided'});
		}
	});


	//has to be below the middleware, so it cant go into .route('/users')
	// get all the users
	apiRouter.get('/users',function(req, res) {

		User.find({}, function(err, users) {
			if (err) res.send(err);

			// return the users
			res.json(users);
		});
	});


	apiRouter.route('/support')
		.post(function(req,res){
			var support = new SupportRequest();
			//just adds the date of when its being added
			support.date = new Date();
			support.title = req.body.title;
			support.body = req.body.body;

			support.save(function(err){
				if(err){
					console.log(err);
					return res.send(err);
				}
				res.json({success: true, message: 'Request Created!'});
			});

		})

		.get(function(req,res){
			SupportRequest.find({}, function(err, requests) {
				if (err) res.send(err);

				// return the users
				res.json(requests);
			});
		});


	apiRouter.route('/support/:id')
		.delete(function(req,res){
			SupportRequest.findByIdAndRemove(req.params.id, function(err, requests) {
				if (err) res.send(err);

				// return the users
				res.json({success: true, message: 'Request deleted!'});
			});
		});

	//when creating a booth. it adds itself into users, and into the day
	//if the day is not created yet, it will created, that is why the /days route may not be needed
	apiRouter.route('/booths')
		.post(function(req,res) {
			var booth = new Booth();		// create a new instance of the Booth model
			booth.booth_id = req.body.booth_id;  // set the users name (comes from the request)
			booth.timeSlot = req.body.timeSlot;  // set the users username (comes from the request)
			booth.dateSlot = req.body.dateSlot;  // set the users password (comes from the request)
			booth.user_id = req.body.user_id;

			booth.save(function (err) {
				if (err) {
					console.log("error in api for saving booth", err);
					if (err.code == 11000)
						return res.json({success: false, message: 'a booth with that id already exists'});
					else
						return res.json({success: false, message: 'possibly missing required fields'});
				} else {

					// return a message
					res.json({message: 'Booth created!'});
				}
			});
		});




	apiRouter.route('/booths/:booth_id')
		.delete(function(req, res) {
			console.log("into delete route for booths");

			Booth.findById(req.params.booth_id, function(err, booth){
				if (err) console.log(err);

				booth.remove(function(err){
					console.log("into delete route for booths2");
				});

				res.json({ message: 'Successfully deleted' });
			});
		});
/**
		.put(function(req, res) {
			Booth.findOne({
				booth_id: req.body.booth_id,
				timeSlot: req.body.timeSlot,
				dateSlot: req.body.dateSlot
			}, function (err, booth) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.user_id) booth.user_id = req.body.user_id;
				if (req.body.available) booth.available = req.body.available;

				// save the user
				booth.save(function (err) {
					if (err) res.send(err);

					// return a message
					res.json({message: 'booth updated!'});
				});

			});
		});
*/



	apiRouter.route('/days')
		//TODO: may not actually need this post method. booths always create days, and that is done without this
		.post(function(req,res){
			var day = new Day();
			day.dayName = req.body.dayName;

			day.save(function(err) {
				if (err) {
					console.log("error in api for saving day", err);
					if (err.code == 11000)
						return res.json({ success: false, message: 'A day with that name already exists.'});
					else
						return res.send(err);
				}

				// return a message
				res.json({ message: 'day created!' });
			});
		});



	apiRouter.route('/days/:dayName')
		.get(function(req, res){
			Day.findOne({dayName: req.params.dayName})
				.exec(function(err,day){
					if(err) throw err;

					//if that day is not there
					if(!day){
						return res.json({ success: false, message: 'day not created yet.'});
					}
					//if the booth is there, return it
					else if(day){
						res.json(day);
					}
				});
		});


	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			//console.log(req.params.user._id);
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				//console.log("@@@@@@@@ "+ user.username );
				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.products) user.products = req.body.products;
				if (req.body.bio) user.bio = req.body.bio;
				if (req.body.email) user.email = req.body.email;
				if (req.body.phone) user.phone = req.body.phone;
				if (req.body.boothName) user.boothName = req.body.boothName;
				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});






	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		//finds the user based on there token.
		//this value is started by middleware

		res.send(req.decoded);
	});

	return apiRouter;

};