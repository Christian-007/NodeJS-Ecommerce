// POST routes
var validator = require('validator');
var isEmptyLodash = require('lodash/isEmpty');
var User = require('./models/user');
var Uploads = require('./models/uploads');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var config = require('./config');
var multer  = require('multer');
var path = require('path');

// --- REGISTER USER SCRIPTS ---
function commonValidation(data) {
  let errors = {};

  if(validator.isEmpty(data.fname)) {
    errors.fname = 'This field is required';
  }

  if(validator.isEmpty(data.lname)) {
    errors.lname = 'This field is required';
  }

  if(validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }

  if(!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid'; 
  }

  if(validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }

  if(validator.isEmpty(data.confirmPass)) {
    errors.confirmPass = 'This field is required';
  }

  if(!validator.equals(data.password,data.confirmPass)) {
    errors.confirmPass = 'Password must match';
  }

  return {
    errors,
    isValid: isEmptyLodash(errors)
  }
}

function validateInput(data, otherValidations) {
  let { errors } = otherValidations(data);

  return User.query({
    where: { email: data.email }
  }).fetch().then(user => {
    if(user) {
      if(user.get('email') === data.email){
        errors.email = 'There is a user with such email';
      }
    }

    return {
      errors,
      isValid: isEmptyLodash(errors)
    };
  });
}

exports.register = function(req, res){
  /*const { errors, isValid } = commonValidation(req.body);
  if(!isValid) {
    res.status(400).json(errors);
  }*/
  setTimeout(function() { //Start the timer
    validateInput(req.body, commonValidation).then(({ errors, isValid }) => {
      if(!isValid) {
        res.status(400).json(errors);
      }else {
        const { fname, lname, email, password } = req.body;
        const password_digest = bcrypt.hashSync(password, 10);

        User.forge({
          fname, lname, email, password_digest
        }, { hasTimestamps: true }).save()
          .then(user => res.json({ success: true }))
          .catch(err => res.status(500).json({ error: err }));
      }
    });
  }, 3000)
};

// --- LOGIN USER SCRIPTS ---
function loginFieldValidation(data) {
  let errors = {};

  if(validator.isEmpty(data.email)) {
    errors.email = 'This field is required';
  }

  if(validator.isEmpty(data.password)) {
    errors.password = 'This field is required';
  }

  return {
    errors,
    isValid: isEmptyLodash(errors)
  }
}

exports.login = function(req, res) {
  const { errors, isValid } = loginFieldValidation(req.body);
  if(!isValid) {
    res.status(400).json(errors);
  }
  else {
    const { email, password } = req.body;

    User.query({
      where: { email: email }
    }).fetch().then(user => {
      if(user) {
        if(bcrypt.compareSync(password, user.get('password_digest'))) {
          const token = jwt.sign({
            id: user.get('id'),
            fname: user.get('fname'),
            lname: user.get('lname'),
            email: user.get('email')
          }, config.jwtSecret);
          res.json({ token });
        } else {
          errors.form = 'Invalid credentials';
          res.status(401).json(errors);
        }
      } else {
        errors.form = 'Invalid credentials';
        res.status(401).json(errors);
      }
    });
  }
};

// File upload scripts
exports.fileUpload = function(req, res) {
  var modifiedFileName = '';

  // Storing and renaming the photo
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      modifiedFileName = Date.now() + path.extname(file.originalname);
      cb(null, modifiedFileName);
    }
  });

  // Upload the photo to the specified storage
  var upload = multer({
      storage: storage
  }).any();

  // Execute upload
  upload(req, res, function(err) {
    const { photo_name, user_id, fullName } = req.body;

    if (err) {
        console.log(err);
        return res.end('Error');
    } else {
        console.log(req.body);

        // Insert record to the database
        Uploads.forge({
          'photo_name': photo_name, 
          'fullName': fullName, 
          'filename': modifiedFileName,
          'user_id': user_id
        }, { hasTimestamps: true }).save()
          .then(uploads => res.json({ success: true }))
          .catch(err => res.status(500).json({ error: err }));

        // req.files.forEach(function(item) {
        //     console.log(item);
        // });
        // res.end('File uploaded');
    }
  });
}