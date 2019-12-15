const express = require('express');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
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

var port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on post ${port}..`);
});
