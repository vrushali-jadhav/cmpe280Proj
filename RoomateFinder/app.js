const express = require('express');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const app1 = express();
const nodemailer = require('nodemailer');
const multer = require('multer');
const notifier = require('node-notifier');
const { google } = require('googleapis');
const OAuth2Data = require('./google_key.json');
const ejsLint = require('ejs-lint');
var runner = require("child_process");
const open = require('open');



const Swal = require('sweetalert2')

var username1 = "";
var userid1 = "";
var username2 = "";
var userid2 = "";
var postid = "";
var user1logged = false;

var server = require('http').createServer(app1);
var io = require('socket.io').listen(server);

users = ["Vrushali", "Halak"];
connections = [];

server.listen(process.env.PORT || 3001);
console.log("chat server app..");
app1.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app1.set('view engine', 'ejs'); // configure template engine
app1.use(bodyParser.urlencoded({ extended: false }));
app1.use(bodyParser.json()); // parse form data client
app1.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app1.use(fileUpload()); // configure fileupload
app1.set('scripts', __dirname + '/scripts');

const {chat} = require('./routes/chat');
app1.get('/chat', chat);

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log("Connected %s sockets connected..", connections.length);

    socket.on('disconnect', function(data){
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected..', connections.length);
    });

    //sending messages
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg:data, user: socket.username})
    });

    //new user
    socket.on('new user', function(data, callback)
    {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames()
    {
        io.sockets.emit('get users', users);
    }
});


//create connection
const db = mysql.createConnection({
	host: '35.167.216.61',
	user: 'root',
	password: 'Admin@123',
	database: 'RoommateDatabase'
});

//connect to db
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log('SQL connection established');
});

global.db = db;

