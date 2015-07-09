var bodyParser = require('body-parser');
var User       = require('../models/user');
var Booking    = require('../models/booking');
var jwt        = require('jsonwebtoken');
var config     = require('../../config');
var moment     = require('moment');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// test route to make sure everything is working
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to the User API for Fernwood Farmers Market' });
	});

/*
	apiRouter.get('/users12345/:username', function(req,res){
		User.findOne({username: req.body.username},'_id',function(err, id){
			res.json(id);
		});
	});
*/
	apiRouter.post('/authenticate',function(req, res){
		console.log("very top of authenticate" + req.body.username);
		User.findOne({username: req.body.username})
			.select('username password ')
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
						//TODO: consider how long the token should last. is 2.5 enough, or not long enough?
						var token = jwt.sign({id: user._id, username: user.username},superSecret,{expiresInMinutes: 150});
						res.json({success: true , message: 'Token set for 2.5 hours', token: token});
					}
				}
			});


		});


	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
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

		})

		//TODO:	needs to be put under the middleware
		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);
				// return the users
				res.json(users);
			})

		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);
				
				res.json({ message: 'Successfully deleted' });
			});
		});

		});


	//middleware to verify token
	//not sure where this should go yet. but i think it goes overtop of all functions that need to be logged in to use
	//not sure how this stops them from getting into vendor main and stuff though
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
					next();
				}
			});
		}
		else{
			//there was no token
			return res.status(403).send({success: false, message: 'No token provided'});
		}
	});

	apiRouter.route('/booking')
		.post(function(req,res){
			var booking      = new Booking();		// create a new instance of the Booth model
			booking.timeSlot = req.body.timeSlot;
			booking.date     = moment(req.body.date, "MM-DD-YYYY");
			booking.boothName = req.body.boothName;
			booking.userId   = req.decoded.id;
			
			console.log(req);

			booking.save(function(err) {
				if (err) {
					console.log("error in api for saving booth", err);
					return res.status(500).send(err);
				}

				// return a message
				res.json({ message: 'Booth created!' });
			});
		});

	apiRouter.route('/booking/:curDate')
		.get(function(req, res){
			var curDate = moment(req.params.curDate, "MM-DD-YYYY");

			Booking.find({date: curDate}, function(err, booking) {
				if (err) {
					console.log("Invalid Date?", err);
					return res.send(err);
				}
				res.json(booking);
			});
		});

	apiRouter.route('/users/cancelBooking/:id')
		.delete(function(req,res){
			Booking.remove({
				_id: req.params.id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'The associated booking has been successfully deleted!' });
			});
		});

	apiRouter.route('/users/bookings')
		.get(function(req, res) {
			Booking.find({userId: req.decoded.id}, function(err, bookings) {
				if (err) {
					console.log("error in api for getting bookings", err);
					return res.status(500).send(err);
				}

				// return a message
				res.json(bookings);
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
		//finds the user based on their token.
		//this value is started by middleware

		res.send(req.decoded);
	});

	return apiRouter;
};
