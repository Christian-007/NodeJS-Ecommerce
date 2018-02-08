var express = require('express');
var cors = require('cors') // Cross Origin Resource Sharing
var path = require('path');
var fs = require('fs');
var postRequest = require('./post');
var getRequest = require('./get');
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });

// Encrypt password
const saltRounds = 10;

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cors());

// load index page
app.get('/', function(req, res) {
  res.send('Server is running');
});

// POST upload file
app.post('/api/fileUpload', postRequest.fileUpload);

// POST register user
app.post('/api/users', postRequest.register);

// POST login user
app.post('/api/login', postRequest.login);

// GET user detail
app.get('/api/users/:identifier', getRequest.identifier);

// GET uploaded photos path
app.get('/api/photo/:img_name', getRequest.getPhoto);

// GET available photos
app.get('/api/photo', getRequest.photoCollections);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});