var storage = multer.diskStorage({

	destination: function (req, file, callback) {
	  callback(null, './public/uploads');
	},
	filename: function(req, file, callback) {
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({ storage: storage }).array('userPhoto', 5);

app.post('/api/photo', function(req, res) {
	upload(req, res, function(err) {
		//console.log(req.body);
		//console.log(req.files);
		if (err) {
			console.log(err);
			return res.end('Error uploading file.');
		} else {
			console.log('returning..');
			console.log(req.files);
			var i = 0;
			console.log('post id is: ' + postid);
			console.log('lenghth is:' + req.files.length);
			for (i = 0; i < req.files.length; i++) {
				let currentImage = req.files[i];

				console.log("oye: "+req.files[i]);
				console.log("hoye: "+currentImage["path"]);
				let pathOfImage = currentImage['path'].substr(7,currentImage['path'].length);
				// `INSERT INTO PostsAndPictures (postid, images) values (${postid}, "${pathOfImage}")`;
				let savePostAndImage = `UPDATE Posts SET images = "${pathOfImage}" WHERE postid = ${postid}`;
				console.log("Query: "+savePostAndImage);

				db.query(savePostAndImage, (err, result) => {
					if (err) {
						console.log(err);
						res.redirect('/');
					} else {
						console.log('uploaded image: ' + i);
					}
				});
			}
			return res.redirect('/getuserlisting6');
		}
	});
});

//app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload
app.set('scripts', __dirname + '/scripts');

const { getHomePage } = require('./routes/index');
const { getLoginPage } = require('./routes/login');
const { getRegisterPage } = require('./routes/register');
const { getUserHomePage } = require('./routes/home');

const {getUserListing} = require('./routes/listplace');
const {getUserListing1} = require('./routes/listplace');
const {getUserListing2} = require('./routes/listplace');
const {getUserListing3} = require('./routes/listplace');
const {getUserListing4} = require('./routes/listplace');
const {getUserListing5} = require('./routes/listplace');
const {getUserListing6} = require('./routes/listplace');
const {getUserListings} = require('./routes/view_listing');

app.get('/getuserlisting1', getUserListing1);
app.get('/getuserlisting2', getUserListing2);
app.get('/getuserlisting3', getUserListing3);
app.get('/getuserlisting4', getUserListing4);
app.get('/getuserlisting5', getUserListing5);
app.get('/getuserlisting6', getUserListing6);
app.get('/getuserlistings', getUserListings);

app.post('/postuserlisting', function(req, res) {
	console.log('Here in post..');
	
			//console.log(req.body);
			var valuesToStore = req.body;
			let savepostquery = `INSERT INTO Posts (gender_preference, pet_friendly, smoking_allowed, room_type, movein_date, gym, pool, laundry, other_details, address, userid, rent) values ("${valuesToStore["gender"]}", "${valuesToStore["petfriendly"]}", ${valuesToStore["smokingfriendly"]}, "${valuesToStore["place"]}", "${valuesToStore["date"]}", ${valuesToStore["gym"]}, ${valuesToStore["pool"]}, ${valuesToStore["laundry"]}, "${valuesToStore["other"]}","${valuesToStore["add"]}", ${userid1}, "${valuesToStore["amount"]}")`;
			
			db.query(savepostquery, (err, result) => {
				if (err) {
					console.log(err);
					res.redirect('/');
				}
				else
				{
					console.log(result);
					console.log("Success!");
					postid = result["insertId"];
					console.log("post id is: "+ postid);
					res.send({
						status: 200,
						success: 'Post saved to DB'
					});	
				}
			});
		}
	);

app.get(['/home','/2','/3','/4','/5','/6','/7','/8','/9','/10'], function(req,res){
	var url = req.originalUrl.substr(1, req.originalUrl.length);
	if (url != 'home')
		url = parseInt(url);
	else url = 1;

	let Posts = `SELECT * FROM Posts `;

	db.query(Posts, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(JSON.stringify(result[0].images));
			console.log('image: blob ' + result);
			// if(username1 = "")
			// username1 = "Vrushali";
			if (user1logged == false){
				console.log("Looged in",user1logged);
				if (username1 == "")
				res.render('homepage.ejs', { posts: result, page : url, user: "Vrushali"});
				else
				res.render('homepage.ejs', { posts: result, page : url, user: username1});
				user1logged = true;
			}
			else res.render('homepage.ejs', { posts: result, page : url, user: username2});
		}
	});
});

// routes for the app
app.get('/', getHomePage);
app.get('/homepage', getUserHomePage);
app.get('/login', getLoginPage);
app.post('/loginpost', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	db.query('SELECT * FROM Users WHERE emailid = ?', [ email ], function(error, results, fields) {
		if (error) {
			// console.log("error ocurred",error);
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else {
			// console.log('The solution is: ', results);
			if (results.length > 0) {
				if (results[0].password == password) {
					console.log('Success');
					
					
					if(username1=="")
					{
						username1 = results[0].firstname;
						userid1 = results[0].userid;
					}
					else
					{
						username2 = results[0].firstname;
						userid2 = results[0].userid;
					}
					console.log("user 1: "+username1);
					console.log("user id1: "+userid1);
					console.log("user 2: "+username2);
					console.log("user id2: "+userid2);
					res.redirect('/home');
				} else {
					res.send({
						code: 204,
						success: 'Email and password does not match'
					});
				}
			} else {
				res.send({
					code: 204,
					success: 'Email does not exits'
				});
			}
		}
	});
});

app.get('/register', getRegisterPage);
app.get('/register', getRegisterPage);


var otp;
const high = 999999;
const low = 111111;
var email;
app.post('/registerpost', function(req, res) {
	email = req.body.email;
	var password = req.body.password;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var dob = req.body.dob;
	var gender = req.body.gender;
	console.log(email, password, fname, lname, dob, gender);
	var sql = `INSERT INTO Users(gender, password, firstname, lastname, emailid, dob, emailverfied) VALUES(?,?,?,?,?,?,?)`;

	db.query(sql, [ gender, password, fname, lname, email, dob, 0 ], function(error, results) {
		if (error) {
			console.log('error ocurred', error);
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else {
			console.log('Success');

			otp = Math.floor(Math.random() * (high - low) + low);
			console.log(otp);
			const data = 'Please Verify your email with the the One-time password given: '.concat(otp.toString());
			console.log(data);
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ourroomatefinder@gmail.com',
					pass: '25623360'
				}
			});

			var mailOptions = {
				from: 'roommatefinder@verificationemail.com',
				to: email,
				subject: 'Email Verification - RoommateFinder',
				text: data
			};

			transporter.sendMail(mailOptions, function(error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			notifier.notify({
				title: 'Verification Email Sent!',
				message: 'Enter the OTP to verify your Email',
				icon: 'dwb-logo.png',
				contentImage: 'blog.png',
				sound: 'ding.mp3',
				wait: true
			});

			res.render('verifyemail.ejs');
		}
	});
});

app.post('/otppost', function(req, res) {
	var otpposted = req.body.otp;
	if (otpposted == otp) {
		console.log('here');

		var sql = `UPDATE Users SET emailverfied = '1' WHERE emailid = ?`;

		db.query(sql, [ email ], function(error, results) {
			if (error) {
				console.log('error occurred', error);
				res.send({
					code: 400,
					failed: 'error occurred'
				});
			} else {
				console.log('Success sign-up');
			}
		});
		notifier.notify({
			title: 'Congrats!! Email Verfied!',
			message: 'Login to your account!',
			icon: 'dwb-logo.png',
			contentImage: 'blog.png',
			sound: 'ding.mp3',
			wait: true
		});
		res.render('login.ejs');
	} else {
		notifier.notify({
			title: 'Email Verification failed',
			message: 'Entered OTP is incorrect. Please try again!',
			icon: 'dwb-logo.png',
			contentImage: 'blog.png',
			sound: 'ding.mp3',
			wait: true
		});
		res.render('verifyemail.ejs');
	}
});

const CLIENT_ID = OAuth2Data.client.id;
const CLIENT_SECRET = OAuth2Data.client.secret;
const REDIRECT_URL = OAuth2Data.client.redirect;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var authed = false;

app.get('/gmaillogin', (req, res) => {
	if (!authed) {
		// Generate an OAuth URL and redirect there
		const url = oAuth2Client.generateAuthUrl({
			access_type: 'online',
			scope: 'https://www.googleapis.com/auth/gmail.readonly'
		});
		//console.log(url)
		res.redirect(url);
	} else {
		const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
		// console.log("gmail",gmail);
		gmail.users.labels.list(
			{
				userId: 'me'
			},
			(err, res) => {
				if (err) return console.log('The API returned an error: ' + err);
				const labels = res.data.labels;
				//console.log("Labels",labels);
				if (labels.length) {
					console.log('Labels:');
					labels.forEach((label) => {
						//    console.log(`- ${label.name}`);
					});
				} else {
					console.log('No labels found.');
				}
			}
		);
		res.send('Logged in');
	}
});

app.get('/auth/google/callback', function(req, res) {
	const code = req.query.code;
	if (code) {
		// Get an access token based on our OAuth code
		oAuth2Client.getToken(code, function(err, tokens) {
			if (err) {
				console.log('Error authenticating');
				console.log(err);
			} else {
				console.log('Successfully authenticated');
				oAuth2Client.setCredentials(tokens);
				authed = true;
				getGoogleAccountFromCode(oAuth2Client);
				console.log('in here');
				res.redirect('/home');
			}
		});
	}
});
function createConnection() {
	return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
}
function getGooglePlusApi(auth) {
	return google.plus({ version: 'v1', auth });
}
async function getGoogleAccountFromCode(oAuth2Client) {
	debugger;
	await getGooglePlusApi(oAuth2Client, function(err, plus) {
		console.log('i here');
		if (err) {
			console.log('Error authenticating');
			console.log(err);
		} else {
			const me = plus.people.get({ userId: 'me' });
			const userGoogleId = me.data.id;
			const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
			console.log('userLogin', userGoogleEmail);
			return {
				id: userGoogleId,
				email: userGoogleEmail,
				tokens: tokens
			};
		}
	});
}

app.get('/runphp', function(req, res) {
	var phpScriptPath = "/Applications/AMPPS/www/CMPE280/signinv3.php";
	var argsString = "value1,value2,value3";
	require("openurl").open("http://localhost/CMPE280/signinv3.php")
 	runner.exec("php " + phpScriptPath + " " +argsString, function(err, phpResponse, stderr) {
 	if(err) console.log("err",err); /* log error */
	 console.log( phpResponse );
	 console.log( "done");
	 //window.close();
 });

}
);
app.get("/getUserListing", function(req,res){
	let Posts = `SELECT * FROM Posts where userid = ${userid1}`;
	console.log("here");
	db.query(Posts, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log(result[0].rent);
			console.log('image: blob ' + result.length);
			res.render('list_place.ejs', { posts: result });
		}
	});	
})

