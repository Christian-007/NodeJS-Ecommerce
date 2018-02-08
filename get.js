var User = require('./models/user');
var Uploads = require('./models/uploads');
var path = require('path');

exports.identifier = function(req, res){
  User.query({
    select: ['fname', 'lname', 'email'],
    where: { id: req.params.identifier}
  }).fetch().then( user => {
    res.json({ user });
  });
};

exports.getPhoto = function (req, res) {
  res.sendFile(path.resolve('./uploads/'+req.params.img_name));
};

exports.photoCollections = function (req, res) {

  /*User.where({id: 1}).fetch({withRelated: ['uploads']}).then(function(user) {
    console.log(user.related('uploads').toJSON());
    res.json({ user });
  }).catch(function(err) {
    console.error(err);
  });*/

  /*User.query({
    select: ['fname', 'lname'],
    where: { id: 1}
  }).fetch({withRelated: ['uploads']}).then(function(user) {
    console.log(user.related('uploads').toJSON());
    res.json({ user });
  }).catch(function(err) {
    console.error(err);
  });*/

  Uploads.query().select().then(function(uploads) {
    res.json({ uploads });
  }).catch(function(err) {
    console.error(err);
  });
};