app.get("/logout", function(req,res){
	res.render("login.ejs");
})

app.post('/postLike', function(req, res) {
	console.log("in post like")
	var valuesToStore = req.body;
	console.log("Userid2 is:" + userid2);
	let savepostquery = `INSERT INTO PostsLikedBy (postid, userid) values ("${valuesToStore["postId"]}", ${userid2})`;
			
			db.query(savepostquery, (err, result) => {
				if (err) {
					console.log(err);
				}
				else
				{
					console.log("Success!");
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: 'Your likes has been sent!',
						showConfirmButton: false,
						timer: 1500
					  });
					res.send({
						status: 200,
						success: 'Mapping saved to DB'
					});	
				}
			});
});

var uid = "";
app.post('/sendLikeNotification', function(req, res) {
	console.log("in sendLikeNotification ")
	var valuesToStore = req.body;
			var arrayOfNames = [];
			var i;
			let savepostquery = `SELECT userid FROM PostsLikedBy where postid="${valuesToStore["postId"]}"`;
			
			db.query(savepostquery, (err, result) => {
				if (err) {
					console.log(err);
					res.redirect('/');
				}
				else
				{
					if(JSON.stringify(result[0])=="" || result[0]==undefined)
					{
						res.send({
							status: 200,
							success: 'Mapping saved to DB',
							likedby: ""
						});	
					}
					else
					{
							var row = result[0];
							console.log("row:" +row);
							uid = row["userid"];
							console.log("umm:" +row["userid"]);
							let saveuserpostmapping = `SELECT firstname FROM RoommateDatabase.Users where userid=${uid}`;
							db.query(saveuserpostmapping, (err, result) => {
								if (err) {
									console.log(err);
									res.redirect('/');
								}
								else
								{
									console.log("Success in sendLikeNotification!");
									console.log("r: " +JSON.stringify(result));
									var nrow = result[0];
									var fname = nrow["firstname"];
									console.log("fname:" +fname);
									res.send({
										status: 200,
										success: 'Mapping saved to DB',
										likedby: fname
									});	
								}
							});
					}
				}
			});
});

app.post('/sort', function(req, res) {
	var b = req.body.budget[1];
	var budget = parseInt(b); 
	budget = budget * 100;
	var gender = req.body.gender;
	var accomodation = req.body.accomodation;
	var pets = req.body.pets;
	console.log("pets",pets);
	console.log("gender",gender);
	console.log("budget",budget);
	console.log("Accomodation",accomodation);

	//res.redirect('/home');

	let sortquery = `SELECT * FROM Posts WHERE rent <= ${budget} and gender_preference = "${gender}" and room_type = 
					"${accomodation}"`  ;
	db.query(sortquery, function(error, results, fields) {
		if (error) {
			// console.log("error ocurred",error);
			res.send({
				code: 400,
				failed: 'error ocurred'
			});
		} else {
			res.render('homepage.ejs', { posts: results, page : 1, user: username1});
		}
	});
}); 

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on post ${port}..`);
});
